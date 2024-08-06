export const fetchProducts = async (
  userId,
  categoryId,
  searchText,
  pageNumber = 1,
  pageSize = 500
) => {
  return axiosInstance
    .post("/product", {
      user_id: userId,
      category_id: categoryId,
      search_text: searchText,
      page_number: pageNumber,
      page_size: pageSize,
    })
    .then((res) => {
      const products = res.data.data;
      return { data: products };
    })
    .catch((err) => {
      return { error: err.message };
    });
};

export const saveOrder = async (
  userId,
  totalItems,
  orderTotal,
  paymentMethod,
  distributorId,
  discount,
  subTotal,
  products
) => {
  return axiosInstance
    .post("/order/saveOrderRetailer", {
      userId,
      totalItems,
      orderTotal: Number(orderTotal).toFixed(2),
      paymentMethod,
      discount,
      subTotal: Number(subTotal).toFixed(2),
      distributorId,
      products,
    })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      console.log(err.response?.data?.message || err.message);
      return { error: err.response?.data?.message || err.message };
    });
};

export function getDiscountedTaxedPrice(item, cartItem) {
  const basePrice = Number(item.price);
  const discount = cartItem ? Number(cartItem.discount) : 0;
  const gstRate = cartItem ? Number(cartItem.gstrate) : item.gstrate;

  return Number(
    ((basePrice * (100 - discount)) / 100) * (1 + gstRate / 100)
  ).toFixed(2);
}

export function getProductTax(item) {
  const discountAmount = (item.price * item.discount) / 100;
  const discountedPrice = item.price - discountAmount;
  const taxAmount = (discountedPrice * item.gstrate) / 100;
  return Number(taxAmount.toFixed(2));
}

export function getProductDiscount(item) {
  return Number((item.price * item.discount) / 100).toFixed(2);
}

export function calculateCartTotals(cartItems) {
  let totalAmount = 0;
  let totalTax = 0;
  let totalDiscount = 0;

  cartItems.forEach((curr) => {
    const discountedTaxedPrice =
      getDiscountedTaxedPrice(curr, curr) * curr.quantity || 0;
    const productTax = getProductTax(curr) * curr.quantity || 0;
    const productDiscount = getProductDiscount(curr) * curr.quantity || 0;

    totalAmount += discountedTaxedPrice;
    totalTax += productTax;
    totalDiscount += productDiscount;
  });

  totalAmount = Number(totalAmount).toFixed(2);
  totalTax = Number(totalTax).toFixed(2);
  totalDiscount = Number(totalDiscount).toFixed(2);

  return {
    totalAmount,
    totalTax,
    totalDiscount,
  };
}
