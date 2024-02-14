import { ContactsFormErrors, IOrder, IOrderF, IProd, IState, OrderFormErrors } from "../../types";
import { objectModel } from "./abstract";

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