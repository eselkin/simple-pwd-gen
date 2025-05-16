import {
  View,
  Text,
  TextInput,
  Button,
  Keyboard,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { useCallback, useState } from "react";
import { settingsStyles } from "../settings/settingsStyles";
import { generatePasswords } from "./generatePasswords";
import { useSettingsStore, useUserStore } from "../../zustand";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { getCrashlytics, log } from "@react-native-firebase/crashlytics";
import { PasswordGenSettings } from "../../settings";
import firestore from "@react-native-firebase/firestore";
import { ZxcvbnResult } from "@zxcvbn-ts/core";
import PasswordDisplay from "./passwordDisplay";
import { baseStyles } from "../../styles/baseView";

export default function Generate() {
  const [numberOfPasswords, setNumberOfPasswords] = useState<number | null>(1);
  const { updateSetting, updateSettings, ...settings } = useSettingsStore();
  const [passwords, setPasswords] = useState<ZxcvbnResult[]>([]);
  const [passwordTimeout, setPasswordTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const { user } = useUserStore();
  const saveSettings = useCallback(
    async (settingsToSave: PasswordGenSettings) => {
      if (!settingsToSave || !user) {
        return;
      }
      const doc = firestore().collection("infoandsettings").doc(user.uid);
      const exists = (await doc.get()).exists();
      if (exists) {
        doc
          .update({ ...settingsToSave })
          .catch((e) =>
            log(getCrashlytics(), `could not update doc for user ${user.uid}`)
          );
      } else {
        doc
          .set({ ...settingsToSave })
          .catch((e) =>
            log(getCrashlytics(), `could not create doc for user ${user.uid}`)
          );
      }
    },
    [user]
  );
  const generate = useCallback(() => {
    Keyboard.dismiss();
    if (passwordTimeout) clearTimeout(passwordTimeout);
    if (!numberOfPasswords) {
      Toast.show({
        type: "error",
        text1: "Please enter a number of passwords to generate",
        position: "bottom",
        bottomOffset: 100,
      });
      return;
    }
    const passwords = generatePasswords(numberOfPasswords, settings);
    setPasswords(passwords);
    const newSettings = updateSetting("numberOfPasswordsGenerated")(
      (settings.numberOfPasswordsGenerated ?? 0) + passwords.length
    );
    saveSettings(newSettings);
    Toast.show({
      type: "success",
      text1:
        passwords.length > 1 ? "Passwords generated" : "Password generated",
      text2: settings.shouldResetPasswords
        ? `Will be cleared in ${settings.timeoutToClearPasswords ?? 40} seconds`
        : "",
      position: "bottom",
      bottomOffset: 100,
    });
    // clear passwords after timeout
    const timeout = setTimeout(() => {
      if (settings.shouldResetPasswords) {
        setPasswords([]);
      }
    }, (settings.timeoutToClearPasswords ?? 40) * 1000);
    setPasswordTimeout(timeout);
  }, [numberOfPasswords, settings, passwordTimeout]);
  const handleChangeNumberOfPasswords = useCallback((text: string) => {
    const parsed = parseInt(text);
    if (!isNaN(parsed)) {
      setNumberOfPasswords(parsed);
    } else {
      setNumberOfPasswords(null);
    }
  }, []);
  return (
    <View style={[baseStyles.container, { padding: 24 }]}>
      <View style={settingsStyles.container}>
        <Text style={settingsStyles.label}>
          Number of passwords to generate
        </Text>
        <TextInput
          value={numberOfPasswords?.toString() ?? ""}
          onChangeText={handleChangeNumberOfPasswords}
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
      <View style={{ marginVertical: 32 }}>
        <Button
          title="Generate"
          disabled={!numberOfPasswords || numberOfPasswords < 0}
          onPress={generate}
        />
      </View>

      <FlatList
        bounces={false}
        data={passwords}
        renderItem={({ item }) => (
          <PasswordDisplay item={item} timeout={passwordTimeout} />
        )}
        keyExtractor={(item) => item.password}
        style={{ flex: 1, width: "100%" }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1,
              marginBottom: 16,
            }}
          />
        )}
      />
    </View>
  );
}
