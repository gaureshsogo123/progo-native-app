import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import React from 'react'
import LandingScreen from "../landingScreen/view/LandingScreen";
import PurchaseOrderScreen from "../purchaseorder/view/PurchaseOrderScreen";
import Orders from "../orders/view/Orders";
import { Signout } from "../Signout";



const Tab = createBottomTabNavigator();

function BottomNav() {

  return (
    <Tab.Navigator>
        <Tab.Screen
        name="Home"
        component={LandingScreen}
        options={{
          tabBarIcon:()=> <BottomIconContainer name="home"/>
        }}/>
        <Tab.Screen
        name="purchaseorder"
        component={PurchaseOrderScreen}
        options={{
          tabBarIcon:()=><BottomIconContainer name="filetext1"/>
        }}/>
        <Tab.Screen
        name="My Orders"
        component={Orders}
        options={{
          tabBarIcon:()=><BottomIconContainer name="book"/>
        }}/>
         <Tab.Screen
        name="Log Out"
        component={Signout}
        options={{
          tabBarIcon:()=><BottomIconContainer name="logout"/>
        }}/>

        </Tab.Navigator>
  )
}


const BottomIconContainer = (({name})=>{
  return  <AntDesign name={name} size={22} color="black" />
  
})

export default BottomNav;