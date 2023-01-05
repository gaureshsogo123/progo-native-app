import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Dimensions } from "react-native";
import { Button, Text, useTheme, HelperText } from "react-native-paper";

import { TextInput as MaterialTextInput } from "react-native-paper";

import { useAuthContext } from "../../../context/UserAuthContext";
import { signIn } from "../helper/SigninHelper";

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

function SignIn({ navigation }) {
  const theme = useTheme();
  const [mobileNumber, setMobileNumber] = useState();
  const [pin, setPin] = useState();
  const [errors, setErrors] = useState({});

  const { loginUser, isLoggedIn } = useAuthContext();

  useEffect(() => {
    if (isLoggedIn()) navigation.navigate("bottomnav");
  }, []);

  const validateMobile = () => {
    const regex = new RegExp(/^\d{10}$/);
    return regex.test(mobileNumber);
  };

  const resetInputs = () => {
    setMobileNumber("");
    setPin("");
    setErrors({});
  };

  const handleSignIn = () => {
    setErrors({});
    if (!validateMobile()) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Please enter valid mobile number",
      }));
      return;
    }
    
    signIn({ mobile_no: mobileNumber, pin: pin })
      .then((res) => {
        if (!res.error) {
          if (res.data.rolename !== "Retailer") {
            Alert.alert(
              "Error",
              `This is a ${res.data.rolename} no. Please log in with a retailer account.`
            );
            return;
          }
          
          loginUser(res.data);
          resetInputs();
        } else {
          Alert.alert("Error", res.error);
          setErrors((prev) => ({
            ...prev,
            mobile: "Mobile Number Is not Registerd",
          }));
    
        }
      })
      .catch((err) => setErrors({ ...errors, pin:err.message }));
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
        <MaterialTextInput
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
        />
        <HelperText type="error" visible={errors.mobile}>
          {errors.mobile}{" "}
        </HelperText>

        <MaterialTextInput
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
        />

        {/* 
          When OTP is set up
          <Button mode="text" onPress={handleResetPIN} style={styles.reset}>
            Forgot PIN
          </Button> */}
        <HelperText
          style={{ textAlign: "center" }}
          type="error"
          visible={errors.pin}
        >
          {errors.pin}{" "}
        </HelperText>
        <Button style={styles.button} mode="contained" onPress={handleSignIn}>
          Sign In
        </Button>
      </View>
    </>
  );
}

export default SignIn;
