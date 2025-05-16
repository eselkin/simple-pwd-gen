import { PasswordGenSettings } from "../../settings";
import { generatePassphrases } from "./generatePassphrases";
export const generatePasswords = (
  numberOfPasswords: number,
  options: PasswordGenSettings
) => {
  if (options.type === "random-words") {
    return generatePassphrases(numberOfPasswords, options);
  }
  return Array.from({ length: numberOfPasswords }, () =>
    Math.random().toString(36).substring(2, 15)
  );
};
