import React, { useState } from "react";
import { View, Text, TextInput, Keyboard } from "react-native";
import { settingsStyles } from "./settingsStyles";
import { PasswordGenSettings } from "../../settings";
interface SettingItemNumberProps {
  label: string;
  value?: number;
  update: (newValue?: number) => PasswordGenSettings;
  saveSettings: (newSettings: PasswordGenSettings) => void;
  name?: string;
}

export const SettingItemNumber: React.FC<SettingItemNumberProps> = ({
  label,
  value,
  update,
  saveSettings,
  name,
}) => {
  const [changed, setChanged] = useState(false);
  const [currentSettings, setCurrentSettings] =
    useState<PasswordGenSettings | null>(null);
  const handleChange = (text: string) => {
    setChanged(true);
    if (!text) {
      const newSettings = update(undefined);
      setCurrentSettings(newSettings);
      return;
    }
    const numericValue = parseInt(text, 10);
    if (!isNaN(numericValue)) {
      const newSettings = update(numericValue);
      setCurrentSettings(newSettings);
    }
  };

  return (
    <View style={settingsStyles.container}>
      <Text style={settingsStyles.label}>{label}</Text>
      <TextInput
        style={[settingsStyles.input, settingsStyles.textInput]}
        value={value ? String(value) : ""}
        onChangeText={handleChange}
        keyboardType="decimal-pad"
        returnKeyType="done"
        testID={name}
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
