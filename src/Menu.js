import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Text, List } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useAuthContext } from "./context/UserAuthContext";

function Menu({ navigation }) {
  const { user, logoutUser } = useAuthContext();

  return (
    <>
      <List.Item
        title="Update Pin"
        left={(props) => <AntDesign name="edit" {...props} />}
        onPress={() =>
          navigation.push("UpdatePin", { mobile_no: user.mobileNo })
        }
        style={styles.listItem}
      />
      <List.Item
        title="Sign Out"
        left={(props) => <AntDesign name="logout" {...props} />}
        onPress={logoutUser}
        style={styles.listItem}
      />
    </>
  );
}

export default Menu;

const styles = StyleSheet.create({
  listItem: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
});
