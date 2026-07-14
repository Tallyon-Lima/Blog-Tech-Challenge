# 🚀 Tech Challenge - Fase 2 | Pós Tech FIAP - Full Stack Development

**Grupo 25**

Este repositório contém a implementação do back-end para a Fase 2 do Tech Challenge do curso de Pós Tech em Full Stack Development da FIAP. O projeto consiste em uma plataforma de blogging dinâmico projetada para escalar a um panorama nacional, com foco em alta performance e escalabilidade.

## 👥 Integrantes do Grupo

* **Danilo Lugli dos Santos** (RM 370730)
* **Jamil Salomão Rodrigues Costa** (RM 373470)
* **Tallyon De Cristo Lima** (RM 370710)

## 🏗️ Arquitetura do Sistema e Tecnologias

Para suportar a evolução da plataforma, a equipe projetou e implementou um back-end estruturado utilizando as seguintes tecnologias e padrões arquiteturais:

* **Ambiente de Execução:** `Node.js`, garantindo processamento assíncrono e eficiente orientado a eventos.
* **Framework Web:** `Fastify`. Escolhido por sua performance superior em comparação a outras alternativas de mercado, apresentando baixo overhead, arquitetura baseada em plugins e validação nativa de esquemas com JSON Schema, otimizando a segurança e a velocidade de resposta da API.
* **Persistência de Dados:** Banco de dados relacional `PostgreSQL`. Optou-se por uma modelagem relacional sólida e bem estruturada para assegurar a integridade referencial dos dados, consistência transacional e suporte eficiente a consultas complexas. A estrutura foi desenhada para evitar soluções não robustas, preparando a aplicação para futuras expansões multiusuário.
* **Segurança:** Utilização da biblioteca `Bcryptjs` para criptografar as senhas dos usuários no banco de dados.
* **Isolamento e Conteinerização:** `Docker` e `Docker Compose` são empregados para empacotar a aplicação Fastify e o serviço de banco de dados em contêineres independentes. Isso garante a paridade absoluta entre os ambientes de desenvolvimento, homologação e produção.
* **CI/CD & Deploy:** Automação completa via `GitHub Actions`, acionando pipelines de validação sintática (linting) e execução automática de testes a cada commit/pull request. O deploy e a hospedagem do backend foram automatizados utilizando a plataforma `Render`.
* **Qualidade de Código:** Testes unitários utilizando `Vitest`, garantindo cobertura superior a 20% do código-fonte, com foco especial nos fluxos críticos de negócio (criação, modificação e remoção de posts).

## 📖 Documentação das APIs (Endpoints REST)

| Método HTTP | Endpoint | Descrição | Perfil Alvo |
| :--- | :--- | :--- | :--- |
| `GET` | `/posts` | Lista de Posts da página principal. Permite a visualização simplificada das publicações. | Alunos / Geral |
| `GET` | `/posts/:id` | Leitura detalhada de post específico por meio do seu ID. | Alunos / Geral |
| `POST` | `/posts` | Criação de novas postagens. Aceita título, conteúdo e autor no corpo da requisição. | Professores / Docentes |
| `PUT` | `/posts/:id` | Edição completa ou parcial de uma postagem existente. | Professores / Docentes |
| `DELETE` | `/posts/:id` | Exclusão definitiva de uma postagem específica baseada no ID. | Professores / Docentes |
| `GET` | `/posts/search` | Busca de posts por palavras-chave via query string no título ou conteúdo. | Todos |
| `POST` | `/usuarios` | Cadastrar um novo usuário no sistema. | Alunos / Geral |
| `POST` | `/usuarios/signin` | Login do usuário na aplicação. | Alunos / Geral |
| `GET` | `/usuarios/listar` | Listar todos os usuários cadastrados. | Alunos / Geral |

## 🧠 Experiências e Desafios Enfrentados

A transição de um modelo de desenvolvimento *low-code* (plataforma OutSystems da Fase 1) para uma arquitetura programática nativa com Node.js e Fastify representou uma evolução técnica significativa para a equipe:

* **Mudança de Paradigma:** Abandonar as abstrações visuais exigiu um esforço coordenado para desenhar manualmente o ciclo de vida das requisições HTTP, o mapeamento de rotas e o tratamento adequado de exceções.
* **Curva de Aprendizado do Fastify:** Superar o desafio técnico inicial de entender a arquitetura baseada em plugins assíncronos e encapsulamento de escopo do Fastify resultou em um código muito mais limpo e modular.
* **Modelagem e Escalabilidade:** O desenho do banco de dados relacional foi elaborado sob critérios rígidos de escalabilidade, garantindo índices adequados e relacionamentos bem delimitados para um cenário de tráfego nacional.
* **Cultura de Testes e Automação:** Atingir a cobertura mínima em testes unitários exigiu disciplina no uso de mocks para o banco de dados. Integrar essa suíte ao pipeline de CI/CD consolidou a importância de validações automatizadas para mitigar regressões durante o ciclo de desenvolvimento em equipe.

## 🔗 Links

* [Vídeo de apresentação do projeto](https://youtu.be/B1qlF5oFA4E) 

## ⚙️ Como Executar o Projeto (Localmente)

Para rodar o projeto na sua máquina, siga os passos abaixo. 

### Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:
* [Git](https://git-scm.com)
* [Node.js](https://nodejs.org/) (versão 18+ recomendada)
* [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

### Passo a Passo

1. **Clone o repositório:**
    git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git

2. **Acesse a pasta do projeto:**
    cd NOME_DO_REPOSITORIO

3. **Instale as dependências:**
    npm install

4. **Configure as Variáveis de Ambiente:**
Crie um arquivo `.env` na raiz do projeto, baseando-se no arquivo `.env.example` (se houver), ou adicione as credenciais do banco de dados:

    PORT=3000
    DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
    JWT_SECRET="sua_chave_secreta"

5. **Inicie o Banco de Dados com Docker:**
Isso irá baixar a imagem do PostgreSQL e subir um container em background.
    docker-compose up -d

6. **Execute as migrações do banco de dados (se aplicável):**
    npm run db:migrate

7. **Inicie o servidor de desenvolvimento:**
    npm run dev

A API estará disponível em `http://localhost:3000`.

### Rodando os Testes
Para executar a suíte de testes unitários com o Vitest e verificar a cobertura de código, utilize o comando:
    npm run test

Ou para ver a cobertura de código:
    npm run test:coverage
