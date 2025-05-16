import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnEnPackage from "@zxcvbn-ts/language-en";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";

import { PasswordGenSettings } from "../../settings";
import { generatePassphrases } from "./generatePassphrases";
import { generateRandomChar } from "./generateRandomChar";

const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
};
zxcvbnOptions.setOptions(options);

export const generatePasswords = (
  numberOfPasswords: number,
  options: PasswordGenSettings
) => {
  let generatedPasswords: string[] = [];

  if (options.type === "random-words") {
    generatedPasswords = generatePassphrases(numberOfPasswords, options);
  } else {
    generatedPasswords = generateRandomChar(numberOfPasswords, options);
  }
  const updatedWithZxcvbn = generatedPasswords.map((p) => zxcvbn(p));

  return updatedWithZxcvbn;
};
