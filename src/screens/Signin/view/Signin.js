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

import { useAuthContext } from "../../../context/UserAuthContext";
import { signIn } from "../helper/SigninHelper";
import { validateMobile } from "../helper/validateMobile";

const { height } = Dimensions.get("screen");

function SignIn({ navigation }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState();
  const [pin, setPin] = useState();
  const [errors, setErrors] = useState({});

  const { loginUser, isLoggedIn } = useAuthContext();

  useEffect(() => {
    if (isLoggedIn()) navigation.navigate("bottomnav");
  }, []);

  const resetInputs = () => {
    setMobileNumber("");
    setPin("");
    setErrors({});
  };

  const handleSignIn = () => {
    setErrors({});
    if (!validateMobile(mobileNumber)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Please enter valid mobile number",
      }));
      return;
    }
    if (loading) return;
    setLoading(true);

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
        }
      })
      .catch((err) => setErrors({ ...errors, pin: err.message }))
      .finally(() => setLoading(false));
  };

  const handleForgotPin = () => {
    navigation.push("forgotpin");
  };

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
        <>
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
          <HelperText
            style={{ textAlign: "center" }}
            type="error"
            visible={errors.pin}
          >
            {errors.pin}{" "}
          </HelperText>
          <Button
            style={styles.button}
            mode="contained"
            loading={loading}
            onPress={!loading && handleSignIn}
          >
            {!loading && "Sign In"}
          </Button>
          {/*
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              marginTop: "1%",
            }}
          >
            
            <TouchableOpacity onPress={handleForgotPin}>
              <Text
                style={{ color: theme.colors.primary, fontWeight: "600" }}
                variant="bodyLarge"
              >
                Forgot pin ?
              </Text>
          </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("signup")}>
              <Text
                style={{ color: theme.colors.primary, fontWeight: "600" }}
                variant="bodyLarge"
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
          */}
        </>
      </View>
    </>
  );
}

export default SignIn;

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
