# Planejamento — Forca Dev

Back-end: TypeScript + Fastify + Prisma 6.19.3 (SQLite) + Zod + Vitest.

## 1. Tabelas e colunas

Relação: **Palavra (1) — (N) Partida**. Não existe tabela de ranking: ele é uma consulta sobre partidas.

### Palavra (`palavras`)

| Coluna | Tipo Prisma | Observação |
|---|---|---|
| id | Int | chave primária, autoincrement |
| palavra | String | único |
| categoria | String | |

### Partida (`partidas`)

| Coluna | Tipo Prisma | Observação |
|---|---|---|
| id | Int | chave primária, autoincrement |
| jogador | String | apelido, 3 a 20 caracteres (validado na API) |
| palavraId | Int | chave estrangeira para Palavra (`palavra_id`) |
| letrasTentadas | String | padrão `""`, ex.: `"EPRSMA"` (`letras_tentadas`) |
| erros | Int | padrão `0` |
| status | String | padrão `"em_andamento"` |
| pontos | Int | padrão `0` |
| criadaEm | DateTime | padrão `now()` (`criada_em`) |
| finalizadaEm | DateTime? | opcional, preenchida ao fim (`finalizada_em`) |

### Calculado, não guardado

- `vidasRestantes` = 6 − `erros`
- `mascara` = `gerarMascara(palavra, letrasTentadas)`
- `letrasTentadas` (array) = `letrasTentadas.split('')`
- Ranking = partidas com `status = 'vitoria'`, ordenadas por `pontos` (desc) e `finalizadaEm` (asc), limite 10

## 2. Rotas

Todo erro responde no formato `{ "erro": "mensagem" }`.

| Método e rota | Corpo | Sucesso | Erros |
|---|---|---|---|
| `POST /api/partidas` | `{ "jogador": "ana" }` | 201 + `EstadoPartida` | 400: apelido fora de 3 a 20 caracteres |
| `GET /api/partidas/:id` | nenhum | 200 + `EstadoPartida` | 404: partida não existe |
| `POST /api/partidas/:id/palpites` | `{ "letra": "a" }` | 200 + `EstadoPartida` | 400: letra inválida (RN02) · 404: partida não existe · 409: letra já tentada (RN03) ou partida encerrada (RN04) |
| `GET /api/ranking` | nenhum | 200 + `ItemRanking[]` | nenhum |

## 3. Tipos TS principais

```ts
export type StatusPartida = 'em_andamento' | 'vitoria' | 'derrota';

export interface EstadoPartida {
  id: number;
  jogador: string;
  categoria: string;
  mascara: string;            // ex.: "PR_M_SE"
  letrasTentadas: string[];   // ex.: ["E", "P", "R"]
  vidasRestantes: number;     // 0 a 6
  status: StatusPartida;
  pontos: number;             // 0 enquanto não houver vitória
  palavra: string | null;     // null enquanto status === 'em_andamento'
}

export interface ItemRanking {
  jogador: string;
  pontos: number;
  palavra: string;
  finalizadaEm: string;       // data ISO
}

// usado só pelas regras do jogo (sem Prisma)
export interface PartidaJogo {
  palavra: string;
  letrasTentadas: string[];
  erros: number;
  status: StatusPartida;
  pontos: number;
}
```

## 4. Ordem de trabalho

1. Criar `backend/`, instalar Fastify, Zod, Prisma, Vitest e TypeScript; configurar `tsconfig.json` com `strict: true`.
2. Escrever o `schema.prisma` (Palavra e Partida) e rodar `prisma migrate dev --name init`.
3. Criar `src/database/prisma.ts` e o seed com 21 palavras em 3 categorias (`npm run seed`).
4. Escrever `src/types.ts` e `src/errors.ts`.
5. Escrever as funções puras em `src/game/regras.ts` (`gerarMascara`, `calcularPontos`, `aplicarPalpite`) com TSDoc.
6. Escrever os testes das regras (`tests/regras.test.ts`).
7. Aula 2: schemas Zod, repositories, service, controllers e rotas, com `setErrorHandler` central.
8. Aula 2: testes da API com `app.inject` e início do front-end.