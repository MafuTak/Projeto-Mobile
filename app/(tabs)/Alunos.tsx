import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useAluno } from './aluno-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function Alunos() {
    const { alunos } = useAluno();
    const router = useRouter();
    const [alunoSelecionado, setAlunoSelecionado] = useState<string | null>(null);

    function toggleDropdown(id: string) {
        setAlunoSelecionado(alunoSelecionado === id ? null : id);
    }

    function irPara(caminho: string, aluno: string) {
        console.log(`Ação: ${caminho} para aluno ${aluno}`);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Alunos</Text>

            {alunos.length === 0 ? (
                <Text style={styles.semAlunos}>Nenhum aluno cadastrado. </Text>
            ) : (
                <FlatList 
                    data={alunos}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Pressable onPress={() => toggleDropdown(item.id)}>
                                <Text style={styles.nome}>{item.nome}</Text>
                            </Pressable>

                            {alunoSelecionado === item.id && (
                                <View style={styles.dropdown}>
                                    <Pressable onPress={() => irPara('avaliacao', item.nome)}>
                                        <Text style={styles.opcao}>Fazer Avaliação</Text>
                                    </Pressable>
                                    <Pressable onPress={() => irPara('serie', item.nome)}>
                                        <Text style={styles.opcao}>Fazer Série</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  semAlunos: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  opcao: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});
