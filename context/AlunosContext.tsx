// context/AlunosContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Aluno = {
  id: string;
  nome: string;
  idade: string;
  telefone: string;
  objetivo: string;
  experiencia: string;
  observacoes?: string;
};

type AlunosContextType = {
  alunos: Aluno[];
  carregarAlunos: () => Promise<void>;
  adicionarAluno: (aluno: Aluno) => Promise<void>;
  removeAluno: (id: string) => Promise<void>;
};

export const AlunosContext = createContext<AlunosContextType>({
  alunos: [],
  carregarAlunos: async () => {},
  adicionarAluno: async () => {},
  removeAluno: async () => {},
});

export const AlunosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  const carregarAlunos = async () => {
    try {
      const dados = await AsyncStorage.getItem('@alunos');
      const lista = dados ? JSON.parse(dados) : [];
      setAlunos(lista);
    } catch (e) {
      console.error('Erro ao carregar alunos:', e);
    }
  };

  const adicionarAluno = async (aluno: Aluno) => {
    const novaLista = [...alunos, aluno];
    setAlunos(novaLista);
    await AsyncStorage.setItem('@alunos', JSON.stringify(novaLista));
  };

  const removeAluno = async (id: string) => {
    const novaLista = alunos.filter((a) => a.id !== id);
    setAlunos(novaLista);
    await AsyncStorage.setItem('@alunos', JSON.stringify(novaLista));
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  return (
    <AlunosContext.Provider value={{ alunos, carregarAlunos, adicionarAluno, removeAluno }}>
      {children}
    </AlunosContext.Provider>
  );
};
