-- Active: 1781218750256@@127.0.0.1@5432@blog_tech_2_db

CREATE TABLE IF NOT EXISTS post (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo VARCHAR(255) NOT NULL,
    disciplina VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    data_atualizacao TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NUll,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS perfil_acesso (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
);

alter table post 
ADD COLUMN IF NOT EXISTS autor bigint not null;

alter table usuarios
ADD COLUMN IF NOT EXISTS perfil_id bigint not NULL;

INSERT INTO public.perfil_acesso (nome)
VALUES
    ('Aluno'),
    ('Professor')
    ON CONFLICT DO NOTHING;

-- DROP TABLE post ;
-- DROP TABLE usuarios ;
-- DROP TABLE perfil_acesso;