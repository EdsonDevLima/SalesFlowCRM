# Atlas CRM

Sistema CRM dividido em dois projetos:

- `atlas-crm-front`: interface web em React.
- `atlas-crm-api`: API REST em NestJS com MySQL.

O projeto cobre autenticação, dashboard, produtos, clientes, vendas, notificações e upload de imagens de produtos.

## Instalador

Use o instalador na raiz do monólito antes de qualquer outro passo:

### Linux/macOS

```bash
./install.sh
```

### Windows

```bat
install.bat
```

Os instaladores configuram as dependências do backend e do frontend automaticamente.

## Estrutura do projeto

```text
.
├── atlas-crm-front/   # Frontend React + Vite
├── atlas-crm-api/     # Backend NestJS + TypeORM
└── uploads/           # Arquivos enviados pela aplicação
```

## Tecnologias utilizadas

### Frontend

- React `19.1.1`
- React DOM `19.1.1`
- React Router DOM `7.9.6`
- Vite `7.1.7`
- TypeScript `5.9.3`
- Axios `1.13.2`
- Recharts `3.6.0`
- React Toastify `11.0.5`
- React Icons `5.5.0`
- ESLint `9.36.0`

### Backend

- NestJS `11.x`
- TypeORM `0.3.27`
- MySQL2 `3.15.3`
- JWT com `@nestjs/jwt` `11.0.1`
- Bcrypt `6.0.0`
- TypeScript `5.7.3`
- ESLint `9.18.0`
- Prettier `3.4.2`

## Requisitos

- Node.js `20+`
- npm `10+`
- Banco MySQL acessível localmente ou por URL remota

Observação: o frontend usa Vite `7`, então vale trabalhar com uma versão moderna do Node. Para evitar incompatibilidade, use Node `20.19+` ou `22+`.

## Variáveis de ambiente

Arquivo central do monólito: `.env`

```env
PORT=3000
DATABASE_HOST=0.0.0.0
DATABASE_PORT=3306
DATABASE_NAME=atlascrm
DATABASE_USERNAME=root
DATABASE_PASSWORD=root
SECRET_JWT=sua_chave_jwt
SERVER_API_KEY=sua_api_key_interna
VITE_API_URL=http://localhost:3000
VITE_SERVER_API_KEY=sua_api_key_interna
```

Notas:

- O frontend agora lê variáveis da raiz do monólito via `Vite envDir`.
- O backend agora procura primeiro `../.env` e mantém fallback para `.env` local.
- O arquivo `.env` da raiz pode ser versionado no repositório.
- O backend faz `synchronize: true`, então o TypeORM sincroniza as tabelas automaticamente ao subir a aplicação. Isso é prático em desenvolvimento, mas pede cuidado em produção.

## Como instalar

Repita o instalador da raiz sempre que precisar preparar o projeto em uma nova máquina:

### Linux/macOS

```bash
./install.sh
```

### Windows

```bat
install.bat
```

## Como rodar localmente

### 1. Subir a API

```bash
cd atlas-crm-api
npm run start:dev
```

A API sobe por padrão em `http://localhost:3000`.

### 2. Subir o frontend

Em outro terminal:

```bash
cd atlas-crm-front
npm run dev
```

O frontend sobe normalmente em `http://localhost:5173`.

### 3. Garantir a comunicação entre os projetos

No arquivo `.env` da raiz, configure:

```env
VITE_API_URL=http://localhost:3000
VITE_SERVER_API_KEY=sua_api_key_interna
```

## Scripts disponíveis

### Frontend

Dentro de `atlas-crm-front`:

```bash
npm run dev
```

Inicia o servidor de desenvolvimento com HMR.

```bash
npm run build
```

Gera a build de produção.

```bash
npm run preview
```

Serve localmente a build gerada.

```bash
npm run lint
```

Executa o lint do frontend.

### Backend

Dentro de `atlas-crm-api`:

```bash
npm run start
```

Inicia a API em modo padrão.

```bash
npm run start:dev
```

Inicia a API com watch para desenvolvimento.

```bash
npm run start:debug
```

Inicia a API com debug e watch.

```bash
npm run build
```

Compila o projeto NestJS.

```bash
npm run start:prod
```

Executa a versão compilada.

```bash
npm run lint
```

Executa o lint do backend.

```bash
npm run format
```

Formata arquivos `src` e `test` com Prettier.

```bash
npm run test:e2e
```

Roda testes end-to-end.

## Fluxo recomendado para desenvolvimento local

1. Configure o `.env` da raiz com as variáveis de frontend e backend.
2. Suba o banco MySQL.
3. Rode `./install.sh` ou `install.bat`.
4. Inicie a API com `npm run start:dev`.
5. Confirme `VITE_API_URL=http://localhost:3000` no `.env` da raiz.
6. Inicie o frontend com `npm run dev`.
7. Acesse a aplicação no navegador.

## Funcionalidades identificadas no projeto

- Autenticação com login, cadastro e verificação de token
- Dashboard protegido por rota autenticada
- Cadastro, edição, listagem e remoção de produtos
- Upload e exibição de imagens de produtos
- Gestão de clientes
- Gestão de vendas
- Relatórios na interface
- Notificações

## Rotas e pontos importantes

### Frontend

Rotas principais:

- `/`
- `/dashboard`
- `/products`
- `/customers`
- `/sales`

### Backend

Endpoints identificados no código:

- `/auth/login`
- `/auth/register`
- `/auth/verify-token`
- `/products/create`
- `/products/all`
- `/products/:id`
- `/products/update`
- `/products/image/:filename`

Outros módulos também existem no backend, como vendas, usuários e notificações.

## Uploads e arquivos estáticos

- As imagens de produtos são servidas pela API em `/products/image/:filename`.
- O backend procura os arquivos dentro de `uploads/products`.
- Se estiver rodando tudo localmente, confirme que essa pasta existe e que a aplicação tem permissão para gravar nela.

## Boas práticas para o ambiente local

- Não suba credenciais reais para o repositório.
- Ajuste o `.env` do frontend para apontar para a API local durante desenvolvimento.
- Use `npm run lint` antes de fechar alterações.
- Use `npm run test` no backend ao mexer em regras de negócio.

## Sugestão de setup rápido

```bash
cd atlas-crm-api
npm install
npm run start:dev
```

Em outro terminal:

```bash
cd atlas-crm-front
npm install
npm run dev
```

## Melhorias futuras para a documentação

- Adicionar exemplos completos de payloads da API
- Documentar modelo de banco e entidades
- Incluir coleção do Insomnia ou Postman
- Adicionar um `docker-compose.yml` para banco, API e frontend
- Definir versão de Node em `.nvmrc`
