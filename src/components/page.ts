import { IPage, IState, IProd, IOrder, OrderFormErrors, ContactsFormErrors, IOrderF, IAct } from "../types";
import { settings, categoryValues } from "../utils/constants";
import { ensureElement, bem } from "../utils/utils";
import { Component, objectModel } from "./base/abstract";
import { IEvents } from "./base/events";

// Represents the main page of the application
export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _catalogue: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    const getElement = (selector: string) => ensureElement<HTMLElement>(selector, this.container);

    this._counter = getElement(settings.classes.headerBasketCounter);
    this._catalogue = getElement(settings.classes.gallery);
    this._wrapper = getElement(settings.classes.pageWrapper);
    this._basket = getElement(settings.classes.headerBasket);

    this._basket.addEventListener('click', () => this.events.emit('basket:open'));
  }

  set counter(value: number) {
    this.setText(this._counter, String(value));
  }

  set catalogue(items: HTMLElement[]) {
    this._catalogue.replaceChildren(...items);
  }

  set locked(value: boolean) {
    this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
  }
}

// Represents the state of the application
export class State extends objectModel<IState> {
  catalogue: IProd[];
  order: IOrder = {
    email: '',
    phone: '',
    address: '',
    payment: '',
    total: null,
    items: [],
  };
  formOrderErrors: OrderFormErrors = {};
  formContactsErrors: ContactsFormErrors = {};

  toggleOrderItem(id: string, isIncluded: boolean) {
    if (isIncluded) {
      this.order.items = [...new Set([...this.order.items, id])];
    } else {
      this.order.items = this.order.items.filter((it) => it !== id);
    }
  }

  clearBasket() {
    this.order.items.forEach((id) => this.toggleOrderItem(id, false));
    this.clearOrderFields();
    this.emitChanges('basket:changed', { order: this.order });
  }

  total() {
    return (this.order.total = this.order.items.reduce(
      (acc, curr) => acc + Number(this.catalogue.find((it) => it.id === curr)?.price || 0),
      0
    ));
  }

  setCatalogue(items: IProd[]) {
    this.catalogue = items;
    this.emitChanges('items:changed', { catalogue: this.catalogue });
  }

  getCards(): IProd[] {
    return this.catalogue.filter((item) => this.order.items.includes(item.id));
  }

  isFilledFieldsOrder(): boolean {
    return !!this.order.address && !!this.order.payment;
  }

  isFilledFieldsContacts(): boolean {
    return !!this.order.email && !!this.order.phone;
  }

  clearOrderFields() {
    this.order.email = '';
    this.order.address = '';
    this.order.payment = '';
    this.order.phone = '';
  }

  setField(field: keyof IOrderF, value: string) {
    this.order[field] = value;

    if (['address', 'payment'].includes(field)) {
      this.validateOrder();
    }

    if (['email', 'phone'].includes(field)) {
      this.validateContacts();
    }
  }

  validateOrder() {
    const errors: typeof this.formOrderErrors = {};
    if (!this.order.address) errors.address = 'Необходимо указать адрес';
    if (!this.order.payment) errors.payment = 'Необходимо указать способ оплаты';

    this.formOrderErrors = errors;
    this.event.emit('formOrderErrors:change', this.formOrderErrors);
    return Object.keys(errors).length === 0;
  }

  validateContacts() {
    const errors: typeof this.formContactsErrors = {};
    if (!this.order.email) errors.email = 'Необходимо указать email';
    if (!this.order.phone) errors.phone = 'Необходимо указать телефон';

    this.formContactsErrors = errors;
    this.event.emit('formContactsErrors:change', this.formContactsErrors);
    return Object.keys(errors).length === 0;
  }
}

// Represents a card component for displaying product information
export class Card<T extends IProd | {}> extends Component<T | IProd> {
  protected _title: HTMLElement;                // Represents the title of the product
  protected _image?: HTMLImageElement;          // Represents the image of the product
  protected _price: HTMLElement;                // Represents the price of the product
  protected _category?: HTMLElement;            // Represents the category of the product
  protected _description?: HTMLElement;         // Represents the description of the product
  protected _buttonModal?: HTMLButtonElement;   // Represents the button for adding to the basket

  constructor(protected blockName: string, container: HTMLElement, act?: IAct) {
    super(container);

    // Helper function for getting elements by selector
    const getElement = (selector: string) => ensureElement<HTMLElement>(selector, container);

    // Assigning elements to class properties
    this._title = getElement(`.${blockName}__title`);
    this._image = container.querySelector(`.${blockName}__image`);
    this._price = getElement(`.${blockName}__price`);
    this._category = container.querySelector(`.${blockName}__category`);
    this._buttonModal = container.querySelector(`.${blockName}__button`);
    this._description = container.querySelector(`.${blockName}__text`);

    // Add click event to the button if provided
    if (act?.onClick) {
      if (this._buttonModal) {
        this._buttonModal.textContent = 'Купить';
        this._buttonModal.addEventListener('click', act.onClick);
      } else {
        container.addEventListener('click', act.onClick);
      }
    }
  }

  // Method to indicate if the card is empty or not
  public isEmpty(value: boolean) {
    return value
      ? this.setText(this._buttonModal, 'В корзину')
      : this.setText(this._buttonModal, 'Купить');
  }

  // Setter and getter for the product id
  set id(value: string) { this.container.dataset.id = value };
  get id() { return this.container.dataset.id || '' }
  
  // Setter and getter for the product title
  set title(value: string) { this.setText(this._title, value) };
  get title() { return this._title.textContent || '' };

  // Setter for the product image - updated logic
  set image(value: string) { this._image.setAttribute('src', value); }
  // Setter for the product image - updated logic


  // Setter for the product price with validation for zero value
  set price(value: number) {
    if (value === null || isNaN(value)) {
      this.setText(this._price, 'Бесценно');
      this.setDisabled(this._buttonModal, true);
    } else {
      this.setText(this._price, value + ' синапс');
      if (value !== 1) {
        this._price.textContent += 'ов';
      }
      this.setDisabled(this._buttonModal, false);
    }
  }  


  // Setter for the product category with mapping to corresponding CSS class
  set category(value: string) { 
    const categorySkill: Record<string, string> = {
      [categoryValues.softSkill]: 'soft',
      [categoryValues.hardSkill]: 'hard',
      [categoryValues.button]: 'button',
      [categoryValues.other]: 'other',
      [categoryValues.additional]: 'additional',
    };
    const categoryClass = bem(this.blockName, 'category', categorySkill[value]).name
    this.setText(this._category, value);
    this.toggleClass(this._category, categoryClass, true);
  }

  // Setter for the product description with support for multiple paragraphs
  set description(value: string | string[]) {
    if (Array.isArray(value)) {
      this._description?.replaceWith(...value.map((i) => {
        const dsc = this._description?.cloneNode(true) as HTMLElement;
        this.setText(dsc, i);
        return dsc;
      }))
    }
  }
}