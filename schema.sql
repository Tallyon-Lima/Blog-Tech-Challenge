-- Active: 1781218750256@@127.0.0.1@5432@blog_tech_2_db

CREATE TABLE post (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo VARCHAR(255) NOT NULL,
    disciplina VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    data_atualizacao TIMESTAMP WITHOUT TIME ZONE NOT NULL
)

CREATE TABLE usuarios (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NUll,
    senha VARCHAR(255) NOT NULL
)


CREATE TABLE perfil_acesso (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
)

alter table post 
add column autor bigint not null;


alter table usuarios
add column perfil_id bigint not NULL;


INSERT INTO public.perfil_acesso (nome)
VALUES
    ('Aluno'),
    ('Professor');

-- DROP TABLE post ;
-- DROP TABLE usuarios ;
-- DROP TABLE perfil_acesso;