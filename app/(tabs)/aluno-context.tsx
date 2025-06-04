import React, { createContext, useContext, useEffect, useState } from 'react';
import { adicionarAlunoDB, Aluno, buscarAlunosDB, criarTabela } from './database';


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

        useEffect(() => {
            criarTabela();
            buscarAlunosDB((dados: Aluno[]) => {
                setAlunos(dados);
            });
        }, []);

        const adicionarAluno = (aluno: Aluno) => {
            adicionarAlunoDB(aluno);
            setAlunos(prev => [...prev, aluno]);
        };

        return (
            <AlunoContext.Provider value={{ alunos, adicionarAluno }}>
                {children}
            </AlunoContext.Provider>
        );
};
