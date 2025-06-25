import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
  Animated,
  LayoutAnimation,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Avaliacao = {
  peso?: string;
  altura?: string;
};

type AlunoComAvaliacao = {
  id: string | number;
  nome: string;
  idade?: string;
  telefone?: string;
  objetivo?: string;
  experiencia?: string;
  observacoes?: string;
  avaliacao?: Avaliacao;
};

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState<AlunoComAvaliacao[]>([]);
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState<string | number | null>(null);
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    const carregarAlunosComAvaliacao = async () => {
      try {
        const dados = await AsyncStorage.getItem('@alunos');
        const lista: AlunoComAvaliacao[] = dados ? JSON.parse(dados) : [];

        const listaComAvaliacao: AlunoComAvaliacao[] = await Promise.all(
          lista.map(async (aluno) => {
            const avaliacaoDados = await AsyncStorage.getItem(`@avaliacao_${aluno.id}`);
            const avaliacao = avaliacaoDados ? JSON.parse(avaliacaoDados) : undefined;
            return { ...aluno, avaliacao };
          }),
        );

        setAlunos(listaComAvaliacao);
      } catch (error) {
        console.error('Erro ao carregar alunos e avaliações:', error);
      }
    };

    carregarAlunosComAvaliacao();
  }, []);

  const alternarDetalhes = (id: string | number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAlunoSelecionadoId((prevId) => (prevId === id ? null : id));
  };

  const removerAluno = (id: string | number) => {
    Alert.alert(
      'Confirmação',
      'Deseja remover este aluno, sua avaliação e todas as séries associadas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              const novaLista = alunos.filter((aluno) => aluno.id !== id);
              setAlunos(novaLista);
              await AsyncStorage.setItem('@alunos', JSON.stringify(novaLista));
              await AsyncStorage.removeItem(`@avaliacao_${id}`);

              const todasChaves = await AsyncStorage.getAllKeys();
              const chavesSerieDoAluno = todasChaves.filter((key) =>
                key.startsWith(`@serie_${id}`)
              );
              if (chavesSerieDoAluno.length > 0) {
                await AsyncStorage.multiRemove(chavesSerieDoAluno);
              }

              Alert.alert('Sucesso', 'Aluno e dados removidos com sucesso!');
            } catch (error) {
              console.error('Erro ao remover aluno:', error);
              Alert.alert('Erro', 'Não foi possível remover o aluno.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }: { item: AlunoComAvaliacao }) => (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: isDark ? '#333' : '#eee' }]}
      onPress={() => alternarDetalhes(item.id)}
      onLongPress={() => removerAluno(item.id)}
    >
      <Text style={[styles.nome, { color: isDark ? '#fff' : '#000' }]}>{item.nome}</Text>

      {alunoSelecionadoId === item.id && (
        <View style={styles.detalhes}>
          <Text style={[styles.detalhe, { color: isDark ? '#ccc' : '#555' }]}>Idade: {item.idade ?? '-'}</Text>
          <Text style={[styles.detalhe, { color: isDark ? '#ccc' : '#555' }]}>Telefone: {item.telefone ?? '-'}</Text>
          <Text style={[styles.detalhe, { color: isDark ? '#ccc' : '#555' }]}>Objetivo: {item.objetivo ?? '-'}</Text>
          <Text style={[styles.detalhe, { color: isDark ? '#ccc' : '#555' }]}>Experiência: {item.experiencia ?? '-'}</Text>
          <Text style={[styles.detalhe, { color: isDark ? '#ccc' : '#555' }]}>Observações: {item.observacoes || 'Nenhuma'}</Text>
        </View>
      )}

      {item.avaliacao ? (
        <Text style={{ color: isDark ? '#ccc' : '#555', fontStyle: 'normal', marginTop: 4 }}>
          Peso: {item.avaliacao.peso ?? '-'} | Altura: {item.avaliacao.altura ?? '-'}
        </Text>
      ) : (
        <Text style={{ fontStyle: 'italic', color: isDark ? '#666' : '#999', marginTop: 4 }}>
          Sem avaliação
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.titulo, { color: isDark ? '#fff' : '#000' }]}>Lista de Alunos</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ color: isDark ? '#aaa' : '#555' }}>Nenhum aluno encontrado.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  nome: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  detalhes: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#999',
  },
  detalhe: {
    fontSize: 14,
    marginBottom: 4,
  },
});
