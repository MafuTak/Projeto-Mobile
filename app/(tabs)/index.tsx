import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import * as SplashScreen from 'expo-splash-screen'; // Importando o SplashScreen

import logoImg from '@/assets/images/icon.png';

export default function HomeScreen() {
  const router = useRouter();

  // Carregar as fontes
  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
  });

  // Prevenir o auto-hide da tela de splash enquanto as fontes são carregadas
  useEffect(() => {
    SplashScreen.preventAutoHideAsync(); // Impede que a splash screen desapareça automaticamente

    // Após as fontes carregadas, podemos esconder a splash screen
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Esconde a splash screen
    }
  }, [fontsLoaded]);

  // Se as fontes não foram carregadas, não renderize nada
  if (!fontsLoaded) {
    return null; // Ou você pode retornar um componente personalizado de carregamento se quiser
  }

  return (
    <View style={styles.container}>
      <Image source={logoImg} style={styles.logo} resizeMode="contain" />

      <Text style={styles.welcomeText}>
        Seja Bem-Vindo <Text style={styles.highlight}>Personal Trainer!</Text>
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Cadastrar Aluno"
          color="#007AFF"
          onPress={() => router.push('/(tabs)/AlunosCadastro')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Ver Alunos"
          color="#34C759"
          onPress={() => router.push('/(tabs)/ListaAlunos')}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Cadastrar Exercícios"
          color="#FF9500"
          onPress={() => router.push('/(tabs)/CriarSerieScreen')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#fff',
  },
  highlight: {
    fontFamily: 'Pacifico_400Regular',
    fontSize: 28,
    color: '#0487E6',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
