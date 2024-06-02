CREATE TABLE tarefas (
    id serial PRIMARY KEY,
    nome varchar(255) NOT NULL,
    descricao text,
    status varchar(50),
    data_criacao timestamp DEFAULT CURRENT_TIMESTAMP
);
