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


INSERT INTO public.perfil_acesso (nome)
VALUES
    ('Aluno'),
    ('Professor'),
    ('Admin')
    ON CONFLICT DO NOTHING;

INSERT INTO usuarios (nome, email, senha, cpf, perfil_id)
VALUES (
    'Admin', 
    'admin@teste.com', 
    '$2b$10$LAP75v687f9Amm5dXS3dVe7qdHuYucJwibP5vzcnCd2RyacLShbtu',
    '12345678901',
    (SELECT id FROM perfil_acesso WHERE nome = 'Admin' LIMIT 1)
);
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


-- =========================
-- SEED DE DADOS INICIAIS
-- =========================

-- Perfis (evita duplicar caso rode de novo)
INSERT INTO perfil_acesso (nome)
SELECT v.nome
FROM (VALUES ('Aluno'), ('Professor'), ('Admin')) AS v(nome)
WHERE NOT EXISTS (
    SELECT 1 FROM perfil_acesso p WHERE p.nome = v.nome
);


-- Usuários (todos usam o mesmo hash do admin atual, então a mesma senha dele)
INSERT INTO usuarios (nome, email, senha, cpf, perfil_id)
SELECT v.nome, v.email, v.senha, v.cpf,
       (SELECT id FROM perfil_acesso WHERE nome = v.perfil LIMIT 1)
FROM (VALUES
    ('Admin',    'admin@teste.com',              '$2b$10$LAP75v687f9Amm5dXS3dVe7qdHuYucJwibP5vzcnCd2RyacLShbtu', '12345678901', 'Admin'),
    ('Tallyon',  'tallyon26@gmail.com',          '$2a$12$.1u1x2VPephFD3KeWypM4eCQCgWueRu5o1oKyOMWE5uLDDYezaYb6', '32323232323', 'Professor'),
    ('Jamil',    'jamilsalomao2003@gmail.com',   '$$2a$12$FEr6JGo2FemXpjWKoiobaOw/gsq7PqQoAd8aKt1VBY7FrcDGqqjeu', '32323232323', 'Professor'),
    ('Danilo',   'danilolugli0101@gmail.com',    '$2a$12$YGCZ16XRfxlpBr51fPlsxOGcK97j2JCmWQF2weqZUug0aKn2ch0x6', '32323232323', 'Professor'),
    ('Maria Silva',   'professor@teste.com',     '$2b$10$LAP75v687f9Amm5dXS3dVe7qdHuYucJwibP5vzcnCd2RyacLShbtu', '98765432100', 'Professor'),
    ('João Santos',   'professor2@teste.com',    '$2b$10$LAP75v687f9Amm5dXS3dVe7qdHuYucJwibP5vzcnCd2RyacLShbtu', '11122233344', 'Professor'),
    ('Ana Oliveira',  'aluno@teste.com',         '$2b$10$LAP75v687f9Amm5dXS3dVe7qdHuYucJwibP5vzcnCd2RyacLShbtu', '55566677788', 'Aluno'),
    ('Pedro Costa',   'aluno2@teste.com',        '$2b$10$LAP75v687f9Amm5dXS3dVe7qdHuYucJwibP5vzcnCd2RyacLShbtu', '99988877766', 'Aluno')
) AS v(nome, email, senha, cpf, perfil)
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios u WHERE u.email = v.email
);

-- Posts (autor = professores)
INSERT INTO post (titulo, conteudo, disciplina, data_criacao, data_atualizacao, autor)
SELECT v.titulo, v.conteudo, v.disciplina, NOW(), NOW(),
       (SELECT id FROM usuarios WHERE email = v.autor_email LIMIT 1)
