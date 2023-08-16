import React, { useEffect, useState } from "react";
import {
  Alert,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import axiosInstance from "../../../axiosInstance";
import { useAuthContext } from "../../../context/UserAuthContext";
import useCities from "../../../hooks/useCities";
import useAddress from "../helper/useAddress";
import Popup from "./../../../component/Popup";

const { height } = Dimensions.get("screen");

function EditAddress({ setEditMode, address, setAddress }) {
  const { user } = useAuthContext();
  const theme = useTheme();
  const { cities } = useCities();
  const { updateAddress } = useAddress(user.userId);
  const [newAddress, setNewAddress] = useState(address);
  const [loading, setLoading] = useState(false);
  const [showCityPopup, setShowCityPopup] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      if (newAddress.zipcode?.length < 6) return;
      try {
        setErrors((prev) => ({ ...prev, zipcode: "" }));
        const { data } = await axiosInstance.get(
          `/pincode/${newAddress.zipcode}`
        );
        if (data && data.data) {
          const { District, State } = data.data;
          // handleAddressAttributeChange("city", District);
          handleAddressAttributeChange("district", District);
          handleAddressAttributeChange("state", State);
        }
      } catch (error) {
        if (error.response?.data?.message?.toLowerCase() === "invalid pin") {
          setErrors((prev) => ({ ...prev, zipcode: "Invalid Pin" }));
        }
      }
    })();
  }, [newAddress?.zipcode]);

  const handleAddressAttributeChange = (key, value) => {
    setNewAddress((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validateInputs = () => {
    const temp = {};
    if (!newAddress.city) temp.city = "City is required";
    if (!newAddress.district) temp.district = "District is required";
    if (!newAddress.street1) temp.street1 = "Street 1 isa required";
    if (!newAddress.state) temp.state = "State is required";
    if (!newAddress.zipcode) temp.zipcode = "PIN code is required";
    if (errors.zipcode.toLowerCase() === "invalid pin")
      temp.zipcode = "Invalid PIN";
    setErrors(temp);
    return !Object.values(temp).length > 0;
  };

  const handleUpdateAddress = async () => {
    if (!validateInputs()) return;
    try {
      setLoading(true);
      const { error, data } = await updateAddress(newAddress);
      if (error) {
        Alert.alert("Error", "There was an error");
      } else {
        setAddress(data);
        Alert.alert("Success", "You address has been saved");
      }
      setEditMode(false);
    } catch (error) {
      //
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Input
          label={"Street 1"}
          value={"street1"}
          handleChange={handleAddressAttributeChange}
          multiline={true}
          errors={errors}
          address={newAddress}
        />
        <Input
          label={"Street 2 (Optional)"}
          value={"street2"}
          handleChange={handleAddressAttributeChange}
          multiline={true}
          errors={errors}
          address={newAddress}
        />
        <Input
          label={"Landmark (Optional)"}
          value={"landmark"}
          handleChange={handleAddressAttributeChange}
          multiline={true}
          errors={errors}
          address={newAddress}
        />
        <Input
          label={"PIN Code"}
          value={"zipcode"}
          handleChange={handleAddressAttributeChange}
          errors={errors}
          address={newAddress}
        >
          <HelperText type="info" visible={true}>
            Enter a valid PIN and we will automatically detect your District and
            State
          </HelperText>
        </Input>
        <Text style={styles.label} variant="titleMedium">
          City
        </Text>
        <View style={{ width: "100%" }}>
          <TouchableOpacity onPress={() => setShowCityPopup(true)}>
            <View
              style={{
                backgroundColor: theme.colors.background,
                borderColor: "gray",
                borderWidth: 1,
                padding: "3%",
                borderRadius: 5,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: (height * 1.9) / 100,
                }}
              >
                {newAddress?.city || "Select City"}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={23} color="gray" />
            </View>
            {errors.city && (
              <HelperText visible={errors.category} type={"error"}>
                {errors.city}{" "}
              </HelperText>
            )}
          </TouchableOpacity>
        </View>
        <Input
          label={"District"}
          value={"district"}
          handleChange={handleAddressAttributeChange}
          errors={errors}
          address={newAddress}
        />
        <Input
          label={"State"}
          value={"state"}
          handleChange={handleAddressAttributeChange}
          errors={errors}
          address={newAddress}
        />
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            width: "96%",
            marginHorizontal: "2%",
          }}
        >
          <Button
            onPress={
              !loading &&
              (() => {
                setEditMode(false);
              })
            }
            style={styles.button}
          >
            Cancel
          </Button>
          <Button
            onPress={!loading && handleUpdateAddress}
            mode="contained"
            loading={loading}
            style={styles.button}
          >
            Save
          </Button>
        </View>
      </ScrollView>
      <Popup
        visible={showCityPopup}
        onDismiss={() => setShowCityPopup(false)}
        value={newAddress.city}
        data={cities.map((city) => ({ city: city }))}
        valueField={"city"}
        showSearch={cities.length > 7 ? true : false}
        onItemPress={(val) => handleAddressAttributeChange("city", val)}
      />
    </>
  );
}

export default EditAddress;

const Input = ({
  value,
  label,
  handleChange,
  errors,
  address,
  children,
  ...props
}) => (
  <>
    <Text style={styles.label} variant="titleMedium">
      {label}
    </Text>
    <TextInput
      mode="outlined"
      theme={{ roundness: 10 }}
      style={{
        elevation: 1,
        marginBottom: 5,
      }}
      value={address[value]}
      onChangeText={(val) => handleChange(value, val)}
      {...props}
    />
    {errors[value] && (
      <HelperText visible={errors[value]} type="error">
        {errors[value]}{" "}
      </HelperText>
    )}
    {children}
  </>
);

const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
  },
  container: {
    width: "100%",
    paddingHorizontal: "2%",
    paddingVertical: "3%",
  },
  button: {
    width: 100,
    marginBottom: 25,
  },
});
