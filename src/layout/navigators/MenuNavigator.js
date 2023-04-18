import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Signout from "../../component/Signout";
import Menu from "../../Menu";
import MyAddress from "../../screens/address/view/MyAddress";
import UpdatePin from "../../screens/Signin/view/UpdatePin";

const MenuStack = createNativeStackNavigator();

const MenuNavigator = () => {
  return (
    <MenuStack.Navigator>
      <MenuStack.Screen
        name="MenuList"
        component={Menu}
        options={{ title: "Menu" }}
      />
      <MenuStack.Screen name="My Address" component={MyAddress} />
      <MenuStack.Screen name="SignOut" component={Signout} />
      <MenuStack.Screen
        name="UpdatePin"
        component={UpdatePin}
        options={{ title: "Update PIN" }}
      />
    </MenuStack.Navigator>
  );
};

export default MenuNavigator;
