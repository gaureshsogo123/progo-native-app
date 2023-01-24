import { View, Dimensions, StyleSheet, ScrollView } from "react-native";
import {
  Modal,
  Portal,
  Provider,
  Button,
  Text,
  useTheme,
} from "react-native-paper";
import { useMemo } from "react";
import statuses from "../../../constants/statusOptions";
import DatePicker from "../../../component/DatePicker";
import DropdownContainer from "../../../component/DropdownContainer";
import SingleSelect from "../../../component/SingleSelect";

const { height } = Dimensions.get("screen");

const containerStyle = {
  display: "flex",
  backgroundColor: "white",
  minHeight: (height * 20) / 100,
  width: "95%",
  justifyContent: "center",
  marginLeft: "3%",
};

const styles = StyleSheet.create({
  datecontainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "3%",
    backgroundColor: "#f5f5f5",
  },
});

function OrderFilters({
  startDate,
  status,
  shown,
  endDate,
  setStartDate,
  setEndDate,
  setShown,
  setStatus,
}) {
  const theme = useTheme();

  const handleClose = () => {
    setShown(false);
  };

  return (
    <Provider>
      <Portal>
        <Modal
          visible={shown}
          onDismiss={() => setShown(false)}
          contentContainerStyle={containerStyle}
        >
          <View
            style={{
              maxHeight: (height * 70) / 100,
              backgroundColor: "#f5f5f5",
            }}
          >
            <ScrollView>
              <DropdownContainer header="Select status">
                <SingleSelect
                  data={statuses}
                  value={status}
                  labelField={"value"}
                  setValue={setStatus}
                  theme={theme}
                />
              </DropdownContainer>

              <DropdownContainer header={"Select Date"}>
                <View style={styles.datecontainer}>
                  <Text
                    variant="titleMedium"
                    style={{
                      textAlignVertical: "center",
                      fontSize: (height * 1.5) / 100,
                      color: "#616161",
                    }}
                  >
                    From :{" "}
                  </Text>
                  {useMemo(
                    () => (
                      <DatePicker
                        date={startDate}
                        setDate={setStartDate}
                        text={"From"}
                        showFlag={true}
                      />
                    ),
                    [startDate]
                  )}
                  <Text
                    variant="titleMedium"
                    style={{
                      textAlignVertical: "center",
                      fontSize: (height * 1.5) / 100,
                      color: "#616161",
                    }}
                  >
                    To :{" "}
                  </Text>
                  {useMemo(
                    () => (
                      <DatePicker
                        date={endDate}
                        setDate={setEndDate}
                        text={"To"}
                        showFlag={true}
                      />
                    ),
                    [endDate]
                  )}
                </View>
              </DropdownContainer>
              <Button
                mode="contained"
                style={{
                  borderRadius: 3,
                  width: "95%",
                  marginLeft: "3%",
                  marginTop: "5%",
                  marginBottom: "2%",
                  backgroundColor: theme.colors.primary,
                }}
                onPress={handleClose}
              >
                View Result
              </Button>
            </ScrollView>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
}

export default OrderFilters;
