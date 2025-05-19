import React, { createContext, useContext, useState } from 'react';

export type Aluno = {
    id: string;
    nome: string;
    idade: string;
    objetivo: string;
    experiencia: string;
    observacao: string;
};

type AlunoContextType = {
    alunos: Aluno[];
    adicionarAluno: (aluno: Aluno) => void;
};

const AlunoContext = createContext<AlunoContextType | undefined>(undefined);

export const useAluno = () => {
    const context = useContext(AlunoContext);
    if (!context) throw new Error('useAluno deve ser usado dentro do AlunoProvider');
    return context;
};

export const AlunoProvider = ({ children }: { children: React.ReactNode }) => {
        const [alunos, setAlunos] = useState<Aluno[]>([]);

        const adicionarAluno = (aluno: Aluno) => {
            setAlunos(prev => [...prev, aluno]);
        };

        return (
            <AlunoContext.Provider value={{ alunos, adicionarAluno }}>
                {children}
            </AlunoContext.Provider>
        );
};
