import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('alunos.db');

export function criarTabela() {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS alunos (
              id TEXT PRIMARY KEY NOT NULL,
              nome TEXT,
              idade TEXT,
              objetivo TEXT,
              experiencia TEXT,
              observacao TEXT
            );`
        );
    });
}

export function adicionarAlunoDB(aluno) {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO alunos (id, nome, idade, objetivo, experiencia, observacao) VALUES (?, ?, ?, ?, ?, ?);',
            [aluno.id, aluno.nome, aluno.idade, aluno.objetivo, aluno.experiencia, aluno.observacao]
        );
    });
}

export function buscarAlunosDB(callback) {
    db.transaction(tx => {
        tx.executeSql('SELECT * FROM alunos;', [], (_, { rows }) => {
            callback(rows._array);
        });
    });
}
