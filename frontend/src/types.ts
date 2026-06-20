import type { ReactNode } from "react";

export interface CategoryData {
  products: IProduct[];
  _id: string;
  name: string;
}

export interface CheckoutState {
  loading: boolean;
  success: boolean;
  clientToken: string | null;
  error: string;
  address: Address;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface ContactFormState {
  name: string;
  email: string;
  message: string;
  loading: boolean;
  success: boolean | null;
  error: string | null;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  full: string;
}

export interface PhotonPlace {
  properties: {
    name?: string;
    city?: string;
    zip?: string;
    state: string,
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
  | "photo"
  | "weight"
  | "width"
  | "height"
  | "length"
  | "framing"
  | "additionalDetails"
  | "medium"
  | "material"
  | "quality";

export interface ProductFormBase {
  name: string;
  description: string;
  price: string;
  weight: string;
  width: string;
  height: string;
  length: string;
  categories: Category[];
  category: string;
  quantity?: string;
  material: string;
  medium: string;
  colors: string[];
  loading: boolean;
  error: string;
}

export interface AddProductValues extends ProductFormBase {
  photos: File[] | [];
  createdProduct: boolean;
  createdProductName?: string;
  framing: string;
  additionalDetails?: string;
  quality: string;
}

export interface UpdateProductValues extends ProductFormBase {
  photos: File[] | [];
  updatedProduct: boolean;
  updatedProductName?: string;
}

export interface OrderItem {
  _id: string;
  product: string; // product ID reference
  name: string;
  price: number;
  count: number;
  weight: number;
  width: number;
  height: number;
  length: number;
}

export interface CreateOrderInput {
  products: OrderItem[];
  transaction_id: string;
  amount: number;
  address: string;
  firstName: string;
  lastName: string;
  email: string,
  phone: string;
  status: string;
  user: string | null;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

export interface Category {
  _id: string;
  name: string;
  parent?: string | Category | null;
}

export interface CategoryInput {
  name: string;
}

export interface Product {
  [key: string]: any;
}

export interface LocalizedDescriptionOptions {
  fallbackToEnglish?: boolean;
  fallbackString?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  nameEn: string;
  description:
  | string
  | {
    en?: string;
    fr?: string;
    [key: string]: string | undefined;
  };
  price: number;
  category: any;
  quantity: number;
  sold: number;
  photos?: any;
  photoCount?: number;
  weight?: number;
  width?: number;
  height?: number;
  length?: number;
  count?: number;
}

export interface IPriceRange {
  _id: number;
  name: string;
  array: number[];
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

export interface IOrder {
  _id: string;
  products: CartItem[];
  transaction_id: string;
  amount: number;
  address: string;
  status: string;
  firstName: string;
  lastName: string;
  user: IUser;
  createdAt: number;
}

export interface IBraintreePaymentData {
  paymentMethodNonce: string;
  amount: string | number;
}

export interface BraintreeTransaction {
  transaction: {
    id: string;
    amount: number | string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface BraintreeTokenResponse {
  clientToken?: string;
  error?: string;
}

export interface IFilterParams {
  category?: string[];
  price?: number[];
  [key: string]: any;
}

export interface SearchState {
  categories: Category[];
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

export type LightingMode = "daylight" | "evening" | "gallery";

export interface ShowImageProps {
  item: {
    _id: string;
    name?: string;
    photos?: any[];
    photoCount?: number;
  };
  url: string;
  width?: number | string;
  height?: number | string;
  showAll?: boolean;
  lightingMode?: LightingMode;
  onImageClick?: (src: string) => void;
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
  categories: Category[];
  category?: string;
}

export interface CheckoutProps {
  products: CartItem[];
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
  categories: Category[];
  handleFilters: (selected: string[]) => void;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  count: number;
  description: string;
  shipping: boolean;
  sold: number;
  category: string;
  product: string;
}

export interface ShippingRatesProps {
  cartItems: CartItem[];
  address: Address;
  onSelectRate: (rate: any) => void;
}

export interface IRate {
  id: string;
  type: string;
  carrier: string;
  service: string;
  rate: string;
  currency: string;
  insuranceValue: string;
  deliveryEstimate: string;
}

export interface CardProps {
  product: IProduct;
  showViewProductButton?: boolean;
  showAddToCartButton?: boolean;
  cartUpdate?: boolean;
  showRemoveProductButton?: boolean;
  setRun?: (value: boolean) => void;
  run?: boolean;
  redirect?: boolean;
}

export interface AddToCartButtonProps {
  product: CartItem;
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