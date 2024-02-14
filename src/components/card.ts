import { IProd, IAct } from "../types";
import { categoryValues } from "../utils/constants";
import { ensureElement, bem } from "../utils/utils";
import { Component } from "./base/abstract";

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
      // If the value is an array, update multiple description items
      this._description?.querySelectorAll('.description-item').forEach((element: HTMLElement, index: number) => { 
        this.setText(element, value[index]);  // Iterate over each description item and update its content
      });
    } else {
      this.setText(this._description, value); // If the value is a string, update a single description item
    }
  }
}