import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Dimensions } from "react-native";
import {
  Button,
  TextInput,
  Text,
  useTheme,
  HelperText,
} from "react-native-paper";


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
    height: height - 60,
    width: 300,
    padding: 0,
    fontSize: 15,
    marginBottom:"6%"
  },
  reset: {
    textAlign: "left",
  },
  button: {
    width: 300,
    borderRadius: 5,
  },
  head: {
    fontFamily: "serif",
    fontWeight: "500",
    fontSize: 35,
  },
});

const { height } = Dimensions.get("screen");

function SignIn({ navigation }) {
  const theme = useTheme();
  const [mobileNumber, setMobileNumber] = useState();
  const [pin, setPin] = useState();
  const [errors, setErrors] = useState({});

  



  
  const handleSignIn = () => {
    navigation.navigate('bottomnav')
      };

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
          <TextInput
            style={styles.textInput}
            mode="outlined"
            label={
              <Text style={{ backgroundColor: "white", color: "gray" }}>
                Phone Number
              </Text>
            }
            keyboardType={"numeric"}
            value={mobileNumber}
            onChangeText={(e) => {
              if (/^\d[0-9]*$/.test(e) || e === "") {
                setMobileNumber(e);
                setErrors({ ...errors, mobile: "" });
              } else {
                setErrors({ ...errors, mobile: "Only numbers allowed" });
              }
            }}
          ></TextInput>
           <View>
            <TextInput
              style={styles.textInput}
              mode="outlined"
              label={
                <Text style={{ backgroundColor: "white", color: "gray" }}>
                  Enter PIN
                </Text>
              }
              value={pin}
              secureTextEntry={true}
              onChangeText={(e) => {
                setErrors({ ...errors, otp: "" });
                setPin(e);
              }}
            ></TextInput>
          </View>
          {/* 
          When OTP is set up
          <Button mode="text" onPress={handleResetPIN} style={styles.reset}>
            Forgot PIN
          </Button> */}
          
          <Button style={styles.button} mode="contained" onPress={handleSignIn}>
            Sign In
          </Button>
        </View>
      </>
    );
  
}

export default SignIn;
