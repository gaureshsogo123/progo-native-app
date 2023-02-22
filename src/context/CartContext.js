import { createContext, useContext, useState } from "react";


const CartContext = createContext();


const CartContextProvider = (({children})=>{
    const [cartItems, setCartItems] = useState([]);

    return(
        <CartContext.Provider
        value={{cartItems,setCartItems}}>
            {children}
        </CartContext.Provider>
    )
})

export default CartContextProvider;
export const useCartContext = ()=>useContext(CartContext);