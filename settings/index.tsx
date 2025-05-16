export type PasswordGenSettings = {
  minLength: number;
  maxLength: number;
  minWords: number;
  maxWords: number;
  type: "random-password" | "random-words";
  uppercase: number;
  lowercase: number;
  numbers: number;
  special: number;
  specialCharacters?: string;
  excludeCharacters?: boolean;
  excludedCharacters?: string;
  excludeSimilarCharacters?: boolean;
  similarCharacters?: string;
  separator?: string;
  sepEveryNWords?: number;
  sepEveryNCharacters?: number;
  languages?: string[];
  useSeparator?: boolean;
  numberOfPasswordsGenerated?: number;
  timeoutToClearPasswords?: number;
  shouldResetPasswords?: boolean;
};

export const defaultSettings: PasswordGenSettings = {
  minLength: 10,
  maxLength: 10,
  minWords: 1,
  maxWords: 1,
  type: "random-password",
  uppercase: 1,
  lowercase: 1,
  numbers: 1,
  sepEveryNCharacters: 6,
  sepEveryNWords: 1,
  special: 1,
  separator: "-",
  specialCharacters: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  similarCharacters: "il1Lo0O5S",
  excludeSimilarCharacters: true,
  excludedCharacters: "",
  excludeCharacters: false,
  languages: ["en"],
  useSeparator: true,
  numberOfPasswordsGenerated: 0,
  timeoutToClearPasswords: 40,
  shouldResetPasswords: true,
};

export const fromFirebaseSettings = (settings: PasswordGenSettings) => {
  return {
    ...defaultSettings,
    ...settings,
  };
};

export const dictionaryNames = [
  {
    label: "English",
    id: "en",
  },
  {
    label: "Spanish",
    id: "es",
  },
];
