import { IOrderF, IOrders, ISuccess, IActS } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/abstract";
import { IEvents } from "./base/events";
import { Form } from "./popup";

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