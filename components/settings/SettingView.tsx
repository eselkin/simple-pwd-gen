import React from "react";
import { View, StyleSheet, ViewProps } from "react-native";

interface SettingViewProps extends ViewProps {
  children: React.ReactNode;
  borderBottom?: boolean;
  show?: boolean;
}

export const SettingView: React.FC<SettingViewProps> = ({
  children,
  borderBottom = true,
  style,
  show = true,
  ...rest
}) => {
  if (!show) {
    return null;
  }
  return (
    <View
      style={[
        styles.container,
        borderBottom ? styles.borderBottom : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
