import { StatusBar } from "expo-status-bar";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Suspense, useEffect, useState } from "react";
import {
  FirebaseAuthTypes,
  getAuth,
  signOut,
} from "@react-native-firebase/auth";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import Signin from "./components/auth/Singin";
import firestore from "@react-native-firebase/firestore";
import { Settings } from "./components/settings/Settings";
import { NavigationContainer } from "@react-navigation/native";
import { type PasswordGenSettings } from "./settings";
import { defaultSettings, fromFirebaseSettings } from "./settings";
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
  BottomTabBarProps,
  BottomTabBarButtonProps,
} from "@react-navigation/bottom-tabs";
import Nav from "./components/nav";
import { useSettingsStore, useUserStore } from "./zustand";
import { SafeAreaView } from "react-native-safe-area-context";
import Generate from "./components/generate";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

// @ts-ignore
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

type RootStackParamList = {
  Generate: undefined;
  Settings: undefined;
};
const Tab = createBottomTabNavigator<RootStackParamList>();

export type BottomTabProps = BottomTabScreenProps<RootStackParamList>;

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const { user, setUser } = useUserStore();
  const { updateSettings, updateSetting } = useSettingsStore();
  // Handle user state changes
  function handleAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (!user) {
      setInitializing(false);
      return;
    }
    firestore()
      .collection("infoandsettings")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc?.exists()) {
          if (doc.data()) {
            console.log("doc.data()", doc.data());
            updateSettings(
              fromFirebaseSettings(doc.data() as PasswordGenSettings)
            );
            return;
          }
        }
        updateSettings(defaultSettings);
      })
      .catch((e) => console.error(e));
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  if (!user) {
    return <Signin />;
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          <View style={styles.main}>
            <Tab.Navigator initialRouteName="Generate">
              <Tab.Screen
                name="Generate"
                component={Generate}
                options={{
                  tabBarLabel: "Generate",
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="key" color={color} size={size} />
                  ),
                  tabBarLabelStyle: styles.tabBarLabel,
                }}
              />
              <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                  tabBarLabel: "Settings",
                  tabBarLabelStyle: styles.tabBarLabel,
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons
                      name="settings"
                      testID="settings"
                      color={color}
                      size={size}
                    />
                  ),
                  headerRight: (props) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          signOut(getAuth());
                        }}
                        style={{
                          marginRight: 10,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ marginRight: 5, color: "red" }}>
                          Sign Out
                        </Text>
                        <Ionicons
                          name="log-out-outline"
                          testID="logout"
                          color="red"
                          size={24}
                        />
                      </TouchableOpacity>
                    );
                  },
                }}
              />
            </Tab.Navigator>
          </View>
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaView>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
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
