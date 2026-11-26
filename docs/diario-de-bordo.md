# Diário de bordo

## Aula 1 — Teoria e fundação do back-end

- **O que fiz:**
  - Escrevi o `docs/planejamento.md`: tabelas e colunas, lista de rotas, tipos TypeScript.
  - Montei o back-end: TypeScript (`strict: true`), Fastify, Zod, Vitest e Prisma 6.19.3 com SQLite.
  - Modelei o banco no `schema.prisma` (Palavra e Partida, relação 1 para N) e criei a migration com `prisma migrate dev`.
  - Criei o seed com 21 palavras em 3 categorias (JavaScript, TypeScript e React), usando `upsert` para não duplicar.
  - Escrevi `types.ts`, `errors.ts` (classe `ErroApp`) e as funções puras `gerarMascara`, `calcularPontos` e `aplicarPalpite` em `src/game/regras.ts`, com TSDoc.
  - Escrevi 8 testes das regras do jogo e passei todos.
- **Onde travei e como resolvi:**
  - `Environment variable not found: DATABASE_URL`: o Prisma não carregava o `.env` por causa do `prisma.config.ts`. Resolvi instalando o `dotenv` e importando `dotenv/config`.
  - `@prisma/client did not initialize yet`: o generator `prisma-client` exige um `output`. Segui a orientação do professor e usei `--output ../generated/prisma`, importando o client dessa pasta.
  - O nome da coluna da palavra ficou `palavra` em vez de `texto`, e o seed falhou até eu alinhar os nomes e refazer a migration.
- **O que consultei :**
  - O enunciado e a colinha, e a orientação do professor sobre o `--output` do Prisma.
  - Utilizei um pouco de IA para poder rever alguns conceitos.

## Aula 2 — API completa, testes e início da interface

- **O que fiz:**
  - Escrevi as camadas do back-end: schemas do Zod (`partida.schemas.ts`), repositories (partidas e palavras), service (`criarPartida`, `buscarPartida`, `palpitar`, `ranking` e a função `paraEstado`, que garante que a palavra só sai da API quando a partida termina), controllers e o plugin de rotas do Fastify.
  - Montei `app.ts` com CORS, o prefixo `/api` e o `setErrorHandler` central (Zod → 400, `ErroApp` → 404/409, outros → 500) e o `server.ts`.
  - Testei as 4 rotas pelo HTTPie.
  - Escrevi 6 testes de API com `app.inject`, usando um banco só de testes (`test.db`) configurado em `vitest.config.mts` e `tests/setup-banco.ts`. Total: 14 testes passando.
  - Criei o front com Vite + React + TypeScript, configurei o proxy `/api`, copiei os tipos, escrevi o cliente da API e os componentes `Mascara`, `Vidas` e `Teclado`, as páginas `Inicio` e `Jogo` e o `App.tsx`. A partida ficou jogável na tela.
  - Fiz o commit do back-end.
- **Onde travei e como resolvi:**
  - `npx tsc` não encontrava o TypeScript: eu estava na pasta errada. Entrei em `backend`.
  - Import sem `from` no repository.
  - O campo `finalizadaEm` estava obrigatório no tipo do repository. Tornei opcional com `?`.
- **O que consultei (inclusive IA):**
  - O enunciado, a colinha e as mensagens de erro do terminal.

## Aula 3 — Interface final, documentação e entrega

- **O que fiz:**
  - Criei o componente `Ranking` e ligar o top 10 à tela inicial, com estados de carregamento e erro.
  - Separei a tela de fim (`Fim`), que mostra o resultado, a palavra revelada e os pontos.
  - Fiz o estilo da interface (tema preto com detalhes em vermelho, mensagens mais próximas do jogador, acerto e erro com visuais diferentes) e adicionei o teclado físico.
  - Criei um `package.json` na raiz com o `concurrently` para subir API e front com um comando.
  - Escrevi `docs/api.md`, `docs/decisoes.md` (4 decisões), o `README.md` e este diário.
- **Onde travei e como resolvi:**
  - O visual foi refeito algumas vezes até ficar do jeito que eu queria, trocando a paleta e os textos do CSS.
- **O que consultei (inclusive IA):**
  - O enunciado e a colinha.
  - Usei a IA para rever os arquivos .md para erros de português e verificações de conceitos.
