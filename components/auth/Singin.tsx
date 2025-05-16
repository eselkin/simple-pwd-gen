import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Keyboard,
} from "react-native";
import { baseStyles } from "../../styles/baseView";
import { useState } from "react";
import {
  getAuth,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <SafeAreaView style={baseStyles.container}>
      <Text style={baseStyles.titleText}>Signin</Text>
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
                      console.error(e);
                      setLoading(false);
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

const styles = StyleSheet.create({
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
});
