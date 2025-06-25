import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  useColorScheme,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type Aluno = {
  id: string | number;
  nome: string;
};

export default function CriarSerieScreen() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const [nomeExercicio, setNomeExercicio] = useState('');
  const [series, setSeries] = useState('');
  const [repeticoes, setRepeticoes] = useState('');
  const [intervalo, setIntervalo] = useState('');
  const isDark = useColorScheme() === 'dark';

  const router = useRouter();

  useEffect(() => {
    const carregarAlunos = async () => {
      try {
        const dados = await AsyncStorage.getItem('@alunos');
        const lista: Aluno[] = dados ? JSON.parse(dados) : [];
        setAlunos(lista);
      } catch (error) {
        console.error('Erro ao carregar alunos:', error);
      }
    };
    carregarAlunos();
  }, []);

  const salvar = async () => {
    if (!alunoSelecionado || !nomeExercicio || !series || !repeticoes || !intervalo) {
      Alert.alert('Erro', 'Preencha todos os campos e selecione um aluno');
      return;
    }

    const serie = {
      nomeExercicio,
      series,
      repeticoes,
      intervalo,
    };

    try {
      const chave = `@serie_${alunoSelecionado.id}_${nomeExercicio}`;
      await AsyncStorage.setItem(chave, JSON.stringify(serie));
      Alert.alert('Sucesso', 'Série cadastrada com sucesso!');
      setNomeExercicio('');
      setSeries('');
      setRepeticoes('');
      setIntervalo('');

      router.push('/VerSerieScreen');

    } catch (error) {
      console.error('Erro ao salvar série:', error);
      Alert.alert('Erro', 'Não foi possível salvar a série');
    }
  };

  const renderAlunoItem = ({ item }: { item: Aluno }) => {
    const selecionado = alunoSelecionado?.id === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.alunoItem,
          {
            backgroundColor: selecionado
              ? isDark
                ? '#007AFF'
                : '#3399FF'
              : isDark
              ? '#333'
              : '#eee',
          },
        ]}
        onPress={() => setAlunoSelecionado(item)}
      >
        <Text
          style={{
            color: isDark ? '#fff' : '#000',
            fontWeight: selecionado ? 'bold' : 'normal',
          }}
        >
          {item.nome}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Selecione o Aluno</Text>

      {alunos.length === 0 ? (
        <Text style={{ color: isDark ? '#aaa' : '#555', marginBottom: 16 }}>
          Nenhum aluno cadastrado.
        </Text>
      ) : (
        <FlatList
          data={alunos}
          keyExtractor={item => item.id.toString()}
          renderItem={renderAlunoItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 50, marginBottom: 16 }}
        />
      )}

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Aluno Selecionado</Text>
      <Text
        style={[
          styles.input,
          { color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#222' : '#ddd' },
        ]}
      >
        {alunoSelecionado ? alunoSelecionado.nome : 'Nenhum aluno selecionado'}
      </Text>

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Nome do Exercício</Text>
      <TextInput
        style={styles.input}
        value={nomeExercicio}
        onChangeText={setNomeExercicio}
        placeholder="Nome do Exercício"
        placeholderTextColor="#888"
      />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Número de Séries</Text>
      <TextInput
        style={styles.input}
        value={series}
        onChangeText={setSeries}
        keyboardType="numeric"
        placeholder="Ex: 3"
        placeholderTextColor="#888"
      />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Repetições</Text>
      <TextInput
        style={styles.input}
        value={repeticoes}
        onChangeText={setRepeticoes}
        keyboardType="numeric"
        placeholder="Ex: 12"
        placeholderTextColor="#888"
      />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Tempo de Intervalo (s)</Text>
      <TextInput
        style={styles.input}
        value={intervalo}
        onChangeText={setIntervalo}
        keyboardType="numeric"
        placeholder="Ex: 60"
        placeholderTextColor="#888"
      />

      <Button title="Salvar Série" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  alunoItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
});
