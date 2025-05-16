import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { settingsStyles } from "./settingsStyles";
import { PasswordGenSettings } from "../../settings";

interface SettingItemToggleProps {
  label: string;
  value: boolean;
  update: (newValue: boolean) => PasswordGenSettings;
  saveSettings: (newSettings: PasswordGenSettings) => void;
  name?: string;
}

export const SettingItemToggle: React.FC<SettingItemToggleProps> = ({
  label,
  value,
  update,
  saveSettings,
  name,
}) => {
  return (
    <View style={settingsStyles.container}>
      <Text style={settingsStyles.label}>{label}</Text>
      <Switch
        style={settingsStyles.input}
        value={value}
        onValueChange={(newValue) => {
          const newSettings = update(newValue);
          saveSettings(newSettings);
        }}
        nativeID={name}
        id={name}
        testID={name}
      />
    </View>
  );
};
