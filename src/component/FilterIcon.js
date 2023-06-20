import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { useTheme } from "react-native-paper";
import { useSearchContext } from "../context/SearchContext";
const { height, width } = Dimensions.get("screen");
const FilterIcon = () => {
  const { setShown } = useSearchContext();
  const theme = useTheme();
  const filterHandlePress = () => {
    setShown(true);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.filtericon}>
      <TouchableOpacity onPress={filterHandlePress}>
        <AntDesign
          name="filter"
          size={22}
          color={theme.colors.primary}
          style={{ alignSelf: "center" }}
        />
        <Text
          style={{
            fontSize: (height * 1.2) / 100,
            color: theme.colors.primary,
          }}
        >
          Filters
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterIcon;

const styles = StyleSheet.create({
  filtericon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 7,
    marginRight: -(width * 3) / 100,
  },
});
