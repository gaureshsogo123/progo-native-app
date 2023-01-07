import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import HomeNavigator from "./navigators/HomeNavigator";
import OrdersNavigator from "./navigators/OrdersNavigator";
import MenuNavigator from "./navigators/MenuNavigator";
import { useTheme } from "react-native-paper";

const Tab = createBottomTabNavigator();

function BottomNav() {
  const theme = useTheme();

  const defaultTabOptions = {
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: theme.colors.primary,
  };
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
            <BottomIconContainer name="home" {...tabInfo} />
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
            <BottomIconContainer name="book" {...tabInfo} />
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
            <BottomIconContainer name="menufold" {...tabInfo} />
          ),
          headerShown: false,
          ...defaultTabOptions,
        }}
      />
    </Tab.Navigator>
  );
}

const BottomIconContainer = ({ name, focused }) => {
  const theme = useTheme();
  return (
    <AntDesign
      name={name}
      size={22}
      color={focused ? theme.colors.primary : "black"}
    />
  );
};

export default BottomNav;
