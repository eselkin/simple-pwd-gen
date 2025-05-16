import { StyleSheet } from "react-native";

export const settingsStyles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    flex: 1,
    width: 100,
    paddingVertical: 8,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    maxWidth: 200,
  },
  textInput: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },
});
