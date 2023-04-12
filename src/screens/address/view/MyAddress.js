import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
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
                  <Text style={styles.label}>Address: </Text>
                  <Text style={styles.value}>
                    {address.street1},{" "}
                    {address.street2 && `${address.street2}, `}
                    {address.city}
                  </Text>
                  <Text style={styles.label}>District: </Text>
                  <Text style={styles.value}>{address.district}</Text>
                  <Text style={styles.label}>State: </Text>
                  <Text style={styles.value}>{address.state}</Text>
                  <Text style={styles.label}>Landmark: </Text>
                  <Text style={styles.value}>{address.landmark}</Text>
                  <Text style={styles.label}>PIN Code: </Text>
                  <Text style={styles.value}>{address.zipcode}</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                  }}
                >
                  <Button onPress={!loading && (() => navigation.pop(1))}>
                    Back
                  </Button>
                  <Button
                    mode="contained"
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
});
