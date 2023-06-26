import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Orders from "../../screens/orders/view/OrderScreen";
import UpdateOrder from "../../screens/updateorder/view/UpdateOrderScreen";
import OrderDetailScreen from "../../screens/orders/view/OrderDetailScreen";
import Cart from "../../screens/purchaseorder/view/Cart";
import HeaderCart from "../../component/HeaderCart";
import FilterIcon from "../../component/FilterIcon";
import SearchBox from "../../component/SearchBox";

const OrderStackNavigator = createNativeStackNavigator();

const OrdersNavigator = () => {
  return (
    <OrderStackNavigator.Navigator>
      <OrderStackNavigator.Screen
        name="Orders"
        component={Orders}
        options={{
          title: "My Orders",
          headerRight: () => <FilterIcon />,
          headerLeft: () => <SearchBox placeHolder={"Search Brands"} />,
          headerTitle: () => null,
        }}
      />
      <OrderStackNavigator.Screen
        name="Order Details"
        component={OrderDetailScreen}
      />
      <OrderStackNavigator.Screen
        name="UpdateOrder"
        component={UpdateOrder}
        options={{
          title: "Update Order",
          headerRight: () => <HeaderCart />,
          headerLeft: () => <SearchBox placeHolder={"Search Products"} />,
          headerTitle: () => null,
        }}
      />
      <OrderStackNavigator.Screen name="Cart" component={Cart} />
    </OrderStackNavigator.Navigator>
  );
};

export default OrdersNavigator;
