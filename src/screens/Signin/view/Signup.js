import parseWithOptions from "date-fns/fp/parseWithOptions/index";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

import { TextInput as MaterialTextInput } from "react-native-paper";
import firebase from "firebase/compat/app";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "../../../constants/FirebaseConfig";
import { adminAddRetailer } from "../helper/SigninHelper";
import { useAuthContext } from "../../../context/UserAuthContext";
import { useNavigation } from "@react-navigation/native";

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
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [shopName, setShopName] = useState("");
  const [city, setCity] = useState("");
  const [otp, setOtp] = useState("");
  const [veriId, setVeriId] = useState(null);
  const recaptchaVeri = useRef(null);
  const [errors, setErrors] = useState({});
  const { loginUser, isLoggedIn } = useAuthContext();

  const navi = useNavigation();
  const handleSignup = () => {
    if (mobile && shopName && city) {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      phoneProvider
        .verifyPhoneNumber("+91" + mobile, recaptchaVeri.current)
        .then(setVeriId);
      setStep(2);
    }
  };

  const handleOTP = () => {
      navigation.push("updatepin", {
      mobile_no: mobile,
    })
    
    const cred = firebase.auth.PhoneAuthProvider.credential(veriId, otp);
    const res = firebase
      .auth()
      .signInWithCredential(cred)
      .then(() => {
        setOtp("");
        adminAddRetailer(mobile, shopName, city);
        Alert.alert("Retailer Added");
        navi.goBack();
      })
      .catch((err) => {
        Alert.alert("Otp Not Matched");
      });
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
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVeri}
          firebaseConfig={firebaseConfig}
        />
        {step === 1 ? (
          <>
            <MaterialTextInput
              style={styles.textInput}
              mode="outlined"
              label={
                <Text style={{ backgroundColor: "white", color: "gray" }}>
                  Shop Name
                </Text>
              }
              onChangeText={(val) => setShopName(val)}
            />

            <MaterialTextInput
              style={{ ...styles.textInput, marginTop: "6%" }}
              mode="outlined"
              label={
                <Text style={{ backgroundColor: "white", color: "gray" }}>
                  City
                </Text>
              }
              onChangeText={(val) => setCity(val)}
            />

            <MaterialTextInput
              style={{ ...styles.textInput, marginTop: "6%" }}
              mode="outlined"
              onChangeText={(val) => setMobile(val)}
              label={
                <Text style={{ backgroundColor: "white", color: "gray" }}>
                  Mobile Number
                </Text>
              }
            />
            {/* <MaterialTextInput
          style={{ ...styles.textInput, marginTop: "6%" }}
          mode="outlined"
          label={
            <Text style={{ backgroundColor: "white", color: "gray" }}>
              Enter passcode
            </Text>
          }
        /> */}
            <Button
              onPress={handleSignup}
              style={{ ...styles.button, marginTop: "6%" }}
              mode="contained"
            >
              Sign Up
            </Button>
            <TouchableOpacity
              style={{ marginTop: "1%" }}
              onPress={() => navigation.navigate("signin")}
            >
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
          </>
        ) : (
          <>
            <Text>OTP was sent to +91 {mobile}</Text>
            <MaterialTextInput
              style={{ ...styles.textInput, marginTop: "6%" }}
              mode="outlined"
              label={
                <Text style={{ backgroundColor: "white", color: "gray" }}>
                  Enter OTP
                </Text>
              }
              value={otp}
              onChangeText={setOtp}
            />
            <Button
              onPress={handleOTP}
              style={{ ...styles.button, marginTop: "6%" }}
              mode="contained"
            >
              Submit OTP
            </Button>
          </>
        )}
      </View>
    </>
  );
}

export default SignUp;
