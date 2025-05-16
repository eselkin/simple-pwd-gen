import {
  View,
  ScrollView,
  TextInput,
  Button,
  SafeAreaView,
  Keyboard,
  Text,
} from "react-native";
import { baseStyles } from "../../styles/baseView";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { styles } from "./unauthStyles";
import Logo from "./Logo";
import Toast from "react-native-toast-message";
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={baseStyles.container}>
      <Logo />
      <View style={styles.innerContainer}>
        <ScrollView>
          <Text style={{ fontSize: 18, paddingHorizontal: 20 }}>
            Signup as a new user
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              id="email"
              value={email}
              keyboardType="email-address"
              onChangeText={(t) => setEmail(t)}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              id="password"
              onChangeText={(t) => setPassword(t)}
              value={password}
              secureTextEntry={true}
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              keyboardType="visible-password"
              returnKeyType="done"
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
            />
            {!!email && !!password && (
              <Button
                title="Signup"
                testID="signup"
                disabled={loading}
                onPress={() => {
                  setLoading(true);
                  createUserWithEmailAndPassword(getAuth(), email, password)
                    .then((success) => {
                      setLoading(false);
                    })
                    .catch((e) => {
                      if (e.code === "auth/email-already-in-use") {
                        setLoading(false);
                        Toast.show({
                          type: "error",
                          text1: "Email already in use",
                          bottomOffset: 100,
                          position: "bottom",
                        });
                      } else {
                        setLoading(false);
                        Toast.show({
                          type: "error",
                          text1: e.message,
                          bottomOffset: 100,
                          position: "bottom",
                        });
                      }
                    });
                }}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
