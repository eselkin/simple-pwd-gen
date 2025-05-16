import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Keyboard } from "react-native";
import { settingsStyles } from "./settingsStyles";
import { PasswordGenSettings } from "../../settings";

interface SettingItemTextProps {
  label: string;
  value: string;
  update: (newValue: string) => PasswordGenSettings;
  maxLength?: number;
  saveSettings: (newSettings: PasswordGenSettings) => void;
}

export const SettingItemText: React.FC<SettingItemTextProps> = ({
  label,
  value,
  update,
  maxLength,
  saveSettings,
}) => {
  const [changed, setChanged] = useState(false);
  const [currentSettings, setCurrentSettings] =
    useState<PasswordGenSettings | null>(null);
  return (
    <View style={settingsStyles.container}>
      <Text style={settingsStyles.label}>{label}</Text>
      <TextInput
        style={[settingsStyles.input, settingsStyles.textInput]}
        value={value}
        onChangeText={(text) => {
          setChanged(true);
          const newSettings = update(text);
          setCurrentSettings(newSettings);
        }}
        maxLength={maxLength ?? undefined}
        keyboardType="numbers-and-punctuation"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        returnKeyType="done"
        returnKeyLabel="done"
        onSubmitEditing={() => {
          Keyboard.dismiss();
          if (changed && currentSettings) {
            saveSettings(currentSettings);
            setChanged(false);
          }
        }}
        onBlur={() => {
          Keyboard.dismiss();
          if (changed && currentSettings) {
            saveSettings(currentSettings);
            setChanged(false);
          }
        }}
      />
    </View>
  );
};
