import {
  View,
  ScrollView,
  TextInput,
  Button,
  SafeAreaView,
  Keyboard,
} from "react-native";
import { baseStyles } from "../../styles/baseView";
import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { styles } from "./unauthStyles";
import Logo from "./Logo";
import Toast from "react-native-toast-message";
export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={baseStyles.container}>
      <Logo />
      <View style={styles.innerContainer}>
        <ScrollView>
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
                title="Signin"
                testID="signin"
                disabled={loading}
                onPress={() => {
                  setLoading(true);
                  signInWithEmailAndPassword(getAuth(), email, password)
                    .then((success) => {
                      setLoading(false);
                    })
                    .catch((e) => {
                      setLoading(false);
                      Toast.show({
                        type: "error",
                        text1: "Invalid email or password",
                        bottomOffset: 100,
                        position: "bottom",
                      });
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
