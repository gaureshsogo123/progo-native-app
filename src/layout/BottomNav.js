import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import LandingScreen from "../landingScreen/view/LandingScreen";
import PurchaseOrderScreen from "../purchaseorder/view/PurchaseOrderScreen";
import Orders from "../orders/view/Orders";
import { OrderReport } from "../orderReport/view/OrderReport";
import { Logout } from "../component/Signout";
import HomeNavigator from "./navigators/HomeNavigator";
import OrdersNavigator from "./navigators/OrdersNavigator";
import MenuNavigator from "./navigators/MenuNavigator";

const Tab = createBottomTabNavigator();

const defaultTabOptions = {
  tabBarHideOnKeyboard: true,
};


function BottomNav() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: () => <BottomIconContainer name="home" />,
          headerShown: false,
          ...defaultTabOptions,
        }}
      />
      <Tab.Screen
        name="My Orders"
        component={OrdersNavigator}
        options={{
          tabBarIcon: () => <BottomIconContainer name="book" />,
          headerShown: false,
          ...defaultTabOptions,

        }}
      />
       <Tab.Screen
        name="Order Report"
        component={OrderReport}
        options={{
          tabBarIcon: () => <BottomIconContainer name="filetext1" />,
        }}
      />
     <Tab.Screen
        name="Menu"
        component={MenuNavigator}
        options={{
          tabBarIcon: () => (
            <BottomIconContainer name="menufold"  />
          ),
          headerShown: false,
          ...defaultTabOptions,
        }}
      />

    </Tab.Navigator>
  );
}

const BottomIconContainer = ({ name }) => {
  return <AntDesign name={name} size={22} color="black" />;
};

export default BottomNav;
