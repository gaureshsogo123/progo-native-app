import { createContext, useContext, useState } from "react";

const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [distributorInfo, setDistributorInfo] = useState({});
  const [showSingleProduct, setShowSingleProduct] = useState(false);
  const [singleProduct, setSingleProduct] = useState({});

  const clearContext = () => {
    setCartItems([]);
    setDistributorInfo({
      discount: 0,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        distributorInfo,
        setDistributorInfo,
        clearContext,
        showSingleProduct,
        setShowSingleProduct,
        singleProduct,
        setSingleProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
export const useCartContext = () => useContext(CartContext);
