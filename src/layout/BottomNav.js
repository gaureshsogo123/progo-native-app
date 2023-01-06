import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import HomeNavigator from "./navigators/HomeNavigator";
import OrdersNavigator from "./navigators/OrdersNavigator";
import MenuNavigator from "./navigators/MenuNavigator";

const Tab = createBottomTabNavigator();

const defaultTabOptions = {
  tabBarHideOnKeyboard: true,
};

function BottomNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: (tabInfo) => (
            <BottomIconContainer
              name="home"
              color={tabInfo.focused ? "blue" : "black"}
            />
          ),
          headerShown: false,
          ...defaultTabOptions,
        }}
      />
      <Tab.Screen
        name="My Orders"
        component={OrdersNavigator}
        options={{
          tabBarIcon: (tabInfo) => (
            <BottomIconContainer
              name="book"
              color={tabInfo.focused ? "blue" : "black"}
            />
          ),
          headerShown: false,
          ...defaultTabOptions,
        }}
      />

      <Tab.Screen
        name="Menu"
        component={MenuNavigator}
        options={{
          tabBarIcon: (tabInfo) => (
            <BottomIconContainer
              name="menufold"
              color={tabInfo.focused ? "blue" : "black"}
            />
          ),
          headerShown: false,
          ...defaultTabOptions,
        }}
      />
    </Tab.Navigator>
  );
}

const BottomIconContainer = ({ name, color }) => {
  return <AntDesign name={name} size={22} color={color} />;
};

export default BottomNav;
