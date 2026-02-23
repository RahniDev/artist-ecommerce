import type { ReactNode } from "react";

export interface ContactFormState {
  name: string;
  email: string;
  message: string;
  loading: boolean;
  success: boolean | null;
  error: string | null;
}

export interface Address {
  number: Number | string;
  street: string;
  city: string;
  postcode: string;
  country: string;
  full: string;
}

export interface PhotonPlace {
  properties: {
    name?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
}

export interface ListProductsProps {
  products: IProduct[];
  loadMore?: () => void;
  hasMore?: boolean;
}

export interface AuthCardProps {
    title: string;
    children: React.ReactNode;
}

export interface ManageProductRowProps {
  product: Product;
  onDelete: (id: string) => void;
}

export type ProductFormField =
  | "name"
  | "description"
  | "price"
  | "category"
  | "shipping"
  | "quantity"
  | "photo";


export interface ProductFormBase {
  name: string;
  description: string;
  price: string;
  categories: ICategory[];
  category: string;
  shipping: string;
  quantity: string;
  loading: boolean;
  error: string;
  createdProduct: boolean;
}

export interface AddProductValues extends ProductFormBase {
  photo: File | string;
  createdProductName?: string;
}

export interface UpdateProductValues extends ProductFormBase {
  photo: File | null;
}

export interface CreateOrderInput {
  products: ICartItem[];
  transaction_id: string;
  amount: number;
  address: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
  user: string;
}


export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface CategoryInput {
  name: string;
}

export interface Product {
  [key: string]: any;
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
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface SignUpInput extends SignInInput {
  name: string;
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
  user: IUser;
  createdAt: number;
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

export interface ProfileState {
  name: string;
  email: string;
  password: string;
  error: boolean;
  success: boolean;
}

export interface SoldBadgeProps {
  quantity: number;
}

export interface ShowImageProps {
  item: {
    _id: string;
    name?: string;
  };
  url: string;
  width?: number | string;
  height?: number | string;
  objectFit?: React.CSSProperties["objectFit"];
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

export interface FilterResponse {
  size: number;
  data: IProduct[];
}