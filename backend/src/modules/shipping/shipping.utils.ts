export interface CartItem {
  _id: string;
  name: string;
  price: number;
  weight?: number;   // grams
  length?: number;   // cm
  width?: number;    // cm
  height?: number;
  count?: number;
  hsCode?: string;
}

export const calculateParcel = (cartItems: CartItem[]) => {
  let totalWeight = 0; // grams
  let maxLength = 0;
  let maxWidth = 0;
  let totalHeight = 0;

  for (const item of cartItems) {
    const qty = item.count ?? 1;

    const itemWeight = item.weight ?? 500; // default 500g
    const itemLength = item.length ?? 10;  // default 10cm
    const itemWidth = item.width ?? 10;
    const itemHeight = item.height ?? 2;

    totalWeight += itemWeight * qty;

    // Use largest footprint for length & width
    maxLength = Math.max(maxLength, itemLength);
    maxWidth = Math.max(maxWidth, itemWidth);

    // Stack height
    totalHeight += itemHeight * qty;
  }

  // Ensure no zero values
  if (totalWeight <= 0) totalWeight = 100;
  if (maxLength <= 0) maxLength = 10;
  if (maxWidth <= 0) maxWidth = 10;
  if (totalHeight <= 0) totalHeight = 2;

  return {
    length: Number(maxLength.toFixed(2)),
    width: Number(maxWidth.toFixed(2)),
    height: Number(totalHeight.toFixed(2)),
    weight: Number(totalWeight.toFixed(2)), // grams
  };
};