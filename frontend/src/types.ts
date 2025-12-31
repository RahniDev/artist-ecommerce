import type { ReactNode } from "react";

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

export interface SearchState {
  categories: ICategory[];
  category: string;
  search: string;
  results: IProduct[];
  searched: boolean;
}

export interface FilterState {
  filters: {
    category: string[];
    price: number[];
  };
}

export interface SigninState {
    email: string;
    password: string;
    error: string;
    loading: boolean;
    redirectToReferrer: boolean;
}

export interface SignupFormState {
    name: string;
    email: string;
    password: string;
    error: string;
    success: boolean;
}


export interface Product {
    _id: string;
    name: string;
    price: number;
    createdAt?: string;
}

export interface Order {
    _id: string;
    products: Product[];
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: number;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface ProfileState {
  name: string;
  email: string;
  password: string;
  error: boolean;
  success: boolean;
}

export interface StockBadgeProps {
    quantity: number;
}

export interface ShowImageProps {
  item: IProduct | { _id: string; name?: string };
  url: string;
}

export interface RadioBoxProps {
  prices: IPriceRange[];
  handleFilters: (value: number) => void;
}

export interface LayoutProps {
    title?: string;
    description?: string;
    className?: string;
    children: ReactNode;
}

export interface FooterData {
    categories: ICategory[];
    category?: string;
}

export interface CheckoutProps {
    products: ICartItem[];
    setRun?: React.Dispatch<React.SetStateAction<boolean>>;
    run?: boolean;
}

export interface CheckoutData {
    loading: boolean;
    success: boolean;
    clientToken: string | null;
    error: string;
    instance: any;
    address: string;
}

export interface CheckboxProps {
    categories: ICategory[];
    handleFilters: (selected: string[]) => void;
}

export interface CartItem extends IProduct {
  count: number;
}

export interface CardProps {
    product: ICartItem;
    showViewProductButton?: boolean;
    showAddToCartButton?: boolean;
    cartUpdate?: boolean;
    showRemoveProductButton?: boolean;
    setRun?: (value: boolean) => void;
    run?: boolean;
}

export interface AddToCartButtonProps {
  product: ICartItem;
  redirect?: boolean;
  className?: string;
}

export interface PrivateRouteProps {
  children: React.ReactElement;
}

export interface AdminRouteProps {
  children: React.ReactElement;
}