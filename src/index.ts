// Importing global styles
import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { apiCache, handleSuccess } from './components/cacheAPI';
import { State, Page, Card } from './components/page';
import { PopupComponent, Basket, Order, Contact, BasketItem } from './components/popup';
import { ProductAPI } from './components/productAPI';
import { IProd, IOrderF } from './types';
import { CDN_URL, API_URL, settings } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';


// Importing necessary modules and constants


// Initializing API and event emitter
const api = new ProductAPI(CDN_URL, API_URL);
const events = new EventEmitter();

// Retrieving template elements based on settings
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>(`#${settings.templateCard}`);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(`#${settings.templatePrev}`);
const basketTemplate = ensureElement<HTMLTemplateElement>(`#${settings.basketTemplate}`);
const basketCardTemplate = ensureElement<HTMLTemplateElement>(`#${settings.templateBask}`);
const orderTemplate = ensureElement<HTMLTemplateElement>(`#${settings.orderTemplate}`);
const contactsTemplate = ensureElement<HTMLTemplateElement>(`#${settings.contactsTemplate}`);
export const successTemplate = ensureElement<HTMLTemplateElement>(`#${settings.successTemplate}`);

// Initializing application state, page, and popup components
const state = new State({}, events);
const page = new Page(document.body, events)
export	const popup = new PopupComponent(ensureElement<HTMLElement>(`#${settings.modalContainer}`), events);

// Initializing basket, order, and contact components
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contact = new Contact(cloneTemplate(contactsTemplate), events);

// Handling event to open basket popup
events.on('basket:open', () => {
  popup.render({
    content: basket.render(),
  });
});

// Handling items change event
events.on('items:changed', () => {
  page.catalogue = state.catalogue.map((item) => {
    const card = new Card(`card`, cloneTemplate(cardCatalogTemplate), {
      onClick: () => {
        events.emit('card:select', item);
      }
    });
    return card.render({
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.price,
      category: item.category,
    });
  });
});

// Handling basket change event
events.on('basket:changed', () => {
  basket.items = state.getCards().map((item, i) => {
    const card = new BasketItem(cloneTemplate(basketCardTemplate), {
      onClick: () => {
        state.toggleOrderItem(item.id, false);
        page.counter = state.order.items.length;
        basket.items = basket.items.filter((i) => i.dataset.id !== item.id);
        basket.total = state.total();
        basket.selected = state.order.items;
      },
    });
    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: i + 1,
    });
  });
  page.counter = state.order.items.length;
  basket.total = state.total();
  basket.selected = state.order.items;
});

// Handling card selection event
events.on('card:select', (item: IProd) => {
	if (item) {
			api.getProductItem(item.id)
				.then((res) => {
					const card = new Card('card', cloneTemplate(cardPreviewTemplate), {
						onClick: (evt) => {
							const btn = evt.target as HTMLButtonElement;
							if (btn.textContent === 'Купить') {
								btn.textContent = 'В корзину';
								state.toggleOrderItem(res.id, true);
								page.counter = state.order.items.length;
								events.emit('basket:changed');
							} else if (btn.textContent === 'В корзину') {
								events.emit('basket:open', item);
							};
						}
					});
					
					card.isEmpty(state.order.items.includes(res.id));

					popup.render({
						content: card.render({
							title: res.title,
							image: res.image,
							description: res.description,
							price: res.price,
							category: res.category
						}),
					});
				})
				.catch((err) => {
					console.error(`Error: ` + err);
				});
	} else {
		popup.close();
	} 
})

// Handling order open event
events.on('order:open', () => {
	popup.render({
		content: order.render({
			address: state.order.address,
			validation: state.isFilledFieldsOrder(),
			errors: [],
		}),
	});
});

// Handling contacts open event
events.on('contacts:open', () => {
	popup.render({
		content: contact.render({
			email: state.order.email,
			phone: state.order.phone,
			validation: state.isFilledFieldsContacts(),
			errors: [],
		}),
	});
});

// Handling form order errors change event
events.on('formOrderErrors:change', (errors: Partial<IOrderF>) => {
	const { address, payment } = errors;
	order.valid = !address && !payment;
	order.errors = Object.values({ address, payment })
		.filter((i) => !! i)
		.join('; ');
});

// Handling form contacts errors change event
events.on('formContactsErrors:change', (errors: Partial<IOrderF>) => {
	const { email, phone } = errors;
	contact.valid = !email && !phone;
	contact.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

// Handling modal open event
events.on('modal:open', () => {
	page.locked = true;
})

// Handling modal close event
events.on('modal:close', () => {
	page.locked = false;
})

// Event handler for order submission
events.on('order:submit', () => {
  const cachedResult = apiCache[JSON.stringify(state.order)]; 
  if (cachedResult) {    					// Check if the result is already cached
    handleSuccess(cachedResult); 	// Use the cached result
  } else {
    api 	
      .orderProduct(state.order)  // Make an API request to order the product
      .then((res) => {
        apiCache[JSON.stringify(state.order)] = res;	// Cache the API response
        state.clearBasket();													// Clear the basket
        handleSuccess(res);										        // Handle the success response
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

// Handling order change event
events.on('order:change', (data: {field: keyof IOrderF; value: string}) => {
	state.setField(data.field, data.value);
})

// Fetching product list from the API
api
	.getProductList()
	.then(state.setCatalogue.bind(state))
	.catch((err) => {
		console.error(err);
	});