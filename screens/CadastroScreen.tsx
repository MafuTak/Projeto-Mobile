import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, FlatList,
  StyleSheet, TouchableOpacity, useColorScheme, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Aluno = {
  id: string;
  nome: string;
  idade: string;
  telefone: string;
  objetivo: string;
  experiencia: string;
  observacoes?: string;
};

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  const isDark = useColorScheme() === 'dark';

  // Carrega os alunos salvos
  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        const dados = await AsyncStorage.getItem('@alunos');
        if (dados) {
          setAlunos(JSON.parse(dados));
        }
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
      }
    };
    carregarAlunos();
  }, []);

  // Salva aluno novo
  const cadastrarAluno = async () => {
    if (!nome || !idade || !telefone || !objetivo || !experiencia) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const novoAluno: Aluno = {
      id: Date.now().toString(),
      nome,
      idade,
      telefone,
      objetivo,
      experiencia,
      observacoes,
    };

    try {
      const novaLista = [...alunos, novoAluno];
      setAlunos(novaLista);
      await AsyncStorage.setItem('@alunos', JSON.stringify(novaLista));

      // Limpar campos
      setNome('');
      setIdade('');
      setTelefone('');
      setObjetivo('');
      setExperiencia('');
      setObservacoes('');

      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      Alert.alert('Erro', 'Não foi possível salvar o aluno.');
    }
  };

  // Remove aluno e salva a nova lista
  const removerAluno = async (id: string) => {
    try {
      const novaLista = alunos.filter((aluno) => aluno.id !== id);
      setAlunos(novaLista);
      await AsyncStorage.setItem('@alunos', JSON.stringify(novaLista));
    } catch (error) {
      console.error('Erro ao remover aluno:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Nome *</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome completo"
        placeholderTextColor="#888"
      />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Idade *</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
        placeholder="Idade"
        placeholderTextColor="#888"
      />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Telefone *</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
        placeholder="(DDD) 99999-9999"
        placeholderTextColor="#888"
      />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Objetivo *</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
        value={objetivo}
        onChangeText={setObjetivo}
        placeholder="Ex: Emagrecimento, Hipertrofia..."
        placeholderTextColor="#888"
      />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Experiência *</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
        value={experiencia}
        onChangeText={setExperiencia}
        placeholder="Ex: Iniciante, Avançado..."
        placeholderTextColor="#888"
      />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Observações (opcional)</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
        value={observacoes}
        onChangeText={setObservacoes}
        placeholder="Problemas físicos, restrições..."
        placeholderTextColor="#888"
      />

      <Button title="Cadastrar Aluno" onPress={cadastrarAluno} />

      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Alunos Cadastrados:</Text>

      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={[styles.bold, { color: isDark ? '#fff' : '#000' }]}>{item.nome}</Text>
            <Text style={{ color: isDark ? '#ccc' : '#333' }}>Idade: {item.idade}</Text>
            <Text style={{ color: isDark ? '#ccc' : '#333' }}>Tel: {item.telefone}</Text>
            <Text style={{ color: isDark ? '#ccc' : '#333' }}>Objetivo: {item.objetivo}</Text>
            <Text style={{ color: isDark ? '#ccc' : '#333' }}>Experiência: {item.experiencia}</Text>
            {item.observacoes ? (
              <Text style={{ color: isDark ? '#ccc' : '#333' }}>Obs: {item.observacoes}</Text>
            ) : null}
            <TouchableOpacity onPress={() => removerAluno(item.id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  removeButton: {
    marginTop: 8,
    backgroundColor: '#cc4444',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
