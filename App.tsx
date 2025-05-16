import { StatusBar } from "expo-status-bar";
import { Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import {
  FirebaseAuthTypes,
  getAuth,
  signOut,
} from "@react-native-firebase/auth";
import { onAuthStateChanged } from "@react-native-firebase/auth";
import { getApp } from "@react-native-firebase/app";
import { ReactNativeFirebaseAppCheckProvider } from "@react-native-firebase/app-check";
import { initializeAppCheck } from "@react-native-firebase/app-check";
import firestore from "@react-native-firebase/firestore";
import { Settings } from "./components/settings";
import { NavigationContainer } from "@react-navigation/native";
import { type PasswordGenSettings } from "./settings";
import { defaultSettings, fromFirebaseSettings } from "./settings";
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import { useAppCheckStore, useSettingsStore, useUserStore } from "./zustand";
import { SafeAreaView } from "react-native-safe-area-context";
import Generate from "./components/generate";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { pageViewStyles } from "./styles/pageView";
import Unauthorized from "./components/unauth";
import Logo from "./components/unauth/Logo";
import { getCrashlytics, log } from "@react-native-firebase/crashlytics";

// @ts-ignore
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

const rnfbProvider = new ReactNativeFirebaseAppCheckProvider();
rnfbProvider.configure({
  apple: {
    provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback",
    debugToken: "71406E95-D73C-4D52-8D96-21EE684C2DF6",
  },
});

const appCheck = initializeAppCheck(getApp(), {
  provider: rnfbProvider,
  isTokenAutoRefreshEnabled: true,
});

type RootStackParamList = {
  Generate: undefined;
  Settings: undefined;
};
const Tab = createBottomTabNavigator<RootStackParamList>();

export type BottomTabProps = BottomTabScreenProps<RootStackParamList>;

export default function App() {
  const { setAppCheckToken } = useAppCheckStore();
  useEffect(() => {
    (async () => {
      try {
        // `appCheckInstance` is the saved return value from initializeAppCheck
        const { token } = await (await appCheck).getToken(true);
        if (token.length > 0) {
          setAppCheckToken(token);
        }
      } catch (error) {
        log(getCrashlytics(), "AppCheck verification failed");
        throw error;
      }
    })();
  }, []);

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
    return (
      <>
        <Unauthorized />
        <Toast />
      </>
    );
  }

  return (
    <>
      <SafeAreaView style={pageViewStyles.container}>
        <NavigationContainer>
          <View style={pageViewStyles.main}>
            <Tab.Navigator initialRouteName="Generate">
              <Tab.Screen
                name="Generate"
                component={Generate}
                options={{
                  headerLeft: () => <Logo width="32" height="32" />,
                  title: "Generate Passwords",
                  tabBarLabel: "Generate",
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="key" color={color} size={size} />
                  ),
                  tabBarLabelStyle: pageViewStyles.tabBarLabel,
                }}
              />
              <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                  tabBarLabel: "Settings",
                  tabBarLabelStyle: pageViewStyles.tabBarLabel,
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
