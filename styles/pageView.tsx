import { StyleSheet } from "react-native";

export const pageViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  nav: {
    flex: 1,
    width: "100%",
    backgroundColor: "red",
  },
  main: {
    flex: 10,
    width: "100%",
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