FROM (VALUES
    -- Matemática
    ('Equações do 2º grau sem medo',
     'Aprenda a identificar os coeficientes a, b e c, calcular o delta e aplicar a fórmula de Bhaskara passo a passo, com exemplos resolvidos.',
     'Matemática', 'tallyon26@gmail.com'),
    ('Porcentagem no dia a dia',
     'Descontos, aumentos e juros: veja como calcular porcentagens de forma rápida usando regra de três e multiplicadores.',
     'Matemática', 'jamilsalomao2003@gmail.com'),

    ('Quando usar crase',
     'A crase é a fusão da preposição "a" com o artigo "a". Veja as regras principais e os casos em que ela é proibida ou facultativa.',
     'Português', 'professor@teste.com'),
    ('Concordância verbal: erros comuns',
     'Sujeito composto, sujeito posposto e expressões como "a maioria de": entenda os erros mais frequentes e como evitá-los.',
     'Português', 'professor2@teste.com'),
    ('Machado de Assis e o Realismo',
     'Dom Casmurro e Memórias Póstumas de Brás Cubas inauguram o Realismo no Brasil, com ironia, análise psicológica e crítica social.',
     'Literatura', 'danilolugli0101@gmail.com'),
    ('Modernismo brasileiro: a Semana de 22',
     'A Semana de Arte Moderna rompeu com os padrões acadêmicos e defendeu uma arte livre, nacional e experimental.',
     'Literatura', 'professor@teste.com'),
    ('Como estruturar uma dissertação argumentativa',
     'Introdução com tese, dois parágrafos de desenvolvimento e conclusão: veja um modelo simples para organizar suas ideias.',
     'Redação', 'tallyon26@gmail.com'),
    ('Proposta de intervenção nota 1000',
     'Uma boa proposta precisa de agente, ação, meio, finalidade e detalhamento. Veja exemplos para cada elemento.',
     'Redação', 'jamilsalomao2003@gmail.com'),
    ('Present Perfect vs Simple Past',
     'Quando usar "I have visited" e quando usar "I visited"? Entenda a diferença com marcadores de tempo e exemplos práticos.',
     'Inglês', 'professor2@teste.com'),
    ('Phrasal verbs mais usados',
     'Give up, look for, turn on, find out: conheça os phrasal verbs mais comuns e como usá-los em frases do cotidiano.',
     'Inglês', 'danilolugli0101@gmail.com'),
    ('Falsos amigos entre português e espanhol',
     'Palavras como "embarazada", "exquisito" e "salir" parecem iguais ao português, mas têm significados diferentes. Evite as confusões.',
     'Espanhol', 'professor@teste.com'),
    ('Ser vs estar em espanhol',
     'Os dois verbos significam "ser/estar", mas cada um tem usos próprios: identidade, características, estados e localização.',
     'Espanhol', 'tallyon26@gmail.com'),
    ('Revolução Industrial e suas consequências',
     'A mecanização da produção transformou a economia, as cidades e as relações de trabalho a partir do século XVIII.',
     'História', 'jamilsalomao2003@gmail.com'),
    ('Era Vargas: do Estado Novo à redemocratização',
     'Entenda as fases do governo Vargas, as leis trabalhistas, a censura e o fim do Estado Novo em 1945.',
     'História', 'professor2@teste.com'),
    ('Tipos de clima do Brasil',
     'Equatorial, tropical, semiárido, subtropical: veja as características e a distribuição dos principais climas brasileiros.',
     'Geografia', 'danilolugli0101@gmail.com'),
    ('Urbanização e problemas das grandes cidades',
     'Trânsito, moradia, saneamento e poluição: como o crescimento acelerado das cidades gera desafios para o planejamento urbano.',
     'Geografia', 'professor@teste.com'),
    ('O mito da caverna de Platão',
     'A alegoria da caverna fala sobre aparência e realidade, ignorância e conhecimento, e a dificuldade de sair da zona de conforto intelectual.',
     'Filosofia', 'tallyon26@gmail.com'),
    ('Ética e moral: qual a diferença?',
     'A moral é o conjunto de costumes de uma sociedade, enquanto a ética é a reflexão sobre esses valores. Veja exemplos do cotidiano.',
     'Filosofia', 'jamilsalomao2003@gmail.com'),
    ('Durkheim, Weber e Marx: visão geral',
     'Os três clássicos da Sociologia explicaram a sociedade por caminhos distintos: fato social, ação social e luta de classes.',
     'Sociologia', 'professor2@teste.com'),
    ('Desigualdade social no Brasil',
     'Renda, educação e acesso a serviços: um panorama das causas históricas e dos efeitos da desigualdade no país.',
     'Sociologia', 'danilolugli0101@gmail.com'),
    ('Leis de Newton no cotidiano',
     'Inércia, força resultante e ação e reação aparecem em situações simples, como frear um carro ou caminhar.',
     'Física', 'professor@teste.com'),
    ('Energia cinética e potencial',
     'Veja como a energia se transforma em uma montanha-russa e por que a energia mecânica se conserva na ausência de atrito.',
     'Física', 'tallyon26@gmail.com'),
    ('Tabela periódica: como ler',
     'Períodos, famílias, número atômico e massa atômica: aprenda a extrair informações de cada elemento da tabela.',
     'Química', 'jamilsalomao2003@gmail.com'),
    ('Ligações químicas: iônica, covalente e metálica',
     'Entenda como os átomos se unem para formar substâncias e como o tipo de ligação influencia as propriedades do material.',
     'Química', 'professor2@teste.com'),
    ('Fotossíntese e respiração celular',
     'Dois processos complementares: um produz glicose e oxigênio, o outro libera energia para a célula usando esses mesmos produtos.',
     'Biologia', 'danilolugli0101@gmail.com'),
    ('Genética: as leis de Mendel',
     'Dominância, segregação e cruzamentos: veja como Mendel descobriu os princípios da hereditariedade usando ervilhas.',
     'Biologia', 'professor@teste.com'),
    ('O ciclo da água',
     'Evaporação, condensação, precipitação e infiltração: como a água circula entre oceanos, atmosfera e continentes.',
     'Ciências', 'tallyon26@gmail.com'),
    ('Sistema solar: planetas e movimentos',
     'Conheça os oito planetas, a diferença entre rotação e translação e por que existem as estações do ano.',
     'Ciências', 'jamilsalomao2003@gmail.com'),
    ('Impressionismo e Monet',
     'O movimento priorizou a luz e a impressão do momento, com pinceladas soltas e cenas ao ar livre.',
     'Artes', 'professor2@teste.com'),
    ('Tarsila do Amaral e a Antropofagia',
     'Abaporu simboliza o movimento antropofágico, que propunha devorar influências estrangeiras para criar uma arte genuinamente brasileira.',
     'Artes', 'danilolugli0101@gmail.com'),
    ('Importância do aquecimento antes do exercício',
     'Aquecer prepara músculos e articulações, aumenta a circulação e reduz o risco de lesões durante a atividade física.',
     'Educação Física', 'professor@teste.com'),
    ('Esportes coletivos e trabalho em equipe',
     'Futsal, vôlei e basquete desenvolvem comunicação, respeito e cooperação, além de condicionamento físico.',
     'Educação Física', 'tallyon26@gmail.com'),
    ('Como funciona a internet',
     'Servidores, roteadores, protocolos e endereços IP: uma explicação simples do caminho que um site percorre até chegar ao seu navegador.',
     'Informática', 'jamilsalomao2003@gmail.com'),
    ('Segurança digital: senhas fortes',
     'Use senhas longas e únicas, ative a verificação em duas etapas e desconfie de links suspeitos para proteger suas contas.',
     'Informática', 'professor2@teste.com'),
    ('Introdução à lógica de programação',
     'Variáveis, condicionais e laços de repetição são a base de qualquer linguagem. Veja exemplos em pseudocódigo.',
     'Programação', 'danilolugli0101@gmail.com'),
    ('Git e GitHub para iniciantes',
     'Aprenda a criar repositórios, fazer commits, trabalhar com branches e abrir pull requests de forma organizada.',
     'Programação', 'admin@teste.com'),
    ('O que é um microcontrolador Arduino',
     'O Arduino é uma placa programável muito usada para aprender eletrônica e robótica, controlando LEDs, motores e sensores.',
     'Robótica', 'tallyon26@gmail.com'),
    ('Sensores e atuadores em robôs',
     'Sensores captam informações do ambiente e atuadores executam movimentos. Veja exemplos como ultrassônico, servo e motor DC.',
     'Robótica', 'jamilsalomao2003@gmail.com'),
    ('Como montar um orçamento mensal',
     'Liste receitas e despesas fixas e variáveis, defina metas e acompanhe os gastos para evitar o endividamento.',
     'Educação Financeira', 'professor@teste.com'),
    ('Juros compostos: o poder do tempo',
     'Entenda por que começar a investir cedo faz tanta diferença e como os juros sobre juros multiplicam o patrimônio.',
     'Educação Financeira', 'danilolugli0101@gmail.com')
) AS v(titulo, conteudo, disciplina, autor_email)
WHERE NOT EXISTS (
    SELECT 1 FROM post p WHERE p.titulo = v.titulo
);

