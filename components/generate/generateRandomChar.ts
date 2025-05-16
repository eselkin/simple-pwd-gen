import { PasswordGenSettings } from "../../settings";
import dictionaries from "../../dictionaries.json";
import { randIntBetween } from "./randBetween";
import { shuffle } from "lodash-es";

export const generateRandomChar = (
  numberOfPasswords: number,
  options: PasswordGenSettings
) => {
  // Get all unique characters from selected languages
  const allChars = new Set<string>();
  options.languages?.forEach((lang) => {
    const alphabet =
      dictionaries[lang as keyof typeof dictionaries]?.alphabet || "";
    alphabet.split("").forEach((char) => allChars.add(char));
  });

  if (options.excludeCharacters && options.excludedCharacters) {
    options.excludedCharacters.split("").forEach((char) => {
      allChars.delete(char);
    });
  }
  if (options.excludeSimilarCharacters) {
    options.similarCharacters?.split("").forEach((char) => {
      allChars.delete(char);
    });
  }

  // Calculate required length based on character requirements
  const requiredLength =
    (options.uppercase || 0) +
    (options.lowercase || 0) +
    (options.numbers || 0) +
    (options.special || 0);

  // Use max of required length and minLength
  const minLength = Math.max(requiredLength, options.minLength || 0);
  const maxLength = options.maxLength || minLength;

  return Array.from({ length: numberOfPasswords }, () => {
    const length = randIntBetween(minLength, maxLength);
    let password: string[] = [];

    // Add required characters first
    if (options.uppercase) {
      // need to do this because not ascii characters
      const upperChars = Array.from(allChars).filter(
        (c) => c === c.toUpperCase()
      );
      for (let i = 0; i < options.uppercase; i++) {
        password.push(
          upperChars[Math.floor(Math.random() * upperChars.length)]
        );
      }
    }

    if (options.lowercase) {
      // need to do this because not ascii characters
      const lowerChars = Array.from(allChars).filter(
        (c) => c === c.toLowerCase()
      );
      for (let i = 0; i < options.lowercase; i++) {
        password.push(
          lowerChars[Math.floor(Math.random() * lowerChars.length)]
        );
      }
    }

    if (options.numbers) {
      const numChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      for (let i = 0; i < options.numbers; i++) {
        password.push(numChars[Math.floor(Math.random() * numChars.length)]);
      }
    }

    if (options.special && options.specialCharacters) {
      const specialChars = options.specialCharacters.split("");
      for (let i = 0; i < options.special; i++) {
        password.push(
          specialChars[Math.floor(Math.random() * specialChars.length)]
        );
      }
    }

    // Fill remaining length with random characters
    const remainingLength = length - password.length;

    const allCharsArray = Array.from(allChars);
    for (let i = 0; i < remainingLength; i++) {
      password.push(
        allCharsArray[Math.floor(Math.random() * allCharsArray.length)]
      );
    }

    // Shuffle the password
    password = shuffle(password);
    if (
      options.useSeparator &&
      options.sepEveryNCharacters &&
      options.sepEveryNCharacters > 0 &&
      options.separator
    ) {
      const passwordLength = password.length;
      for (
        let i = options.sepEveryNCharacters;
        i < passwordLength;
        i += options.sepEveryNCharacters
      ) {
        password.splice(i, 0, options.separator);
      }
    }
    return password.join("");
  });
};
