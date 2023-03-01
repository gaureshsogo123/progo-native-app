import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Button, HelperText, Text, useTheme } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { TextInput as MaterialTextInput } from "react-native-paper";
import useCities from "../../../hooks/useCities";
import { validateMobile } from "../helper/validateMobile";

const { height } = Dimensions.get("screen");

function SignUp({ navigation }) {
  const theme = useTheme();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [errors, setErrors] = useState({});
  const { cities } = useCities();

  const handleSignup = () => {
    setErrors({});
    if (!city || !firstName) {
      Alert.alert("Required", "All fields are required");
      return;
    }
    if (!validateMobile(mobile)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Please enter a valid mobile no",
      }));
      return;
    }
    setStep(2);
  };

  const handleOTP = () => {
    // verify otp

    // if otp error, show alert and return

    // call admin add retailer here

    // if error, show Alert and return

    // or else push to update pin
    navigation.push("updatepin", {
      mobile_no: mobile,
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
            <HelperText type="error" visible={errors.mobile}>
              {errors.mobile}{" "}
            </HelperText>
            <Button
              onPress={handleSignup}
              style={{ ...styles.button }}
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
            <Text style={{ textAlign: "center", textAlignVertical: "center" }}>
              <AntDesign
                onPress={() => setStep(1)}
                name="arrowleft"
                size={20}
              />
              {"  "}
              OTP was sent to +91 {mobile}
            </Text>
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
        )}
      </View>
    </>
  );
}

export default SignUp;

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
