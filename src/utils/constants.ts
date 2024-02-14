export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;      // Endpoint for WebLarek API
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;  // CDN URL for WebLarek content

// Configuration settings
export const settings = {
  // Template identifiers
  templateCard: 'card-catalog',       // Identifier for the catalog card template
  templatePrev: 'card-preview',       // Identifier for the preview card template
  templateBask: 'card-basket',        // Identifier for the basket card template
  basketTemplate: 'basket',           // Identifier for the basket template
  orderTemplate: 'order',             // Identifier for the order template
  contactsTemplate: 'contacts',       // Identifier for the contacts template
  successTemplate: 'success',         // Identifier for the success template
  modalTemplate: 'modal',             // Identifier for the modal template
  modalContainer: 'modal-container',  // Identifier for the modal container

  // CSS classes for page elements
  classes: {
    headerBasketCounter: '.header__basket-counter', // CSS class for the basket counter in the header
    gallery: '.gallery',                            // CSS class for the product gallery
    pageWrapper: '.page__wrapper',                  // CSS class for the page wrapper
    headerBasket: '.header__basket'                 // CSS class for the basket button in the header
  },

  // Additional elements in the card template
  cardElements: {
    image: '.card__image',        // CSS class for the card image element
    title: '.card__title',        // CSS class for the card title element
    category: '.card__category',  // CSS class for the card category element
    price: '.card__price'         // CSS class for the card price element
  }
};

export const categoryValues = {
  softSkill: 'софт-скил',
  hardSkill: 'хард-скил',
  button: 'кнопка',
  other: 'другое',
  additional: 'дополнительное',
};