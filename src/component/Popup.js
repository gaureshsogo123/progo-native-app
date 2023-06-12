import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Text,
  FlatList,
} from "react-native";
import {
  Modal,
  Portal,
  Provider,
  TextInput,
  useTheme,
} from "react-native-paper";

const { height, width } = Dimensions.get("screen");

function Popup({
  visible,
  onDismiss,
  valueField = "value",
  value,
  onItemPress,
  data,
  showSearch,
}) {
  const theme = useTheme();
  const [search, setSearch] = useState("");

  const handleItemPress = (value) => {
    onItemPress(value);
    onDismiss();
  };

  const filterdata = useMemo(() => {
    return data.filter((val) => {
      if (val[valueField] === "" || search == "") {
        return val;
      }
      return val[valueField].toLowerCase().includes(search.toLowerCase());
    });
  }, [search, data]);

  const renderData = ({ item }) => {
    let style = {};
    if (value === item[valueField]) {
      style = { color: theme.colors.primary };
    }
    return (
      <View style={{ marginLeft: (width * 4) / 100 }}>
        <TouchableOpacity
          onPress={() => handleItemPress(item[valueField])}
          style={{
            paddingBottom: (height * 2) / 100,
            paddingTop: (height * 2) / 100,
          }}
        >
          <Text
            variant="titleMedium"
            style={{
              fontSize: (height * 1.7) / 100,
              fontWeight: "500",
              ...style,
            }}
          >
            {item[valueField]}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Provider>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={() => onDismiss()}
            contentContainerStyle={containerStyle}
          >
            {showSearch && (
              <TextInput
                style={{
                  width: "100%",
                  height: (height * 6) / 100,
                  marginBottom: (height * 1.6) / 100,
                }}
                theme={theme}
                onChangeText={(val) => setSearch(val)}
                placeholder="Search"
              />
            )}
            <FlatList
              data={filterdata}
              renderItem={renderData}
              keyboardShouldPersistTaps={"handled"}
              keyExtractor={(item, index) => index}
            />
          </Modal>
        </Portal>
      </Provider>
    </>
  );
}

export default Popup;

const containerStyle = {
  backgroundColor: "#eeeeee",
  width: "90%",
  marginLeft: "5.5%",
  display: "flex",
  maxHeight: (height * 30) / 100,
  borderRadius: 10,
  alignContent: "center",
  maxHeight: (height * 70) / 100,
};
