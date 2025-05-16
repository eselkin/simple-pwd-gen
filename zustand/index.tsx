import { create } from "zustand";
import { defaultSettings, PasswordGenSettings } from "../settings";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { omit } from "lodash-es";

export type SettingsStore = PasswordGenSettings & {
  updateSettings: (settings: PasswordGenSettings) => void;
  updateSetting: (
    setting: keyof PasswordGenSettings
  ) => (
    value: string | number | boolean | undefined | string[]
  ) => PasswordGenSettings;
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...defaultSettings,
  updateSettings: (settings: PasswordGenSettings) => set({ ...settings }),
  updateSetting:
    (setting: keyof PasswordGenSettings) =>
    (value: string | number | boolean | undefined | string[]) => {
      const currentSettings = omit(get(), [
        "updateSettings",
        "updateSetting",
      ]) as Record<string, string | number | boolean | undefined | string[]>;
      if (setting.startsWith("min") && value && typeof value === "number") {
        const correspondingMaxSetting = setting.replace("min", "max");
        if (
          value &&
          typeof value === "number" &&
          value > (currentSettings[correspondingMaxSetting] as number)
        ) {
          currentSettings[correspondingMaxSetting] = value;
        }
      } else if (
        setting.startsWith("max") &&
        value &&
        typeof value === "number"
      ) {
        const correspondingMinSetting = setting.replace("max", "min");
        if (value < (get() as any)[correspondingMinSetting]) {
          currentSettings[correspondingMinSetting] = value;
        }
      }
      currentSettings[setting] = value;
      set(currentSettings);
      return currentSettings as PasswordGenSettings;
    },
}));

export type UserStore = {
  user: FirebaseAuthTypes.User | null;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: FirebaseAuthTypes.User | null) => set({ user }),
}));

export type AppCheckStore = {
  appCheckToken: string | null;
  setAppCheckToken: (appCheckToken: string | null) => void;
};

export const useAppCheckStore = create<AppCheckStore>((set) => ({
  appCheckToken: null,
  setAppCheckToken: (appCheckToken: string | null) => set({ appCheckToken }),
}));
