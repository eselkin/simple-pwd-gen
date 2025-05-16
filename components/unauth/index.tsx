import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native";

import { View } from "react-native";
import { pageViewStyles } from "../../styles/pageView";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Signin from "./Singin";
import { Ionicons } from "@expo/vector-icons";
import Signup from "./Signup";

type UnauthStackParamList = {
  Signin: undefined;
  Signup: undefined;
};
const Tab = createBottomTabNavigator<UnauthStackParamList>();

export default function Unauthorized() {
  return (
    <>
      <SafeAreaView style={pageViewStyles.container}>
        <NavigationContainer>
          <View style={pageViewStyles.main}>
            <Tab.Navigator initialRouteName="Signin">
              <Tab.Screen
                name="Signin"
                component={Signin}
                options={{
                  tabBarLabel: "Signin",
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person" color={color} size={size} />
                  ),
                }}
              />
              <Tab.Screen
                name="Signup"
                component={Signup}
                options={{
                  tabBarLabel: "Signup",
                  tabBarIcon: ({ color, size }) => (
                    <Ionicons name="person-add" color={color} size={size} />
                  ),
                }}
              />
            </Tab.Navigator>
          </View>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
}
