import { ICartItem } from "../order/order.model.js";

export const calculateParcel = (cartItems: ICartItem[]) => {
  let totalWeight = 0; // in ounces for EasyPost
  let maxLength = 0;
  let maxWidth = 0;
  let totalHeight = 0;

  cartItems.forEach((item) => {
    const qty = item.quantity;
    totalWeight += item.weight * qty;
    maxLength = Math.max(maxLength, item.length);
    maxWidth = Math.max(maxWidth, item.width);
    totalHeight += item.height * qty; // stacking items
  });

  return {
    length: maxLength,
    width: maxWidth,
    height: totalHeight,
    weight: totalWeight,
  };
};