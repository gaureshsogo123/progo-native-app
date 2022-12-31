export const calculateTotal = (products) => {
  let total = 0;
  products.forEach((product) => {
    total += product.price * (product.quantity || 0);
  });
  return total;
};

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
      orderTotal: orderTotal.toFixed(2),
      paymentMethod,
      discount,
      subTotal: subTotal.toFixed(2),
      distributorId,
      products,
    })
    .then((res) => {
      return { data: res.data.data };
    })
    .catch((err) => {
      return { error: err.message };
    });
};
