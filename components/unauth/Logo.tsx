import Svg, { G, Path } from "react-native-svg";
import { View, Text } from "react-native";
import { styles } from "./unauthStyles";

export default function Logo({
  width,
  height,
}: {
  width?: string;
  height?: string;
}) {
  return (
    <View style={styles.logoContainer}>
      <Svg
        width={`${width ? width : "32%"}`}
        height={`${height ? height : "32%"}`}
        viewBox="0 0 64 64"
      >
        <Path fill="#fff" d="M0 0h64v64H0z" />
        <G fill="#e44">
          <Path d="M20 28c-2.2 0-4 1.8-4 4v18c0 2.2 1.8 4 4 4h24c2.2 0 4-1.8 4-4V32c0-2.2-1.8-4-4-4H20zm12 10c1.7 0 3 1.3 3 3 0 1.1-.6 2-1.5 2.6V46h-3v-2.4c-.9-.5-1.5-1.5-1.5-2.6 0-1.7 1.3-3 3-3zM32 10c-6.6 0-12 5.4-12 12v6h4v-6c0-4.4 3.6-8 8-8s8 3.6 8 8v6h4v-6c0-6.6-5.4-12-12-12z" />
        </G>
      </Svg>
      <Text style={styles.logoText}>Simple Password Generator</Text>
    </View>
  );
}
