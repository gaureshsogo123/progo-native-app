import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import BottomNav from './src/layout/BottomNav';

import PurchaseOrderScreen from './src/purchaseorder/view/PurchaseOrderScreen';
import SignIn from './src/Signin/view/Signin';

const Stack = createNativeStackNavigator();


export default function App() {
  
  return (
    <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
              name='signin'
              component={SignIn}
              options={{ headerShown: false }}/>
              
              <Stack.Screen
                name="bottomnav"
                component={BottomNav}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="purchaseorder"
                component={PurchaseOrderScreen}
              />

            </Stack.Navigator>
          </NavigationContainer>
       
  );
}


