import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  inputContainer: {
    flexDirection: "column",
    flex: 1,
    gap: 20,
    padding: 20,
  },
  textInput: {
    width: "100%",
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
