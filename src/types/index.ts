// Interface representing a page
export interface IPage {
  counter: number;    // Number - a counter el
  gallery: IGallery;  // Object of type IGallery representing a gallery
}

// Interface representing a gallery
export interface IGallery {
  items: ICard[]; // Array of objects of type ICard - gallery items
}

// Interface representing a product card or gallery item
export interface ICard {
  image: string;        // String - image URL
  title: string;        // String - card title
  category: string;     // String - card category
  price: number | null; // Number or null - card price
}

// Interface representing a product
export interface IProd extends ICard {
  id: string;           // String - unique product identifier
  description: string;  // String - product description
}

// Interface representing an order
export interface IOrder {
  namepay: string;  // String - payment method information
  address: string;  // String - address information
}

// Interface representing contact information
export interface IInfo {
  email: string;  // String - email address
  phone: string;  // String - phone number
}

// Interface representing a basket
export interface IBasket extends IOrder, IInfo {
  items: IProd[];      // Array of objects of type IProduct - products in the basket
  totalprice: number;  // Number - total amount of the basket
}