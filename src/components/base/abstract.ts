import { IEvents } from "./events";

/**
 * Abstract base class for components.
 * @template T - Generic type for component data.
 */
export abstract class Component<T> {
  constructor(protected readonly container: HTMLElement) {}

  /**
   * Toggle a class on an HTML element.
   * @param {HTMLElement} el - The HTML element.
   * @param {string} className - The class name to toggle.
   * @param {boolean | undefined} state - Optional state to force toggle.
   */
  toggleClass(el: HTMLElement, className: string, state?: boolean) {
    el.classList.toggle(className, state);
  }

  /**
   * Set text content on an HTML element.
   * @param {HTMLElement} el - The HTML element.
   * @param {unknown} value - The value to set as text content.
   * @param {string | undefined} additionalText - Optional additional text.
   */
  protected setText(el: HTMLElement, value: unknown, additionalText?: string) {
    el.textContent = String(value) + (additionalText || '');
  }

  /**
   * Toggle the 'disabled' attribute on an HTML element.
   * @param {HTMLElement} el - The HTML element.
   * @param {boolean} state - The state to set for the 'disabled' attribute.
   */
  setDisabled(el: HTMLElement, state: boolean) {
    el?.toggleAttribute(`disabled`, state);
  }

  /**
   * Hide an HTML element by setting its display property to 'none'.
   * @param {HTMLElement} el - The HTML element.
   */
  protected setHide(el: HTMLElement) {
    el.style.display = 'none';
  }

  /**
   * Show an HTML element by removing its 'display' property.
   * @param {HTMLElement} el - The HTML element.
   */
  protected setVisible(el: HTMLElement) {
    el?.style.removeProperty(`display`);
  }

  /**
   * Set the source and alt attributes of an image element.
   * @param {HTMLImageElement} el - The image element.
   * @param {string} src - The source URL for the image.
   * @param {string} alt - The alternative text for the image.
   */
  protected setImage(el: HTMLImageElement, src: string, alt: string) {
    el.src = src;
    el.alt = alt;
  }

  /**
   * Render the component with optional data.
   * @param {Partial<T> | undefined} data - Optional data to render.
   * @returns {HTMLElement} - The rendered HTML element.
   */
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
}

/**
 * Check if an object is an instance of the objectModel class.
 * @param {unknown} obj - The object to check.
 * @returns {obj is objectModel<any>} - True if the object is an objectModel instance.
 */
export const isObjectModel = (obj: unknown): obj is objectModel<any> => {
  return obj instanceof objectModel;
};

/**
 * Abstract class for creating object models with event emission.
 * @template T - Generic type for object model data.
 */
export abstract class objectModel<T> {
  constructor(data: Partial<T>, protected event: IEvents) {
    Object.assign(this, data);
  }

  /**
   * Emit changes using the associated event emitter.
   * @param {string} evt - The event to emit.
   * @param {object | undefined} payload - Optional payload to send with the event.
   */
  emitChanges(evt: string, payload?: object) {
    this.event.emit(evt, payload ?? {});
  }
}