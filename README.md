# UIGen

Gerador de componentes React com IA e preview em tempo real.

## Pré-requisitos

- Node.js 18+
- npm

## Configuração

1. **Opcional** Edite o `.env` e adicione sua chave da API Anthropic:

```
ANTHROPIC_API_KEY=sua-chave-aqui
```

O projeto funciona sem a chave. Nesse caso, componentes estáticos de demonstração são retornados no lugar de geração com IA.

2. Instale as dependências e inicialize o banco de dados:

```bash
npm run setup
```

Esse comando irá:

- Instalar todas as dependências
- Gerar o cliente Prisma
- Executar as migrações do banco de dados

## Executando

### Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

## Como usar

1. Crie uma conta ou continue como usuário anônimo
2. Descreva o componente React que deseja criar no chat
3. Visualize os componentes gerados no preview em tempo real
4. Alterne para a aba Código para ver e editar os arquivos gerados
5. Continue iterando com a IA para refinar seus componentes

## Funcionalidades

- Geração de componentes com IA (Claude)
- Preview ao vivo com hot reload
- Sistema de arquivos virtual (nada é escrito em disco)
- Editor de código com syntax highlighting
- Persistência de projetos para usuários registrados
- Exportação do código gerado

## Tecnologias

- Next.js 15 com App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma com SQLite
- Anthropic Claude AI
- Vercel AI SDK
