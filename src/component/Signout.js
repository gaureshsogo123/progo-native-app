import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useAuthContext } from "../context/UserAuthContext";

const Signout = () => {
  const { logoutUser } = useAuthContext();
  useEffect(() => {
    logoutUser();
  });
  return (
    <View>
      <Text>Signout</Text>
    </View>
  );
};

export default Signout;
