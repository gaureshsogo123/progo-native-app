import React from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

const LoadingContainer = ({ loading, children }) => {
  const theme = useTheme();
  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator animating={true} color={theme.colors.primary} />
    </View>
  ) : (
    children
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoadingContainer;
