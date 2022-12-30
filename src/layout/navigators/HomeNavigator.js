import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LandingScreen from '../../screens/landingScreen/view/LandingScreen';
import PurchaseOrderScreen from '../../screens/purchaseorder/view/PurchaseOrderScreen';

const HomeStackNavigator = createNativeStackNavigator();


const HomeNavigator = () => {
  return (
    <HomeStackNavigator.Navigator>
        <HomeStackNavigator.Screen
        name='Landing Screen'
        component={LandingScreen}
        options={{ 
          title :"Home"
         }}
        />

     <HomeStackNavigator.Screen
     name='purchaseorder'
     component={PurchaseOrderScreen}
     options={{
      title: "Create Purchase Order",
    }}


     />   
        
    </HomeStackNavigator.Navigator>
  )
}

export default HomeNavigator