-- Comentários
INSERT INTO comentarios (conteudo, post_id, autor_id)
SELECT v.conteudo,
       (SELECT id FROM post WHERE titulo = v.post_titulo LIMIT 1),
       (SELECT id FROM usuarios WHERE email = v.autor_email LIMIT 1)
FROM (VALUES
    ('Finalmente entendi o delta, obrigado!',                         'Equações do 2º grau sem medo',                    'aluno@teste.com'),
    ('Os exemplos de desconto ajudaram bastante.',                    'Porcentagem no dia a dia',                        'aluno2@teste.com'),
    ('Sempre errava a crase antes de verbos, agora ficou claro.',     'Quando usar crase',                               'aluno@teste.com'),
    ('Pode fazer um post sobre concordância nominal também?',         'Concordância verbal: erros comuns',               'aluno2@teste.com'),
    ('Dom Casmurro é um dos meus livros favoritos!',                  'Machado de Assis e o Realismo',                   'aluno@teste.com'),
    ('Ótimo resumo para a prova de vestibular.',                      'Modernismo brasileiro: a Semana de 22',           'aluno2@teste.com'),
    ('Esse modelo de redação vai me ajudar muito.',                   'Como estruturar uma dissertação argumentativa',   'aluno@teste.com'),
    ('Dá para postar um exemplo completo de proposta?',               'Proposta de intervenção nota 1000',               'aluno2@teste.com'),
    ('Sempre confundo esses dois tempos verbais, valeu!',             'Present Perfect vs Simple Past',                  'aluno@teste.com'),
    ('Vou praticar os phrasal verbs com meus colegas.',               'Phrasal verbs mais usados',                       'aluno2@teste.com'),
    ('Já passei vergonha com "embarazada", haha.',                    'Falsos amigos entre português e espanhol',        'aluno@teste.com'),
    ('Explicação muito clara sobre ser e estar.',                     'Ser vs estar em espanhol',                        'aluno2@teste.com'),
    ('A Revolução Industrial caiu na minha prova, ajudou muito.',     'Revolução Industrial e suas consequências',       'aluno@teste.com'),
    ('Excelente material sobre o Estado Novo.',                       'Era Vargas: do Estado Novo à redemocratização',   'aluno2@teste.com'),
    ('Moro no semiárido e o texto descreve bem o clima daqui.',       'Tipos de clima do Brasil',                        'aluno@teste.com'),
    ('Tema muito atual, ótimo para redação.',                         'Urbanização e problemas das grandes cidades',     'aluno2@teste.com'),
    ('A alegoria da caverna sempre me intrigou.',                     'O mito da caverna de Platão',                     'aluno@teste.com'),
    ('Agora consigo explicar a diferença para os meus amigos.',       'Ética e moral: qual a diferença?',                'aluno2@teste.com'),
    ('Resumo perfeito para revisar antes da prova.',                  'Durkheim, Weber e Marx: visão geral',             'aluno@teste.com'),
    ('Importante discutir esse tema em sala de aula.',                'Desigualdade social no Brasil',                   'aluno2@teste.com'),
    ('Os exemplos do cotidiano facilitam muito.',                     'Leis de Newton no cotidiano',                     'aluno@teste.com'),
    ('A montanha-russa foi um ótimo exemplo!',                        'Energia cinética e potencial',                    'aluno2@teste.com'),
    ('Nunca soube ler a tabela direito, agora ficou fácil.',          'Tabela periódica: como ler',                      'aluno@teste.com'),
    ('Tinha dúvida sobre ligação covalente, esclareceu tudo.',        'Ligações químicas: iônica, covalente e metálica', 'aluno2@teste.com'),
    ('Muito bem explicado, parabéns!',                                'Fotossíntese e respiração celular',               'aluno@teste.com'),
    ('Consegui resolver os exercícios de cruzamento depois deste post.', 'Genética: as leis de Mendel',                  'aluno2@teste.com'),
    ('Aprendi o ciclo da água de um jeito bem visual.',               'O ciclo da água',                                 'aluno@teste.com'),
    ('Será que um dia chegaremos a Marte?',                           'Sistema solar: planetas e movimentos',            'aluno2@teste.com'),
    ('Adoro os quadros do Monet!',                                    'Impressionismo e Monet',                          'aluno@teste.com'),
    ('O Abaporu é uma obra incrível.',                                'Tarsila do Amaral e a Antropofagia',              'aluno2@teste.com'),
    ('Vou lembrar de aquecer antes dos treinos.',                     'Importância do aquecimento antes do exercício',   'aluno@teste.com'),
    ('Jogar vôlei em equipe é o que mais gosto na escola.',           'Esportes coletivos e trabalho em equipe',         'aluno2@teste.com'),
    ('Nunca imaginei que tinha tanta coisa por trás de um site.',     'Como funciona a internet',                        'aluno@teste.com'),
    ('Já ativei a verificação em duas etapas, valeu pela dica!',      'Segurança digital: senhas fortes',                'aluno2@teste.com'),
    ('Lógica de programação é a base de tudo, ótimo post.',           'Introdução à lógica de programação',              'aluno@teste.com'),
    ('Estava com dificuldade em branches, ajudou bastante.',          'Git e GitHub para iniciantes',                    'aluno2@teste.com'),
    ('Quero montar meu primeiro projeto com Arduino!',                'O que é um microcontrolador Arduino',             'aluno@teste.com'),
    ('Os exemplos de sensores ficaram bem claros.',                   'Sensores e atuadores em robôs',                   'aluno2@teste.com'),
    ('Comecei a anotar meus gastos depois deste post.',               'Como montar um orçamento mensal',                 'aluno@teste.com'),
    ('Os juros compostos realmente fazem diferença no longo prazo.',  'Juros compostos: o poder do tempo',               'aluno2@teste.com')
) AS v(conteudo, post_titulo, autor_email)
WHERE NOT EXISTS (
    SELECT 1 FROM comentarios c
    WHERE c.conteudo = v.conteudo
      AND c.post_id = (SELECT id FROM post WHERE titulo = v.post_titulo LIMIT 1)
);