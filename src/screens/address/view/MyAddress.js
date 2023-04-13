import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import useAddress from "./../helper/useAddress";
import EditAddress from "./EditAddress";
import { Button } from "react-native-paper";
import { useAuthContext } from "../../../context/UserAuthContext";
import LoadingContainer from "../../../component/LoadingContainer";

const MyAddress = ({ navigation }) => {
  const { user } = useAuthContext();
  const { address, loading, error, setAddress } = useAddress(user.userId);
  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <LoadingContainer loading={loading}>
        {editMode ? (
          <EditAddress
            setEditMode={setEditMode}
            address={address}
            setAddress={setAddress}
          />
        ) : (
          <View style={styles.container}>
            {error && <Text>Error fetching address address.</Text>}
            {address && (
              <>
                <View style={styles.addressContainer}>
                  <Text style={styles.label} variant="titleMedium">
                    Address:{" "}
                  </Text>
                  <Text style={styles.value} variant="bodyLarge">
                    {address.street1},{" "}
                    {address.street2 && `${address.street2}, `}
                    {address.city}
                  </Text>
                  <Text style={styles.label} variant="titleMedium">
                    District:{" "}
                  </Text>
                  <Text style={styles.value} variant="bodyLarge">
                    {address.district}
                  </Text>
                  <Text style={styles.label} variant="titleMedium">
                    State:{" "}
                  </Text>
                  <Text style={styles.value} variant="bodyLarge">
                    {address.state}
                  </Text>
                  <Text style={styles.label} variant="titleMedium">
                    Landmark:{" "}
                  </Text>
                  <Text style={styles.value} variant="bodyLarge">
                    {address.landmark}
                  </Text>
                  <Text style={styles.label} variant="titleMedium">
                    PIN Code:{" "}
                  </Text>
                  <Text style={styles.value} variant="bodyLarge">
                    {address.zipcode}
                  </Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <Button
                    style={styles.button}
                    onPress={!loading && (() => navigation.pop(1))}
                  >
                    Back
                  </Button>
                  <Button
                    mode="contained"
                    style={styles.button}
                    onPress={!loading && (() => setEditMode(true))}
                  >
                    Edit
                  </Button>
                </View>
              </>
            )}
          </View>
        )}
      </LoadingContainer>
    </>
  );
};

export default MyAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
    width: "100%",
    paddingHorizontal: "2%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  label: {
    marginBottom: 5,
    fontWeight: "600",
  },
  value: {
    marginBottom: 10,
  },
  button: {
    width: 100,
  },
});
