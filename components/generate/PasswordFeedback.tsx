import { View, Text, FlatList } from "react-native";

export const PasswordFeedback = ({
  warning,
  suggestions,
}: {
  warning: string | null;
  suggestions: string[];
}) => {
  if (!warning && !suggestions.length) {
    return null;
  }
  return (
    <View
      style={{
        marginBottom: 8,
        padding: 16,
        borderRadius: 8,
        backgroundColor: "yellow",
      }}
    >
      {!!warning && (
        <>
          <Text style={{ fontWeight: "bold" }}>Warning:</Text>
          <Text>{warning}</Text>
        </>
      )}
      {suggestions.length ? (
        <>
          <Text style={{ fontWeight: "bold" }}>Suggestions:</Text>
          <FlatList
            data={suggestions}
            renderItem={({ item }) => <Text>{item}</Text>}
          />
        </>
      ) : (
        <Text>No suggestions</Text>
      )}
    </View>
  );
};
