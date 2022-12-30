import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Orders from '../../screens/orders/view/OrderScreen';
import UpdateOrder from '../../screens/updateorder/view/UpdateOrderScreen';


const OrderStackNavigator = createNativeStackNavigator();


const OrdersNavigator = () => {
  return (
    <OrderStackNavigator.Navigator>
        <OrderStackNavigator.Screen
        name='Orders'
        component={Orders}
        options={{ 
          title :"My Orders"
         }}
        />

<OrderStackNavigator.Screen
        name='UpdateOrder'
        component={UpdateOrder}/>

    </OrderStackNavigator.Navigator>
  )
}

export default OrdersNavigator