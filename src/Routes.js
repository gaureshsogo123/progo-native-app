import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import BottomNav from "./layout/BottomNav";
import { useAuthContext } from "./context/UserAuthContext";
import SignIn from "./screens/Signin/view/Signin";

const Stack = createNativeStackNavigator();

const Routes = () => {
  const { isLoggedIn } = useAuthContext();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn() ? (
          <Stack.Screen
            name="bottomnav"
            component={BottomNav}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="signin"
            component={SignIn}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
