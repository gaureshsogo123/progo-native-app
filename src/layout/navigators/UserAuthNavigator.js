import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from '../../screens/Signin/view/Signin';
import SignUp from '../../screens/Signin/view/Signup';

const UserStackNavigator = createNativeStackNavigator();


const UserAuthNavigator = () => {
  return (
    <UserStackNavigator.Navigator>
        <UserStackNavigator.Screen
        name='signin'
        component={SignIn}
        options={{ 
          headerShown:false
         }}
        />
     <UserStackNavigator.Screen
     name='signup'
     component={SignUp}
     options={{
        headerShown:false
    }}


     />   
        
    </UserStackNavigator.Navigator>
  )
}

export default UserAuthNavigator