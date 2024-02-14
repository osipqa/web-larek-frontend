import { IBasket, IAct } from "../types";
import { ensureElement, createElement } from "../utils/utils";
import { Component } from "./base/abstract";
import { EventEmitter } from "./base/events";
import { Card } from "./card";

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
