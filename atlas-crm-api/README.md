# Atlas CRM API

API REST do Atlas CRM construída com NestJS, TypeORM e MySQL.

## Instalador

A API faz parte do monólito e deve ser instalada pela raiz do projeto:

```bash
./install.sh
```

No Windows:

```bat
install.bat
```

## Comandos principais

```bash
npm install
npm run start
npm run start:dev
npm run start:debug
npm run build
npm run start:prod
npm run lint
npm run format
```

## Variáveis de ambiente

A API passa a usar primeiro o `.env` da raiz do monólito. Ajuste `../.env` com:

```env
PORT=3000
DATABASE_HOST=0.0.0.0
DATABASE_PORT=3306
DATABASE_NAME=atlascrm
DATABASE_USERNAME=root
DATABASE_PASSWORD=root
SECRET_JWT=sua_chave_jwt
SERVER_API_KEY=sua_api_key_interna
```

## Documentação completa

Veja o README da raiz do projeto para stack, versões, endpoints principais e passo a passo para rodar localmente.
