
## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript no lado do servidor.
- **Express**: Framework web para Node.js que facilita a construção de APIs.
- **MongoDB**: Banco de dados NoSQL usado para armazenar dados das equipes e alunos.

## Instalação

1. **Clone o repositório:**
   ```bash
   git clone <URL-do-repositório>
   cd server

2. **Instale as dependências:**
   ```bash
   npm install

3. **Configure o banco de dados MongoDB:**
    Certifique-se de ter o MongoDB instalado e em execução. Você pode usar uma instância local ou um serviço em nuvem como o MongoDB Atlas.
4. **Configure as variáveis de ambiente**
    Você pode criar um arquivo .env para armazenar variáveis de ambiente, como a URI do banco de dados:
    ```perl
   MONGODB_URI=mongodb://<usuario>:<senha>@localhost:27017/<nome-do-banco>
PORT=8080

## Endpoints da API

### Equipes

- **GET /api/equipes**
  - Retorna uma lista de todas as equipes.

- **POST /api/equipes**
  - Cria uma nova equipe.
  - **Exemplo de corpo da requisição:**
    ```json
    {
        "nome": "Equipe 1",
        "membros": [
            {
                "nome": "Fulano",
                "turma": "101"
            },
            {
                "nome": "Fulana",
                "turma": "104"
            }
        ]
    }
    ```

### Alunos

- **GET /api/alunos**
  - Retorna uma lista de todos os alunos.

- **POST /api/alunos**
  - Cria um novo aluno.
  - **Exemplo de corpo da requisição:**
    ```json
    {
        "nome": "Fulano",
        "turma": "101"
    }
    ```

## Contribuição

Se você deseja contribuir para este projeto, sinta-se à vontade para abrir um pull request ou relatar problemas através do sistema de issues.
