import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  useColorScheme, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const isDark = useColorScheme() === 'dark';
  const router = useRouter();

  const formatarTelefone = (texto: string) => {
    const cleaned = texto.replace(/\D/g, '');
    if (cleaned.length <= 2) return `(${cleaned})`;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const salvarAluno = async () => {
    if (!nome || !idade || !telefone || !objetivo || !experiencia) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const novoAluno = {
      id: Date.now().toString(),
      nome,
      idade,
      telefone,
      objetivo,
      experiencia,
      observacoes,
    };

    try {
      const dadosExistentes = await AsyncStorage.getItem('@alunos');
      const alunos = dadosExistentes ? JSON.parse(dadosExistentes) : [];
      const novaLista = [...alunos, novoAluno];
      await AsyncStorage.setItem('@alunos', JSON.stringify(novaLista));
      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
      setNome('');
      setIdade('');
      setTelefone('');
      setObjetivo('');
      setExperiencia('');
      setObservacoes('');
      router.push('./ListaAlunos'); // redireciona após cadastro
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      Alert.alert('Erro', 'Não foi possível salvar o aluno.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Nome *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo" />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Idade *</Text>
      <TextInput style={styles.input} value={idade} onChangeText={setIdade} keyboardType="numeric" />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Telefone *</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={(t) => setTelefone(formatarTelefone(t))} keyboardType="phone-pad" />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Objetivo *</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={objetivo} onValueChange={setObjetivo}>
          <Picker.Item label="Selecione o objetivo" value="" />
          <Picker.Item label="Emagrecimento" value="Emagrecimento" />
          <Picker.Item label="Hipertrofia" value="Hipertrofia" />
          <Picker.Item label="Condicionamento" value="Condicionamento" />
        </Picker>
      </View>

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Experiência *</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={experiencia} onValueChange={setExperiencia}>
          <Picker.Item label="Selecione o nível" value="" />
          <Picker.Item label="Iniciante" value="Iniciante" />
          <Picker.Item label="Intermediário" value="Intermediário" />
          <Picker.Item label="Avançado" value="Avançado" />
        </Picker>
      </View>

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Observações (opcional)</Text>
      <TextInput style={styles.input} value={observacoes} onChangeText={setObservacoes} placeholder="Restrição, lesão, etc." />

      <Button title="Cadastrar Aluno" onPress={salvarAluno} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    borderWidth: 1, borderColor: '#aaa',
    padding: 8, marginBottom: 10, borderRadius: 5,
    color: '#aaa'
  },
  label: { fontSize: 14, marginBottom: 4 },
  pickerContainer: {
    borderWidth: 1, borderColor: '#aaa',
    borderRadius: 5, marginBottom: 10,
    backgroundColor: '#eee',
  },
});
