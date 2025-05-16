import { Ionicons } from "@expo/vector-icons";
import { ZxcvbnResult } from "@zxcvbn-ts/core";
import { View, Text, TouchableOpacity } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import Clipboard from "@react-native-clipboard/clipboard";
import { PasswordFeedback } from "./PasswordFeedback";
export default function PasswordDisplay({
  item,
  timeout,
}: {
  item: ZxcvbnResult;
  timeout: NodeJS.Timeout | null;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text>{item.password}</Text>
      <PasswordFeedback
        warning={item.feedback.warning}
        suggestions={item.feedback.suggestions}
      />
      <View style={{ flexDirection: "row" }}>
        {Array.from({ length: item.score }, (_, index) => (
          <Ionicons
            key={`star-${index}-${item.password}`}
            name="star"
            size={16}
            color="gold"
          />
        ))}
      </View>
      <Text>
        Time to crack: {item.crackTimesDisplay.offlineFastHashing1e10PerSecond}
      </Text>
      <TouchableOpacity
        onPress={() => {
          if (timeout) clearTimeout(timeout);
          Clipboard.setString(item.password);
          Toast.show({
            type: "success",
            text1: "Copied to clipboard",
            position: "bottom",
            bottomOffset: 100,
          });
        }}
      >
        <Ionicons name="copy" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
