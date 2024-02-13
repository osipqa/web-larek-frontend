export interface IPage {
  counter: number;            // Number - represents a counter element
  catalogue: HTMLElement[];   // Array of HTMLElement - represents a catalog of elements
  locked: boolean;            // Object of type IGallery representing a gallery
}

// Interface representing a gallery
export interface IGallery {
  items: IProd[];        // Array of objects of type ICard - represents gallery items
}

// Interface representing a success result
export interface ISuccess {
  total: number;         // Number - represents a total value
}

// Interface representing a product
export interface IProd {
  description?: string;   // String - represents product description
  id: string;             // String - id product
  image: string;          // String - represents image URL
  title: string;          // String - represents card title
  category: string;       // String - represents card category
  price: number | null;   // Number or null - represents card price
}

// Interface representing an order
export interface IOrder extends IContactInfo {
  total: number;         // Number - represents total value
  items: string[];       // Array of strings - represents product IDs in the order
  payment: string;       // String - represents payment method information
  address: string;       // String - represents address information
}

// Interface representing an order form
export interface IOrderF extends ContactsFormErrors, OrderFormErrors {}

// Interface representing the result of an order
export interface IOrderResult {
  id: string;            // string - id product res
  total: number;         // Number - represents total value
}

// Interface representing contact information
export interface IContactInfo {
  email: string;  // String - represents email address
  phone: string;  // String - represents phone number
}

// Interface representing a basket
export interface IBasket {
  items: HTMLElement[];  // Array of objects of type IProduct - represents products in the basket
  total: number;         // Number - represents total value
  selected: string[];    // Array of strings - represents selected items in the basket
}

// Type representing form errors for the order
export type OrderFormErrors = {
  address?: string;      // String - represents address error
  payment?: string;      // String - represents payment error
};

// Type representing form errors for the contacts
export type ContactsFormErrors = {
  email?: string;        // String - represents email error
  phone?: string;        // String - represents phone error
};

// Interface representing an action
export interface IAct {
  onClick: (evt: MouseEvent) => void;  // Function - represents an action on click
}

// Interface representing a success action
export interface IActS {
  onClick: () => void;   // Function - represents a success action on click
}

// Interface representing orders with form errors and state
export interface IOrders extends ContactsFormErrors, OrderFormErrors, IState {
  items: string[];       // Array of strings - represents order items
  total: number;         // Number - represents total value
}

// Interface representing the application state
export interface IState {
  validation: boolean;   // Boolean - represents validation status
  errors: string[];      // Array of strings - represents error messages
}