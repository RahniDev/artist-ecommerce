export interface ApiError {
  error: string;
}
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: any;
  quantity: number;
  shipping: boolean;
  sold: number;
  photo?: any;
}

export interface IPriceRange {
  _id: number;
  name: string;
  array: number[];
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
  password?: string;
}

export interface IAuthData {
  token: string;
  user: IUser;
}

export interface ICartItem extends IProduct {
  count?: number;
}

export interface IOrder {
  _id: string;
  products: ICartItem[];
  transaction_id: string;
  amount: number;
  address: string;
  status: string;
  updated?: Date;
  user: IUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBraintreePaymentData {
  paymentMethodNonce: string;
  amount: string | number;
}

export interface BraintreeToken {
  clientToken: string;
}

export interface BraintreeTransaction {
  transaction: {
    id: string;
    amount: number | string;
    [key: string]: any;
  };
  [key: string]: any;
}
export interface BraintreeError {
  error: string;
}

export type BraintreeResponse = BraintreeToken | BraintreeError;

export interface IFilterParams {
  category?: string[];
  price?: number[];
  [key: string]: any;
}