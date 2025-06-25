import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import Colors from '@/constants/Colors';
import { AlunosProvider } from '@/context/AlunosContext';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AlunosProvider>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: useClientOnlyValue(false, true),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="AlunosCadastro"
          options={{
            title: 'Cadastro',
            tabBarIcon: ({ color }) => <TabBarIcon name="user-plus" color={color} />,
          }}
        />
        <Tabs.Screen
          name="AvaliacaoScreen"
          options={{
            title: 'Avaliação',
            tabBarIcon: ({ color }) => <TabBarIcon name="clipboard" color={color} />,
          }}
        />
        <Tabs.Screen
          name="ListaAlunos"
          options={{
            title: 'Alunos',
            tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
          }}
        />
        <Tabs.Screen
          name="CriarSerieScreen"
          options={{
            title: 'Criar Série',
            tabBarIcon: ({ color }) => <TabBarIcon name="plus-square" color={color} />,
          }}
        />
        <Tabs.Screen
          name="VerSerieScreen"
          options={{
            title: 'Ver Séries',
            tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
          }}
        />
      </Tabs>
    </AlunosProvider>
  );
}
