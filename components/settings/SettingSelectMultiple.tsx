import { View, Text, Switch } from "react-native";
import { settingsStyles } from "./settingsStyles";
import { PickerIOS as Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { PasswordGenSettings } from "../../settings";

interface SettingSelectMultipleProps {
  label: string;
  value: string[];
  options: { id: string; label: string }[];
  update: (newValue: string[]) => PasswordGenSettings;
  saveSettings: (newSettings: PasswordGenSettings) => void;
}
export default function SettingSelectMultiple({
  label,
  value,
  options,
  update,
  saveSettings,
}: SettingSelectMultipleProps) {
  const updateSelected = (itemValue: string) => {
    const selected = [...value];
    if (selected.includes(itemValue)) {
      selected.splice(selected.indexOf(itemValue), 1);
    } else {
      selected.push(itemValue);
    }
    const newSettings = update(selected);
    saveSettings(newSettings);
  };

  return (
    <View>
      <Text
        style={[settingsStyles.label, { marginBottom: 10, fontWeight: "bold" }]}
      >
        {label}
      </Text>
      {options.map((option) => (
        <View
          key={option.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Text>{option.label}</Text>
          <Switch
            value={value.includes(option.id)}
            onValueChange={(newValue) => {
              updateSelected(option.id);
            }}
          />
        </View>
      ))}
    </View>
  );
}
