import { createContext, useContext, useState } from "react";


const CartContext = createContext();


const CartContextProvider = (({children})=>{
    const [cartItems, setCartItems] = useState([]);
    const[distributorinfo,setDistributorInfo]=useState({});


    const clearContext = (()=>{
        setCartItems([])
        setDistributorInfo({})
    })

    return(
        <CartContext.Provider
        value={{cartItems,setCartItems,distributorinfo,setDistributorInfo,clearContext}}>
            {children}
        </CartContext.Provider>
    )
})

export default CartContextProvider;
export const useCartContext = ()=>useContext(CartContext);