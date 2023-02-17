import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Button, Text, useTheme, HelperText } from "react-native-paper";

import { TextInput as MaterialTextInput } from "react-native-paper";

const { height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  sogoBg: {
    height: "25%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    width: "70%",
    padding: 0,
    fontSize: 15,
  },
  reset: {
    textAlign: "left",
  },
  button: {
    width: "70%",
    borderRadius: 5,
  },
  head: {
    fontFamily: "serif",
    fontWeight: "500",
    fontSize: (height * 4) / 100,
  },
});

function SignUp({ navigation }) {
  const theme = useTheme();

  // to reset forgotten pin when otp function is set up
  // const handleResetPIN = () => {
  //   navigation.push("UpdatePin", { mobile_no: "", signUp: false });
  // };

  return (
    <>
      <View style={styles.sogoBg}>
        <Text variant="displayMedium" style={styles.head}>
          {" "}
          BOGO
        </Text>
      </View>

      <View
        style={{
          ...styles.container,
          backgroundColor: theme.colors.background,
        }}
      >
        <MaterialTextInput
          style={styles.textInput}
          mode="outlined"
          label={
            <Text style={{ backgroundColor: "white", color: "gray" }}>
              Shop Name
            </Text>
          }
        />

        <MaterialTextInput
          style={{ ...styles.textInput, marginTop: "6%" }}
          mode="outlined"
          label={
            <Text style={{ backgroundColor: "white", color: "gray" }}>
              City
            </Text>
          }
        />

        <MaterialTextInput
          style={{ ...styles.textInput, marginTop: "6%" }}
          mode="outlined"
          label={
            <Text style={{ backgroundColor: "white", color: "gray" }}>
              Mobile Number
            </Text>
          }
        />
        <MaterialTextInput
          style={{ ...styles.textInput, marginTop: "6%" }}
          mode="outlined"
          label={
            <Text style={{ backgroundColor: "white", color: "gray" }}>
              Create 6 digit pin code
            </Text>
          }
        />
        <Button style={{ ...styles.button, marginTop: "6%" }} mode="contained">
          Send Otp
        </Button>
        <TouchableOpacity style={{ marginTop: "1%" }} onPress={()=>navigation.navigate("signin")}>
          <Text
            style={{
              color: theme.colors.primary,
              fontWeight: "600",
            }}
            variant="bodyLarge"
          >
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default SignUp;
