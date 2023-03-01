import { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { TextInput as MaterialTextInput } from "react-native-paper";

const { height } = Dimensions.get("screen");

function ForgotPin({ navigation }) {
  const theme = useTheme();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});

  const handleOTP = () => {
    navigation.push("updatepin", { mobile_no: mobileNumber });
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
              style={{ ...styles.textInput, marginBottom: "6%" }}
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
            <Button
              mode="contained"
              style={{ ...styles.button, marginTop: "6%" }}
              onPress={() => setOtpSent(true)}
            >
              Get OTP
            </Button>
            <TouchableOpacity style={{ marginTop: "1%" }}>
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
