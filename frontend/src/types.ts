export interface IProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string | ICategory;
  quantity?: number;
  count?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICategory {
  _id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: number;
  history?: any[];
}

export interface IAuthData {
  token: string;
  user: IUser;
}

export interface ICartItem {
  _id: string;
  name: string;
  price: number;
  count: number;
  product?: IProduct;
}

export interface IOrder {
  _id?: string;
  products: ICartItem[];
  transaction_id: string;
  amount: number;
  address: string;
  status: string;
  updated?: Date;
  user: string | IUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBraintreePaymentData {
  paymentMethodNonce: string;
  amount: string | number;
}

export interface ApiResponse<T = any> {
  error?: string;
  data?: T;
  [key: string]: any;
}

export interface IFilterParams {
  category?: string[]; 
  price?: number[];
  [key: string]: any;     
}