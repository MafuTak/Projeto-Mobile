import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaInicial from './screens/TelaInicial';
import CreateWorkoutScreen from './screens/CriarFicha';
import StudentsScreen from './screens/StudentsScreen';
import AddStudentScreen from './screens/AddStudentScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Início">
                <Stack.Screen name="Início" component={TelaInicial} />
                <Stack.Screen name="Criar Ficha" component={CriarFicha} />
                <Stack.Screen name="Alunos" component={StudentsScreen} />
                <Stack.Screen name="Adicionar Aluno" component={AddStudentScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

