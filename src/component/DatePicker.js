import React, { useState } from "react";
import { View, Platform, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

function DatePicker({ date, setDate, text, showFlag = false }) {
  const [datePicker, setDatePicker] = useState(false);
  const [flag, setFlag] = useState(showFlag);

  function showDatePicker() {
    setDatePicker(true);
  }

  function onDateSelected(event, value) {
    setDatePicker(false);
    setDate(value);
    setFlag(true);
  }

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  return (
    <View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 8,
          borderRadius: 3,
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity onPress={showDatePicker}>
          <Text variant="bodyLarge" style={{ color: "black" }}>
            {flag ? `${day}-${month}-${year}` : text}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={showDatePicker}>
          <MaterialIcons
            name="date-range"
            size={15}
            style={{ paddingLeft: 6, paddingTop: "1.5%" }}
          />
        </TouchableOpacity>
      </View>

      {datePicker && (
        <DateTimePicker
          value={date}
          mode={"date"}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          is24Hour={true}
          onChange={onDateSelected}
        />
      )}
    </View>
  );
}

export default DatePicker;
