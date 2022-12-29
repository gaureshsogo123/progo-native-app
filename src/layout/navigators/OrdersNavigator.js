import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Orders from '../../orders/view/Orders';
import UpdateOrder from '../../updateorder/view/UpdateOrder';


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