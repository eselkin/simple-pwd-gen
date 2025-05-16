import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { dictionaryNames, PasswordGenSettings } from "../../settings";
import { baseStyles } from "../../styles/baseView";
import { SettingItemToggle } from "./SettingItemToggle";
import { SettingItemNumber } from "./SettingItemNumber";
import { SettingItemText } from "./SettingItemText";
import { SettingView } from "./SettingView";
import { useSettingsStore, useUserStore } from "../../zustand";
import SettingSelectMultiple from "./SettingSelectMultiple";
import firestore from "@react-native-firebase/firestore";
import { useCallback, useRef } from "react";
import Toast from "react-native-toast-message";
import { getCrashlytics, log } from "@react-native-firebase/crashlytics";
import { useScrollToTop } from "@react-navigation/native";

export const Settings = () => {
  const { user } = useUserStore();
  const { updateSettings, updateSetting, ...settings } = useSettingsStore();
  const ref = useRef<ScrollView>(null);
  useScrollToTop(ref);

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
          .then(() => {
            Toast.show({
              text1: `Settings updated`,
              type: "success",
              position: "bottom",
              bottomOffset: 100,
              avoidKeyboard: false,
            });
          })
          .catch((e) =>
            log(getCrashlytics(), `could not update doc for user ${user.uid}`)
          );
      } else {
        doc
          .set({ ...settingsToSave })
          .then(() => {
            Toast.show({
              text1: `Settings created`,
              type: "success",
              position: "bottom",
              bottomOffset: 100,
              avoidKeyboard: false,
            });
          })
          .catch((e) =>
            log(getCrashlytics(), `could not create doc for user ${user.uid}`)
          );
      }
    },
    [user]
  );
  if (!settings) {
    return <Text>No settings found</Text>;
  }

  return (
    <View style={baseStyles.container}>
      <View style={styles.container}>
        <ScrollView
          ref={ref}
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets={true}
          style={{ padding: 10, paddingBottom: 100 }}
        >
          <Text
            style={{
              fontSize: 14,
              paddingTop: 8,
              paddingHorizontal: 8,
            }}
          >
            Logged in as {user?.email}
          </Text>
          <Text
            style={{
              fontSize: 14,
              paddingTop: 6,
              paddingBottom: 8,
              paddingHorizontal: 8,
            }}
          >
            {settings.numberOfPasswordsGenerated} passwords generated
          </Text>
          <SettingView>
            <SettingItemToggle
              label={
                settings.type === "random-password"
                  ? "Random Characters"
                  : "Random Words"
              }
              name="password-type"
              value={settings.type === "random-password"}
              update={(newValue) =>
                updateSetting("type")(
                  newValue ? "random-password" : "random-words"
                )
              }
              saveSettings={saveSettings}
            />
          </SettingView>
          <SettingView show={settings.type === "random-password"}>
            <SettingItemNumber
              label="Min Length"
              value={settings.minLength}
              update={(newValue) => updateSetting("minLength")(newValue)}
              saveSettings={saveSettings}
              name="min-length"
              min={1}
              max={100}
            />
          </SettingView>
          <SettingView show={settings.type === "random-password"}>
            <SettingItemNumber
              label="Max Length"
              value={settings.maxLength}
              update={(newValue) => updateSetting("maxLength")(newValue)}
              saveSettings={saveSettings}
              name="max-length"
              min={1}
              max={101}
            />
          </SettingView>
          <SettingView show={settings.type === "random-words"}>
            <SettingItemNumber
              label="Min Words"
              value={settings.minWords}
              update={(newValue) => updateSetting("minWords")(newValue)}
              saveSettings={saveSettings}
              name="min-words"
              min={1}
              max={settings.maxWords ?? 50}
            />
          </SettingView>
          <SettingView show={settings.type === "random-words"}>
            <SettingItemNumber
              label="Max Words"
              value={settings.maxWords}
              update={(newValue) => updateSetting("maxWords")(newValue)}
              saveSettings={saveSettings}
              name="max-words"
              min={settings.minWords ?? 1}
              max={51}
            />
          </SettingView>
          <SettingView show={settings.type === "random-password"}>
            <SettingItemNumber
              label="# Uppercase"
              value={settings.uppercase}
              update={(newValue) => updateSetting("uppercase")(newValue)}
              saveSettings={saveSettings}
              name="uppercase"
              min={0}
              max={20}
            />
          </SettingView>
          <SettingView show={settings.type === "random-password"}>
            <SettingItemNumber
              label="# Lowercase"
              value={settings.lowercase}
              update={(newValue) => updateSetting("lowercase")(newValue)}
              saveSettings={saveSettings}
              name="lowercase"
              min={0}
              max={
                (settings.maxLength ?? 101) -
                (settings.uppercase ??
                  0 + settings.special ??
                  0 + settings.numbers ??
                  0)
              }
            />
          </SettingView>
          <SettingView show={settings.type === "random-password"}>
            <SettingItemNumber
              label="# Numbers"
              value={settings.numbers ?? 0}
              update={(newValue) => updateSetting("numbers")(newValue)}
              saveSettings={saveSettings}
            />
          </SettingView>
          <SettingView show={settings.type === "random-password"}>
            <SettingItemNumber
              label="# Special"
              value={settings.special ?? 0}
              update={(newValue) => updateSetting("special")(newValue)}
              saveSettings={saveSettings}
            />
          </SettingView>
          <SettingView show={settings.type === "random-password"}>
            <SettingItemText
              label="Special Characters"
              value={settings.specialCharacters ?? ""}
              update={(newValue) =>
                updateSetting("specialCharacters")(newValue)
              }
              saveSettings={saveSettings}
            />
          </SettingView>
          <SettingView>
            <SettingItemToggle
              label="Use Separator"
              value={settings.useSeparator ?? false}
              update={(newValue) => updateSetting("useSeparator")(newValue)}
              saveSettings={saveSettings}
            />
          </SettingView>
          <SettingView show={settings.useSeparator ?? false}>
            <SettingItemText
              label="Separator character"
              value={settings.separator ?? ""}
              maxLength={1}
              update={(newValue) => updateSetting("separator")(newValue)}
              saveSettings={saveSettings}
            />
          </SettingView>
          <SettingView
            show={
              settings.type === "random-password" &&
              (settings.useSeparator ?? false) &&
              !!settings.separator
            }
          >
            <SettingItemNumber
              label="Separator Every N Characters"
              value={settings.sepEveryNCharacters ?? 0}
              update={(newValue) =>
                updateSetting("sepEveryNCharacters")(newValue)
              }
              saveSettings={saveSettings}
            />
          </SettingView>
          <SettingView
            show={settings.type === "random-words" && settings.useSeparator}
          >
            <SettingItemNumber
              label="Separator Every N Words"
              value={settings.sepEveryNWords ?? 0}
              update={(newValue) => updateSetting("sepEveryNWords")(newValue)}
              saveSettings={saveSettings}
            />
          </SettingView>
          <SettingView show={settings.type === "random-password"}>
            <SettingItemToggle
              label="Exclude Similar Characters"
              value={settings.excludeSimilarCharacters ?? false}
              update={(newValue) =>
                updateSetting("excludeSimilarCharacters")(newValue)
              }
              saveSettings={saveSettings}
            />
          </SettingView>
          <SettingView
            show={
              (settings.type === "random-password" &&
                settings.excludeSimilarCharacters) ??
              false
            }
          >
            <SettingItemText
              label="Similar Characters"
              value={settings.similarCharacters ?? ""}
              update={(newValue) =>
                updateSetting("similarCharacters")(newValue)
              }
              saveSettings={saveSettings}
            />
          </SettingView>
          <SettingView>
            <SettingSelectMultiple
              label="Dictionaries"
              value={settings.languages ?? []}
              options={dictionaryNames}
              update={(newValue) => updateSetting("languages")(newValue)}
              saveSettings={saveSettings}
            />
          </SettingView>
          <SettingView>
            <SettingItemToggle
              label="Reset Passwords After Generation"
              value={settings.shouldResetPasswords ?? true}
              update={(newValue) =>
                updateSetting("shouldResetPasswords")(newValue)
              }
              saveSettings={saveSettings}
            />
          </SettingView>
          <SettingView show={settings.shouldResetPasswords}>
            <SettingItemNumber
              label="Clear passwords after (seconds)"
              value={settings.timeoutToClearPasswords}
              update={(newValue) =>
                updateSetting("timeoutToClearPasswords")(newValue)
              }
              saveSettings={saveSettings}
              name="timeout-to-clear"
            />
          </SettingView>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    width: "100%",
  },
});
