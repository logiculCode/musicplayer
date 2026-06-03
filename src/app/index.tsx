import { Redirect } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <Redirect href={'/pages/musicpage'}/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
