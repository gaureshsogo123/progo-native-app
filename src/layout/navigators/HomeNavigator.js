import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingScreen from "../../screens/landingScreen/view/LandingScreen";
import PurchaseOrderScreen from "../../screens/purchaseorder/view/PurchaseOrderScreen";
import Cart from "../../screens/purchaseorder/view/Cart";
import HeaderCart from "../../component/HeaderCart";
import SearchBox from "../../component/SearchBox";

const HomeStackNavigator = createNativeStackNavigator();

const HomeNavigator = () => {
  return (
    <HomeStackNavigator.Navigator>
      <HomeStackNavigator.Screen
        name="Landing Screen"
        component={LandingScreen}
        options={{
          title: "Home",
          headerTitle: () => (
            <SearchBox customWidth={true} placeHolder={"Search Brand"} />
          ),
        }}
      />
      <HomeStackNavigator.Screen
        name="purchaseorder"
        component={PurchaseOrderScreen}
        options={{
          title: "Create Purchase Order",
          headerRight: () => <HeaderCart />,
          headerLeft: () => <SearchBox placeHolder={"Search Products"} />,
          headerTitle: () => null,
        }}
      />
      <HomeStackNavigator.Screen
        name="Cart"
        component={Cart}
        options={{
          title: "Cart",
        }}
      />
    </HomeStackNavigator.Navigator>
  );
};

export default HomeNavigator;
