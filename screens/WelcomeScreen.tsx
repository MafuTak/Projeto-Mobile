import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation/types";

export default function WelcomeScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#000" : "#fff" }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
        Bem-vindo ao Fitness App!
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isDark ? "#fff" : "#000" }]}
        onPress={() => navigation.navigate("Avaliacao")}
      >
        <Text style={{ color: isDark ? "#000" : "#fff", fontSize: 18 }}>Começar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
  },
});
