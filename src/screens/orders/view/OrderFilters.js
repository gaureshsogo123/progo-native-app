import { TouchableOpacity, View, Dimensions, StyleSheet } from "react-native";
import {
  Modal,
  Portal,
  Provider,
  Button,
  Text,
  useTheme,
} from "react-native-paper";
import statuses from "../../../constants/statusOptions";
import DatePicker from "../../../component/DatePicker";
import DropdownContainer from "../../../component/DropdownContainer";

const { height } = Dimensions.get("screen");

const containerStyle = {
  display: "flex",
  backgroundColor: "white",
  minHeight: (height * 20) / 100,
  width: "95%",
  justifyContent: "center",
  marginLeft: "3%",
  borderRadius: 10,
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

  const statusHandlePress = (status) => {
    setStatus(status);
  };

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
          <DropdownContainer header="Select status">
            <>
              {statuses?.map((val, i) => (
                <TouchableOpacity
                  onPress={() => statusHandlePress(val.value, i)}
                  key={i}
                  style={{
                    paddingLeft: "6%",
                    backgroundColor: "rgb(240,240,240)",
                  }}
                >
                  <Text
                    style={{
                      paddingBottom: (height * 2) / 100,
                      paddingTop: (height * 1) / 100,
                      color:
                        val.value === status ? theme.colors.primary : "#616161",
                    }}
                  >
                    {val.value}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
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
              <DatePicker
                date={startDate}
                setDate={setStartDate}
                text={"From"}
                showFlag={true}
              />
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
              <DatePicker
                date={endDate}
                setDate={setEndDate}
                text={"To"}
                showFlag={true}
              />
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
        </Modal>
      </Portal>
    </Provider>
  );
}

export default OrderFilters;
