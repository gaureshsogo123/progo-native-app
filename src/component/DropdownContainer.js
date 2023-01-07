import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

const useStyles = () => {
  const styles = {
    container: {
      padding: "4%",
      borderBottomColor: "silver",
      borderBottomWidth: 1,
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      width: "100%",
      backgroundColor: "white",
    },
  };
  return styles;
};

function DropdownContainer({ header, children }) {
  const styles = useStyles();
  const [open, setOpen] = useState(false);

  const handleToggleOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handleToggleOpen}>
        <Text>{header}</Text>
        <AntDesign name={open ? "up" : "down"} size={17} color="gray" />
      </TouchableOpacity>
      <>{open && children}</>
    </>
  );
}

export default DropdownContainer;
