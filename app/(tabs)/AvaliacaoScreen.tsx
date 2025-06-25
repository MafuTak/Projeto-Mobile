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

export default function AvaliacaoScreen() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
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

  useEffect(() => {
    const carregarAvaliacao = async () => {
      if (!alunoSelecionado) return;

      try {
        const dados = await AsyncStorage.getItem(`@avaliacao_${alunoSelecionado.id}`);
        if (dados) {
          const avaliacao = JSON.parse(dados);
          setPeso(avaliacao.peso);
          setAltura(avaliacao.altura);
        } else {
          setPeso('');
          setAltura('');
        }
      } catch (error) {
        console.error('Erro ao carregar avaliação:', error);
      }
    };
    carregarAvaliacao();
  }, [alunoSelecionado]);

  const salvar = async () => {
    if (!alunoSelecionado) {
      Alert.alert('Erro', 'Selecione um aluno');
      return;
    }
    if (!peso || !altura) {
      Alert.alert('Erro', 'Preencha peso e altura');
      return;
    }

    const avaliacao = { peso, altura };

    try {
      await AsyncStorage.setItem(`@avaliacao_${alunoSelecionado.id}`, JSON.stringify(avaliacao));
      Alert.alert('Sucesso', 'Avaliação salva com sucesso!');
      setPeso('');
      setAltura('');
      router.push('/ListaAlunos');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a avaliação');
      console.error(error);
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

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Peso</Text>
      <TextInput
        style={styles.input}
        value={peso}
        onChangeText={setPeso}
        placeholder="Peso"
        keyboardType="numeric"
        placeholderTextColor="#888"
      />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Altura</Text>
      <TextInput
        style={styles.input}
        value={altura}
        onChangeText={setAltura}
        placeholder="Altura"
        keyboardType="numeric"
        placeholderTextColor="#888"
      />

      <Button title="Salvar Avaliação" onPress={salvar} />
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
