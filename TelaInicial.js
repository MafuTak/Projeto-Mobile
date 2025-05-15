import { Button, StyleSheet, Text, View } from 'react-native';

export default function TelaInicial({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-Vindo!</Text>

            <Button
                title="Adicionar Aluno"
                onPress={() => navigation.navigate('Adicionar Aluno')}
            />

            <Button
                title="Ver Alunos"
                onPress={() => navigation.navigate('Criar Ficha')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        marginBottom: 30,
        fontWeight: 'bold'
    },
});