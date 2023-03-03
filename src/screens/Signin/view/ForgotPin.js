import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, Button, useTheme, HelperText } from "react-native-paper";
import { TextInput as MaterialTextInput } from "react-native-paper";
import { validateMobile } from "../helper/validateMobile";
import firebase from "firebase/compat/app";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "../../../constants/FirebaseConfig";
import { getRetailer } from "../helper/SigninHelper";

const { height } = Dimensions.get("screen");

function ForgotPin({ navigation }) {
  const theme = useTheme();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const recaptchaVeri = useRef(null);
  const [otp, setOtp] = useState("");
  const [veriId, setVeriId] = useState(null);
  const [retailers, setRetailers] = useState([]);

  const handleGetOtp = () => {
    setErrors({});
    if (!validateMobile(mobileNumber)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Please enter a valid mobile no",
      }));
      return;
    }
    if (!retailers.find((val) => val.mobileno == mobileNumber)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Mobile Number Is not Registerd",
      }));
      return;
    }
    const phoneProvider = new firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber("+91" + mobileNumber, recaptchaVeri.current)
      .then(setVeriId);
    setErrors({});
    setOtpSent(true);
  };

  useEffect(() => {
    getRetailer()
      .then((res) => {
        setRetailers(res.data);
      })
      .catch((err) => {
        //
      });
  }, []);

  const handleOTP = async () => {
    // verify otp

    // if otp error, show alert and return

    // else go to update pin

    const cred = firebase.auth.PhoneAuthProvider.credential(veriId, otp);
    await firebase
      .auth()
      .signInWithCredential(cred)
      .then(() => {
        setOtp("");
        navigation.push("updatepin", { mobile_no: mobileNumber });
      })
      .catch((err) => {
        Alert.alert("Otp Not Matched");
      });
  };

  const backToSignIn = () => {
    navigation.navigate("userauth", { screen: "signin" });
  };

  return (
    <>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVeri}
        firebaseConfig={firebaseConfig}
      />
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
        {otpSent ? (
          <>
            <Text>OTP was sent to +91 {mobileNumber}</Text>
            <MaterialTextInput
              style={{ ...styles.textInput, marginTop: "6%" }}
              mode="outlined"
              label={
                <Text style={{ backgroundColor: "white", color: "gray" }}>
                  Enter OTP
                </Text>
              }
            />
            <Button
              onPress={handleOTP}
              style={{ ...styles.button, marginTop: "6%" }}
              mode="contained"
            >
              Submit OTP
            </Button>
            <TouchableOpacity style={{ marginTop: "1%" }}>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontWeight: "600",
                }}
                variant="bodyLarge"
              >
                Resend OTP
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <MaterialTextInput
              style={{ ...styles.textInput }}
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
            <Button
              mode="contained"
              style={{ ...styles.button, marginTop: "6%" }}
              onPress={handleGetOtp}
            >
              Get OTP
            </Button>
            <TouchableOpacity
              style={{ marginTop: "1%" }}
              onPress={backToSignIn}
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
        )}
      </View>
    </>
  );
}

export default ForgotPin;

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
