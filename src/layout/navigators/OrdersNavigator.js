import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Orders from "../../screens/orders/view/OrderScreen";
import UpdateOrder from "../../screens/updateorder/view/UpdateOrderScreen";
import OrderDetailScreen from "../../screens/orders/view/OrderDetailScreen";
import Cart from "../../screens/purchaseorder/view/Cart";

const OrderStackNavigator = createNativeStackNavigator();

const OrdersNavigator = () => {
  return (
    <OrderStackNavigator.Navigator>
      <OrderStackNavigator.Screen
        name="Orders"
        component={Orders}
        options={{
          title: "My Orders",
        }}
      />

      <OrderStackNavigator.Screen
        name="Order Details"
        component={OrderDetailScreen}
      />

      <OrderStackNavigator.Screen name="UpdateOrder" component={UpdateOrder} />

      <OrderStackNavigator.Screen name="Cart" component={Cart} />
    </OrderStackNavigator.Navigator>
  );
};

export default OrdersNavigator;
