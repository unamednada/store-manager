## Store Manager

Projeto back-end, API RESTful desenvolvida em modelo MSC, com CRUD completo em node.js + express (com express-rescue), banco de dados MySQL. Foram utilizados schemas e middlewares para a segurança e validação juntamente com o Joi.

Sistema de gerenciamento de vendas com autenticação e autorização.

Esta API contém testes unitários para garantir a qualidade do resultado. Cobertura mínima de 60% de código.

**LISTA DE ENDPOINTS**:

  * `/sales`:
    - `GET /`;
    - `POST /`;
    - `GET /<id>`;
    - `DELETE /<id>`;
    - `PUT /<id>`;

  * `/products`:
    - `GET /`;
    - `POST /`;
    - `GET /<id>`;
    - `DELETE /<id>`;
    - `PUT /<id>`;

Projeto incentivado pela Trybe, no módulo de back-end do curso de Desenvolvimento Web.

---

## Habilidades

    - Planejar e Desenvolver uma API RESTful em camadas (MSC);

    - Conhecimentos em JS, SQL, arquitetura e padrões de projeto;

---

### Protótipo do projeto

![Project Gif](./out.gif)

### 🗒 PARA RODAR O STORE MANAGER LOCALMENTE:

1. Clone o repositório
  * `git clone git@github.com:unamednada/store-manager.git`
  * Entre na pasta do repositório que você acabou de clonar:
    * `cd store-manager`

2. Instale as dependências e inicialize o projeto
  * Instale as dependências:
    * `npm install`

3. Certifique-se de que seu servidor MySQL está rodando, senão inicialize
  * Verifique se o serviço está online:
    * `sudo systemctl status mysql`
  * Caso esteja offline, inicie o serviço:
    * `sudo systemctl start mysql`

4. Faça a migração do banco de dados para sua máquina local
  * Abra seu terminal ou o seu workbench e faça a query contida no arquivo:
    * `StoreManager.sql`

5. Crie um arquivo chamado `.env` na raiz do projeto contendo as seguintes variáveis:
  * `PORT`: a porta em que a API vai receber as requisições
  * `MYSQL_HOST`: o hospedeiro do banco de dados, no caso da máquina local, o `localhost`
  * `MYSQL_USER`: seu usuário do MySQL
  * `MYSQL_PASSWORD`: a senha para acessar o MySQL
  * `MYSQL_DB_NAME`: o nome do banco de dados que criamos no passo 3, `StoreManager`

3. Rode o servidor e vá até `http://localhost:3001` no seu navegador
  * Verifique que a sua porta 3001 está livre no localhost:
    * `sudo ss -plnut`
  * Agora, execute o servidor
    * `npm start`

---

### 🗒 PARA CONTRIBUIR COM O STORE MANAGER:

1. Clone o repositório
  * `git clone git@github.com:unamednada/store-manager.git`
  * Entre na pasta do repositório que você acabou de clonar:
    * `cd store-manager`

2. Instale as dependências e inicialize o projeto
  * Instale as dependências:
    * `npm install`

3. Crie uma branch a partir da branch `master`
  * Verifique que você está na branch `master`
    * Exemplo: `git branch`
  * Se não estiver, mude para a branch `master`
    * Exemplo: `git checkout master`
  * Agora, crie uma branch onde você vai guardar os `commits` do seu projeto
    * Você deve criar uma branch no seguinte formato: `nome-de-usuario-feat-descricao`
    * Exemplo: `git checkout -b mariazinha-feat-mobile-design`

4. Adicione as mudanças ao _stage_ do Git e faça um `commit`
  * Verifique que as mudanças ainda não estão no _stage_
    * Exemplo: `git status` (devem aparecer listados os novos arquivos em vermelho)
  * Adicione o novo arquivo ao _stage_ do Git
      * Exemplo:
        * `git add .` (adicionando todas as mudanças - _que estavam em vermelho_ - ao stage do Git)
        * `git status` (devem aparecer listados os arquivos em verde)
  * Faça o `commit` inicial
      * Exemplo:
        * `git commit -m 'Feat: mobile responsive design'` (fazendo o primeiro commit)
        * `git status` (deve aparecer uma mensagem tipo _nothing to commit_ )

5. Adicione a sua branch com o novo `commit` ao repositório remoto
  * Usando o exemplo anterior: `git push -u origin mariazinha-feat-mobile-design`

6. Crie um novo `Pull Request` _(PR)_
  * Vá até a página de _Pull Requests_ do [repositório no GitHub](https://github.com/unamednada/store-manager/pulls)
  * Clique no botão verde _"New pull request"_
  * Clique na caixa de seleção _"Compare"_ e escolha a sua branch **com atenção**
  * Adicione uma descrição para o _Pull Request_, um título que o identifique, e clique no botão verde _"Create pull request"_. Crie da seguinte forma: `[MARIAZINHA][FEAT]Mobile design`
  * Adicione uma descrição para o _Pull Request_, um título claro que o identifique, e clique no botão verde _"Create pull request"_
  * **Não se preocupe em preencher mais nada por enquanto!**
  * Volte até a [página de _Pull Requests_ do repositório](https://github.com/unamednada/store-manager/pulls) e confira que o seu _Pull Request_ está criado

---

**⚠️ Aguarde review do seu PR ⚠️**

Depois que as mudanças forem revisadas, elas poderão ser incorporadas, ou você pode ter que fazer uma mudança pra que elas sejam revisadas novamente. Fique de olho!

---

### Testes Unitários e Cobertura

Para garantir que sua alteração não interfere no funcionamento da API, antes de subir suas modificações, lembre-se de testar as camadas e caso faça mais testes ou modifique os testes atuais, certifique-se de que a cobertura está acima do mínimo:

```bash
npm run test:mocha
npm run test
```

### Linter

Para garantir a qualidade do código, vamos utilizar neste projeto os linters `ESLint` e `StyleLint`.
Assim o código estará alinhado com as boas práticas de desenvolvimento, sendo mais legível
e de fácil manutenção! Para rodá-los localmente no projeto, execute os comandos abaixo:

```bash
npm run lint
npm run lint:styles
```

Quando é executado o comando `npm run lint:styles`, ele irá avaliar se os arquivos com a extensão `CSS` estão com o padrão correto.

Quando é executado o comando `npm run lint`, ele irá avaliar se os arquivos com a extensão `JS` e `JSX` estão com o padrão correto.

## Depois de terminar o desenvolvimento

Para **"entregar"** suas mudanças, siga os passos a seguir:

* Vá até a página **DO SEU** _Pull Request_, adicione a label de _"code-review"_ e marque seus colegas
  * No menu à direita, clique no _link_ **"Labels"** e escolha a _label_ **code-review**
  * No menu à direita, clique no _link_ **"Assignees"** e escolha **o seu usuário**

⚠ Lembre-se que garantir que todas as _issues_ comentadas pelo **Lint** estão resolvidas! ⚠

---