import { IState } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/abstract";
import { IEvents } from "./base/events";

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