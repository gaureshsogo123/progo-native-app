const calculateTotal = (products) => {
  let totalItems = 0,
    totalProducts = 0,
    totalPrice = 0;
  products.forEach((product) => {
    totalPrice += product.price * product.quantity || 0;
    totalItems += parseInt(product.quantity || 0);
    totalProducts += product.quantity > 0 ? 1 : 0;
  });
  return {
    totalItems,
    totalProducts,
    totalPrice: Number(totalPrice).toFixed(2),
  };
};

export default calculateTotal;
