import { PasswordGenSettings } from "../../settings";
import dictionaries from "../../dictionaries.json";
import { randIntBetween } from "./randBetween";
import Toast from "react-native-toast-message";

export const generatePassphrases = (
  numberOfPassphrases: number,
  options: PasswordGenSettings
) => {
  if (!options.languages) {
    Toast.show({
      type: "error",
      text1: "No languages selected",
    });
    return [];
  }
  const dictionaryWords = options.languages.reduce((acc, lang: string) => {
    const words = dictionaries[lang as keyof typeof dictionaries].words;
    return [...acc, ...words];
  }, [] as string[]);
  const passphrases = Array.from({ length: numberOfPassphrases }, () => {
    const length = randIntBetween(options.minWords, options.maxWords);
    const setWords = Array.from(
      { length },
      () => dictionaryWords[randIntBetween(0, dictionaryWords.length - 1)]
    );
    const passphrase = [];
    if (options.useSeparator && options.separator) {
      if ((options.sepEveryNWords || 0) > 1) {
        for (let i = 0; i < setWords.length; i++) {
          passphrase.push(setWords[i]);
          if ((i + 1) % options.sepEveryNWords! === 0) {
            passphrase.push(options.separator);
          }
        }
        return passphrase.join("");
      }
      return setWords.join(options.separator);
    }
    return setWords.join("");
  });
  return passphrases;
};
