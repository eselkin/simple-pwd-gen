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
  min?: number;
  max?: number;
}

export const SettingItemNumber: React.FC<SettingItemNumberProps> = ({
  label,
  value,
  update,
  saveSettings,
  name,
  min = 0,
  max = 100,
}) => {
  const [changed, setChanged] = useState(false);
  const [currentSettings, setCurrentSettings] =
    useState<PasswordGenSettings | null>(null);
  const [valueToUpdate, setValueToUpdate] = useState<number | undefined>(
    value ?? undefined
  );
  const handleChange = (text: string) => {
    setChanged(true);
    if (!text) {
      setValueToUpdate(min ?? undefined);
      return;
    }
    let numericValue = parseInt(text, 10);
    if (!isNaN(numericValue)) {
      if (min && numericValue <= min) {
        numericValue = min;
      }
      if (max && numericValue >= max) {
        numericValue = max;
      }
      setValueToUpdate(numericValue);
    }
  };

  return (
    <View style={settingsStyles.container}>
      <Text style={settingsStyles.label}>{label}</Text>
      <TextInput
        style={[settingsStyles.input, settingsStyles.textInput]}
        value={valueToUpdate === undefined ? "" : String(valueToUpdate)}
        onChangeText={handleChange}
        keyboardType="decimal-pad"
        returnKeyType="done"
        testID={name}
        onSubmitEditing={() => {
          Keyboard.dismiss();
          if (changed && valueToUpdate !== undefined) {
            const currentSettings = update(valueToUpdate);
            saveSettings(currentSettings);
            setChanged(false);
          }
        }}
        onBlur={() => {
          Keyboard.dismiss();
          if (changed) {
            const currentSettings = update(valueToUpdate);
            saveSettings(currentSettings);
            setChanged(false);
          }
        }}
      />
    </View>
  );
};
