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
    console.log("length", length);
    const setWords = Array.from(
      { length },
      () => dictionaryWords[randIntBetween(0, dictionaryWords.length - 1)]
    );
    if (options.useSeparator && options.separator) {
      if ((options.sepEveryNWords || 0) > 1) {
        for (
          let i = options.sepEveryNWords!;
          i < setWords.length;
          i += options.sepEveryNWords!
        ) {
          setWords.splice(i, 0, options.separator);
        }
        return setWords.join("");
      }
      return setWords.join(options.separator);
    }
    return setWords.join("");
  });
  return passphrases;
};
