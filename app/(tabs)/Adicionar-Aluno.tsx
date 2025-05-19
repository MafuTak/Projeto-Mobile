import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useAluno } from './aluno-context';

export default function AdicionarAluno () {
    const router = useRouter();
    const { adicionarAluno } = useAluno();
    
    const [nome, setNome,] = useState('');
    const [idade, setIdade] = useState('');
    const [objetivo, setObjetivo ] = useState('');
    const [experiencia, setExperiencia] = useState('');
    const [observacao, setObservacao] = useState('');

    function handleSalvarAluno() {
        if (nome.trim() === '' || idade.trim() === '') {
            Alert.alert('Atenção!', 'Preencha os campos obrigatórios!');
            return;
        }

        const novoAluno = {
            id: uuidv4(),
            nome,
            idade,
            objetivo,
            experiencia,
            observacao,
        };

        adicionarAluno(novoAluno);
        router.push('/Alunos');
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Adicionar Aluno</Text>

            <TextInput 
                placeholder="Nome" 
                value={nome}
                onChangeText={setNome} 
                style={styles.input}
            />
                
            <TextInput 
                placeholder="Idade" 
                value={idade}
                onChangeText={setIdade}
                keyboardType="numeric"
                style={styles.input}
            />

            <Text style={styles.label}>Objetivo:</Text>
            <Picker 
                selectedValue={objetivo} 
                onValueChange={(itemValue) => setObjetivo(itemValue)}
                style={styles.picker}
                >
                <Picker.Item label="Selecione o Objetivo" value="" />
                <Picker.Item label="Emagrecimento" value="emagrecimento" />
                <Picker.Item label="Hipertrofia" value="hipertrofia" />
                <Picker.Item label="Resistência" value="resistencia" />
                <Picker.Item label="Condicionamento Físico" value="condicionamento" />
                <Picker.Item label="Qualidade de Vida" value="qualidade" />
            </Picker>

            <Text style={styles.label}>Experiência:</Text>
            <Picker 
                selectedValue={experiencia} 
                onValueChange={(itemValue) => setExperiencia(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Nível de Experiencia" value="" />
                <Picker.Item label="Iniciante" value="Iniciante" />
                <Picker.Item label="Intermediário" value="Intermediário" />
                <Picker.Item label="Avançado" value="Avançado" />
            </Picker>

            <TextInput 
                placeholder="Observações"
                value={observacao}
                onChangeText={setObservacao}
                multiline
                numberOfLines={4}
                style={styles.textarea}
            />

            <Button title="Salvar" onPress={handleSalvarAluno} />

        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  label: {
    marginTop: 8,
    marginBottom: -6,
  },
  textarea: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 6,
  padding: 10,
  textAlignVertical: 'top',
},
});
