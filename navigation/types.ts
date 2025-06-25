export type RootStackParamList = {
  Welcome: undefined;
  Avaliacao: undefined;
  Dados: {
    aluno: {
      id: string;
      nome: string;
      idade: string;
      telefone: string;
      objetivo: string;
      nivel: string;
      observacoes?: string;
    };
  };
  VerAvaliacao: { alunoId: string };  // <-- adicionada a rota VerAvaliacao
};
