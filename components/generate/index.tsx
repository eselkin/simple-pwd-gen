import {
  View,
  Text,
  TextInput,
  Button,
  Keyboard,
  FlatList,
} from "react-native";

import { useCallback, useState } from "react";
import { settingsStyles } from "../settings/settingsStyles";
import { generatePasswords } from "./generatePasswords";
import { useSettingsStore } from "../../zustand";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Clipboard from "@react-native-clipboard/clipboard";

export default function Generate() {
  const [numberOfPasswords, setNumberOfPasswords] = useState(1);
  const { updateSetting, updateSettings, ...settings } = useSettingsStore();
  const [passwords, setPasswords] = useState<string[]>([]);
  const generate = useCallback(() => {
    console.log("Generate", numberOfPasswords, settings);
    const passwords = generatePasswords(numberOfPasswords, settings);
    console.log("Passwords", passwords);
    setPasswords(passwords);
  }, [numberOfPasswords, settings]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "stretch",
        padding: 16,
      }}
    >
      <View style={settingsStyles.container}>
        <Text style={settingsStyles.label}>
          Number of passwords to generate
        </Text>
        <TextInput
          value={numberOfPasswords.toString()}
          onChangeText={(text) => setNumberOfPasswords(parseInt(text))}
          keyboardType="numeric"
          style={[settingsStyles.input, settingsStyles.textInput]}
          testID="numberOfPasswords"
          returnKeyLabel="done"
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          returnKeyType="done"
        />
      </View>
      <Button title="Generate" onPress={generate} />
      <FlatList
        data={passwords}
        renderItem={({ item }) => (
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 12 }}>{item}</Text>
            <Button
              title="Copy"
              onPress={() => {
                Clipboard.setString(item);
                Toast.show({
                  type: "success",
                  text1: "Copied to clipboard",
                });
              }}
            />
          </View>
        )}
        keyExtractor={(item) => item}
        style={{ flex: 1, padding: 16 }}
      />
    </View>
  );
}
