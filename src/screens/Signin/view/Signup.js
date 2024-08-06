import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Button, HelperText, Text, useTheme } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { TextInput as MaterialTextInput } from "react-native-paper";
import firebase from "firebase/compat/app";
//import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "../../../constants/FirebaseConfig";
import { adminAddRetailer } from "../helper/SigninHelper";
import useCities from "../../../hooks/useCities";
import { validateMobile } from "../helper/validateMobile";
import { MaterialIcons } from "@expo/vector-icons";

const { height } = Dimensions.get("screen");

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
  const [search, setSearch] = useState("");
  const [dropdownShown, setDropdownShown] = useState(false);
  const [showCity, setShowCity] = useState(false);
  const [otpinProgress, setOtpInProgress] = useState(false);
  const [timer, setTimer] = useState(45);
  const { cities } = useCities();

  const handleSignup = () => {
    if (!mobile || !shopName || !city) {
      Alert.alert("All fields are required");
      return;
    }
    if (!validateMobile(mobile)) {
      setErrors((prev) => ({
        ...prev,
        mobile: "Please enter a valid mobile no",
      }));
      return;
    } else {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      phoneProvider
        .verifyPhoneNumber("+91" + mobile, recaptchaVeri.current)
        .then(setVeriId)
        .catch((error) => {
          Alert.alert("Error", error.message);
        })
        .finally(() => {
          setErrors({});
          setStep(2);

          setTimeout(() => {
            setOtpInProgress(true);
          }, 45000);
          setInterval(() => {
            setTimer((prev) => prev - 1);
          }, 1000);
        });
    }
  };

  const updateCity = (val) => {
    setCity(val);
    setDropdownShown(false);
    setShowCity(true);
    setSearch("");
  };

  const filterCities = cities.filter((item) => {
    return item.toLowerCase().includes(search.toLowerCase());
  });

  const handleOTP = async () => {
    const cred = firebase.auth.PhoneAuthProvider.credential(veriId, otp);
    await firebase
      .auth()
      .signInWithCredential(cred) // verify firebase otp
      .then(() => {
        adminAddRetailer(mobile, shopName, city) // add retailer
          .then((res) => {
            if (res.error) {
              Alert.alert("Error", res.error);
              return;
            }
            Alert.alert(
              "Signed up!",
              "Please set a passcode that you can use to log in"
            );
            // go to update pin
            navigation.push("updatepin", {
              mobile_no: mobile,
            });
          })
          .catch((err) => {
            Alert.alert(err.message);
          });
      })
      .catch((err) => {
        Alert.alert("Otp Not Matched");
      });
  };

  return (
    <>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVeri}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
        androidHardwareAccelerationDisabled={true}
        androidLayerType="software"
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
        onStartShouldSetResponder={() => setDropdownShown(false)}
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
              onChangeText={(val) => setShopName(val)}
            />

            {!dropdownShown && (
              <TouchableOpacity
                style={{
                  width: "70%",
                  marginTop: "6%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderWidth: 1,
                  height: (height * 5.5) / 100,
                  alignItems: "center",
                  borderColor: "gray",
                  borderRadius: 2,
                }}
                onPress={() => setDropdownShown(true)}
              >
                <Text
                  style={[styles.city, showCity ? styles.dark : styles.light]}
                >
                  {showCity ? city : "Select City"}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={23} color="gray" />
              </TouchableOpacity>
            )}

            {dropdownShown && (
              <View
                style={{
                  width: "70%",
                  backgroundColor: "white",
                  height: (height * 32) / 100,
                  marginTop: "6%",
                }}
              >
                <MaterialTextInput
                  placeholder="Search City"
                  onChangeText={(val) => setSearch(val)}
                  mode="outlined"
                />
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  style={{
                    width: "100%",
                    marginTop: "2%",
                    borderWidth: 0.5,
                    borderRadius: 10,
                  }}
                >
                  {filterCities.map((val, i) => {
                    return (
                      <TouchableOpacity
                        style={{ paddingLeft: "6%", paddingTop: "5%" }}
                        onPress={() => updateCity(val)}
                        key={i}
                      >
                        <Text variant="bodyMedium">{val}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
            {!dropdownShown && (
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
            )}
            <HelperText type="error" visible={errors.mobile}>
              {errors.mobile}{" "}
            </HelperText>
            {!dropdownShown && (
              <Button
                onPress={handleSignup}
                style={{ ...styles.button }}
                mode="contained"
              >
                Sign Up
              </Button>
            )}
            {!dropdownShown && (
              <TouchableOpacity
                style={{ marginTop: "1%" }}
                onPress={() =>
                  navigation.navigate("userauth", { screen: "signin" })
                }
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
            )}
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
            {otpinProgress ? (
              <TouchableOpacity
                onPress={handleSignup}
                style={{ marginTop: "1%" }}
              >
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
            ) : (
              <Text
                style={{
                  color: theme.colors.primary,
                  fontWeight: "600",
                  marginTop: "1%",
                }}
                variant="bodyLarge"
              >
                Time Remaining: {timer}
              </Text>
            )}
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
  dropdowncontainer: {
    backgroundColor: "white",
    padding: 16,
    width: "100%",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  city: {
    paddingLeft: "6%",
  },
  dark: {
    color: "black",
  },
  light: {
    color: "gray",
  },
});
