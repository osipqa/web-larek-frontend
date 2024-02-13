import { EventEmitter, IEvents } from './events';
import { createElement, ensureElement } from '../../utils/utils';
import { Component } from './abstract';
import { IAct, IActS, IBasket, IOrderF, IOrders, IState, ISuccess } from '../../types';
import { Card } from './page';

// Interface defining the data structure for Popup Component
export interface PopupComponentData {
  content: HTMLElement;
}

// Class for Popup Component, extending the base Component class
export class PopupComponent extends Component<PopupComponentData> {
  protected _closeBtn: HTMLButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);
  protected _content: HTMLElement = ensureElement<HTMLElement>('.modal__content', this.container);

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this._closeBtn.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  // Setter for content to replace existing content with a new one
  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  // Method to open the popup and emit an event
  open() {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  // Method to close the popup, clear content, and emit an event
  close() {
    this.container.classList.remove('modal_active');
    this.content = null;
    this.events.emit('modal:close');
  }
  // Render method to display the popup with specified content
  render(data: PopupComponentData): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}

// Class for Basket Component, extending the base Component class
export class Basket extends Component<IBasket> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');
    
    // Event listener for opening the order form
		this._button.addEventListener('click', () => {
				events.emit('order:open');
		});


    this.items = [];
  }

  // Setter for items to update the basket list
  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {textContent: `Корзина пуста`}));
    };
  }

  // Getter for items to retrieve the current basket items
  get items(): HTMLElement[] {
    if (this._list.childElementCount === 0) {
      return [
        createElement<HTMLParagraphElement>('p', { 
          textContent: `Корзина пуста` 
        })
      ];
    }
    return Array.from(this._list.children) as HTMLElement[];
  }
  
  // Setter for selected items to enable/disable the order button
	set selected(items: string[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
		} else {
			this.setDisabled(this._button, true);
		}
	}

  // Setter for total to display the total price
	set total(total: number) {
		this.setText(this._total, total + ' синапсов');
	}
}

// Class for Form Component, extending the base Component class
export class Form<T> extends Component<IState> {
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

    // Event listener for input changes in the form
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});
	}

  // Method to handle input changes and emit the corresponding event
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`order:change`, { field, value });
	}

  // Method to handle payment method changes and emit the corresponding event
	protected onPaymentChange(value: string) {
    console.log('Payment method changed:', value);
		this.events.emit(`order:change`, { field: 'payment', value });
	}
  // Setter for errors to display form errors
	set errors(value: string) {
		this.setText(this._errors, value);
	}
  // Render method to display the form with the specified state
	render(state: Partial<T> & IState) {
		const { validation, errors, ...inputs } = state;
		super.render({ validation, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}

// Class for Contact Component, extending the Form Component
export class Contact extends Form<IOrders> {
  protected _submit: HTMLButtonElement;
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    // Event listener for submitting the form (opening order form)
    this.container.addEventListener('submit', (evt: Event) => {
      evt.preventDefault();
      this.events.emit('order:submit');
    })
  }
  set valid(value: boolean) { this._submit.disabled = !value; };                                                  // Setter for valid to enable/disable the submit button
  set phone(value: string) { ( this.container.elements.namedItem('phone') as HTMLInputElement).value = value; };  // Setter for phone input value
  set email(value: string) { ( this.container.elements.namedItem('email') as HTMLInputElement).value = value; };  // Setter for email input value
}

// Class for Order Component, extending the Form Component
export class Order extends Form<IOrderF> {
  protected _submit: HTMLButtonElement;
  protected _btn: HTMLButtonElement;
  protected _btnCard: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);

    this._btn = container.querySelector('[name=cash]');

    this._btnCard = container.querySelector('[name=card]');

    // Event listener for payment method change (offline)
    if (this._btn) {
        this._btn.addEventListener('click', () => {
            console.log('Button clicked - offline');
            this.onPaymentChange('offline');
            this._btn.classList.add('button_alt-active');
            if (this._btnCard) {
                this._btnCard.classList.remove('button_alt-active');
            }
        });
    }

    // Event listener for payment method change (online)
    if (this._btnCard) {
        this._btnCard.addEventListener('click', () => {
            console.log('Button clicked - online');
            this.onPaymentChange('online');
            this._btnCard.classList.add('button_alt-active');
            if (this._btn) {
                this._btn.classList.remove('button_alt-active');
            }
        });
    }
    
    // Event listener for submitting the form (opening contact form)
    this.container.addEventListener('submit', (evt: Event) => {
      evt.preventDefault();
      this.events.emit('contacts:open');
    })
  }
  // Setter for valid to enable/disable the submit button
  set valid(value: boolean) {
    this._submit.disabled = !value;
  }
  // Setter for address input value
  set address(value: string) { (this.container.elements.namedItem('address') as HTMLInputElement).value = value; }
}

// Interface defining the structure for BasketItem data
export type IBasketIndex = {
  index: number;
}

// Class for BasketItem Component, extending the Card Component
export class BasketItem extends Card<IBasketIndex> {
  protected _index: HTMLElement;
  protected _btn: HTMLButtonElement;
  constructor(container: HTMLElement, act?: IAct) {
    super('card', container);

    this._index = container.querySelector('.basket__item-index');
    this._btn = container.querySelector('.basket__item-delete');
    this._btn.addEventListener('click', act.onClick);             // Event listener for deleting the basket item
  }
  set index(value: number) { this.setText(this._index, value) }   // Setter for index to display the basket item index
}

// Class for Success Component, extending the base Component class
export class Success extends Component<ISuccess> {
  protected _close: HTMLElement;
  protected _total: HTMLElement;
  constructor(container: HTMLElement, act?: IActS) {
    super(container);
    this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
    this._close = ensureElement<HTMLElement>('.button', this.container);
    this._close.addEventListener('click', act.onClick); // Event listener for closing the success popup
  }
  
  set total(total: number) {
    const synapseText = total === 1 ? 'синапс' : 'синапсов';
    this.setText(this._total, `Списано ${total} ${synapseText}`); // Setter for total to display the total number of synapses with correct pluralization
  }

}