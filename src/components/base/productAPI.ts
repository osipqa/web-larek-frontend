import { Api, ApiListResponse } from './api';
import { IProd, IOrder, IOrderResult } from '../../types/index';

// Define interface for Product API methods
export interface IProductAPI {
  getProductList: () => Promise<IProd[]>;
  getProductItem: (id: string) => Promise<IProd>;
  orderProduct: (order: IOrder) => Promise<IOrderResult>;
}

// Extend the base API class to implement the Product API
export class ProductAPI extends Api implements IProductAPI {
  // Constructor to initialize the CDN, base URL, and options
  constructor(readonly cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
  }
  // Fetch details of a specific product by ID
  getProductItem(id: string): Promise<IProd> {
    return this.get(`/product/${id}`).then((item: IProd) => ({
      ...item,
      image: this.cdn + item.image,
    }));
  }
  // Fetch a list of all products, including CDN path for images
  getProductList(): Promise<IProd[]> {
    return this.get('/product').then((data: ApiListResponse<IProd>) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }
  // Place an order for products
  orderProduct(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then((data: IOrderResult) => data);
  }
}