import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Serie = {
  nomeExercicio: string;
  series: string;
  repeticoes: string;
  intervalo: string;
};

type Aluno = {
  id: string;
  nome: string;
};

export default function VerSerieScreen() {
  const isDark = useColorScheme() === 'dark';
  const [todasSeries, setTodasSeries] = useState<Record<string, Serie[]>>({});
  const [alunosMap, setAlunosMap] = useState<Record<string, string>>({});
  const [selecionado, setSelecionado] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const serieKeys = keys.filter(k => k.startsWith('@serie_'));
      const dadosSerie = await AsyncStorage.multiGet(serieKeys);
      const grouped: Record<string, Serie[]> = {};

      dadosSerie.forEach(([chave, valor]) => {
        if (valor) {
          const partes = chave.split('_');
          const alunoId = partes[1];
          const serie = JSON.parse(valor) as Serie | Serie[];

          if (!grouped[alunoId]) grouped[alunoId] = [];

          if (Array.isArray(serie)) {
            grouped[alunoId].push(...serie);
          } else {
            grouped[alunoId].push(serie);
          }
        }
      });

      const alunosRaw = await AsyncStorage.getItem('@alunos');
      const listaAlunos: Aluno[] = alunosRaw ? JSON.parse(alunosRaw) : [];
      const map: Record<string, string> = {};
      listaAlunos.forEach(a => {
        map[a.id.toString()] = a.nome;
      });

      setAlunosMap(map);
      setTodasSeries(grouped);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    }
  };

  const excluirSeriesDoAluno = async (alunoId: string) => {
    Alert.alert(
      'Excluir Séries e Aluno',
      `Deseja excluir todas as séries e o registro do aluno ${alunosMap[alunoId] || 'Aluno'}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();

              const keysParaExcluir = keys.filter(k => k.startsWith(`@serie_${alunoId}`));

              if (keysParaExcluir.length > 0) {
                await AsyncStorage.multiRemove(keysParaExcluir);
              }

              const alunosRaw = await AsyncStorage.getItem('@alunos');
              const listaAlunos: Aluno[] = alunosRaw ? JSON.parse(alunosRaw) : [];
              const novaListaAlunos = listaAlunos.filter(a => a.id !== alunoId);
              await AsyncStorage.setItem('@alunos', JSON.stringify(novaListaAlunos));

              await carregarDados();

              if (selecionado === alunoId) setSelecionado(null);

              Alert.alert('Sucesso', 'Aluno e séries excluídos.');
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível excluir o aluno e as séries.');
              console.error(e);
            }
          },
        },
      ]
    );
  };

  const renderSeries = () => {
    if (!selecionado) return null;
    const lista = todasSeries[selecionado] || [];
    if (lista.length === 0) {
      return <Text style={{ color: isDark ? '#fff' : '#000' }}>Nenhuma série encontrada.</Text>;
    }
    return lista.map((s, idx) => (
      <View key={idx} style={[styles.serieItem, { backgroundColor: isDark ? '#222' : '#eee' }]}>
        <Text style={{ color: isDark ? '#fff' : '#000', fontWeight: 'bold' }}>{s.nomeExercicio}</Text>
        <Text style={{ color: isDark ? '#ccc' : '#333' }}>
          Séries: {s.series} | Repetições: {s.repeticoes} | Intervalo: {s.intervalo}s
        </Text>
      </View>
    ));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.titulo, { color: isDark ? '#fff' : '#000' }]}>Ver Séries dos Alunos</Text>

      {Object.keys(todasSeries).length === 0 ? (
        <Text style={{ color: isDark ? '#aaa' : '#555' }}>Nenhuma série cadastrada.</Text>
      ) : (
        Object.keys(todasSeries).map(alunoId => (
          <TouchableOpacity
            key={alunoId}
            onPress={() => setSelecionado(alunoId)}
            onLongPress={() => excluirSeriesDoAluno(alunoId)}
            style={[
              styles.botaoAluno,
              {
                backgroundColor:
                  selecionado === alunoId
                    ? isDark
                      ? '#007AFF'
                      : '#3399FF'
                    : isDark
                    ? '#333'
                    : '#ccc',
              },
            ]}
          >
            <Text style={{ color: isDark ? '#fff' : '#000' }}>
              {alunosMap[alunoId] || `Aluno ${alunoId}`}
            </Text>
          </TouchableOpacity>
        ))
      )}

      {selecionado && (
        <>
          <Text style={[styles.titulo, { color: isDark ? '#fff' : '#000', marginTop: 20 }]}>
            Séries de {alunosMap[selecionado] || `Aluno ${selecionado}`}
          </Text>
          {renderSeries()}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  serieItem: { padding: 12, borderRadius: 6, marginBottom: 10 },
  botaoAluno: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
});
