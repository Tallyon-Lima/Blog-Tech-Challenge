-- Active: 1781218750256@@127.0.0.1@5432

CREATE TABLE IF NOT EXISTS post (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT NOT NULL,
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

alter table usuarios
ADD COLUMN IF NOT EXISTS cpf VARCHAR(14) NOT NULL;

INSERT INTO usuarios (nome, email, senha, cpf, perfil_id)
VALUES (
    'Admin', 
    'admin@teste.com', 
    '$2a$12$qkglg5uMWxL4m6HRQtHPi.3AFY3M2p3TG1bVjOK35tNpxaTiBiwga',
    '12345678901',
    (SELECT id FROM perfil_acesso WHERE nome = 'Admin' LIMIT 1)
);

INSERT INTO public.perfil_acesso (nome)
VALUES
    ('Aluno'),
    ('Professor'),
    ('Admin')
    ON CONFLICT DO NOTHING;

-- DROP TABLE post ;
-- DROP TABLE usuarios ;
-- DROP TABLE perfil_acesso;

CREATE TABLE IF NOT EXISTS comentarios (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    conteudo VARCHAR(255) NOT NULL,
    post_id INTEGER NOT NULL REFERENCES post(id) ON DELETE CASCADE,
    autor_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data_criacao TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);