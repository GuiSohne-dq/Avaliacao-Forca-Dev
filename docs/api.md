# API — Forca Dev

URL base em desenvolvimento: `http://localhost:3333`. Todas as rotas começam com `/api`.

- Corpo e respostas em JSON.
- Todo erro responde no formato `{ "erro": "mensagem" }`.
- A palavra secreta só é enviada quando a partida termina (`palavra` é `null` enquanto o status for `em_andamento`).

## Objeto `EstadoPartida`

Devolvido por `POST /api/partidas`, `GET /api/partidas/:id` e `POST /api/partidas/:id/palpites`.

| Campo | Tipo | Descrição |
|---|---|---|
| id | number | identificador da partida |
| jogador | string | apelido informado |
| categoria | string | categoria da palavra sorteada |
| mascara | string | palavra com `_` nas letras ainda não descobertas (ex.: `PR_M_SE`) |
| letrasTentadas | string[] | letras já tentadas, em maiúscula, na ordem dos palpites |
| vidasRestantes | number | de 0 a 6 |
| status | string | `em_andamento`, `vitoria` ou `derrota` |
| pontos | number | 0 enquanto não houver vitória |
| palavra | string \| null | `null` enquanto `status` for `em_andamento` |

---

## POST /api/partidas

Cria uma partida: o servidor sorteia uma palavra e devolve o estado inicial.

**Corpo**

```json
{ "jogador": "ana" }
```

`jogador`: texto de 3 a 20 caracteres (espaços nas pontas são removidos).

**Sucesso: 201 Created**

```json
{
  "id": 7,
  "jogador": "ana",
  "categoria": "JavaScript",
  "mascara": "_______",
  "letrasTentadas": [],
  "vidasRestantes": 6,
  "status": "em_andamento",
  "pontos": 0,
  "palavra": null
}
```

**Erros**

| Status | Quando acontece |
|---|---|
| 400 | `jogador` ausente ou fora de 3 a 20 caracteres; JSON malformado |
| 500 | não há palavras cadastradas no banco (`Nenhuma palavra cadastrada`) |

---

## GET /api/partidas/:id

Devolve o estado atual de uma partida.

**Corpo:** nenhum.

**Sucesso: 200 OK**

```json
{
  "id": 7,
  "jogador": "ana",
  "categoria": "JavaScript",
  "mascara": "PR_M_SE",
  "letrasTentadas": ["E", "P", "R", "S", "M", "A"],
  "vidasRestantes": 5,
  "status": "em_andamento",
  "pontos": 0,
  "palavra": null
}
```

**Erros**

| Status | Quando acontece |
|---|---|
| 400 | `:id` não é um número inteiro positivo (ex.: `/api/partidas/abc`) |
| 404 | não existe partida com esse id (`Partida não encontrada`) |

---

## POST /api/partidas/:id/palpites

Aplica um palpite de uma letra. O servidor valida, aplica as regras, grava no banco e devolve o novo estado.

**Corpo**

```json
{ "letra": "a" }
```

`letra`: exatamente uma letra de A a Z. Minúsculas são convertidas para maiúsculas pelo servidor.

**Sucesso: 200 OK** (partida em andamento, letra errada)

```json
{
  "id": 7,
  "jogador": "ana",
  "categoria": "JavaScript",
  "mascara": "PR_M_SE",
  "letrasTentadas": ["E", "P", "R", "S", "M", "A"],
  "vidasRestantes": 5,
  "status": "em_andamento",
  "pontos": 0,
  "palavra": null
}
```

**Sucesso: 200 OK** (último palpite certo, vitória: a palavra é revelada e os pontos calculados)

```json
{
  "id": 7,
  "jogador": "ana",
  "categoria": "JavaScript",
  "mascara": "PROMISE",
  "letrasTentadas": ["E", "P", "R", "S", "M", "A", "O", "I"],
  "vidasRestantes": 5,
  "status": "vitoria",
  "pontos": 85,
  "palavra": "PROMISE"
}
```

Pontos na vitória = vidas restantes × 10 + letras distintas da palavra × 5. Na derrota, `status` é `derrota`, `pontos` é 0 e `palavra` também é revelada.

**Erros**

| Status | Quando acontece | Mensagem |
|---|---|---|
| 400 | `letra` ausente, com mais de um caractere, número, vazia ou fora de A–Z (ex.: `"ab"`, `"1"`, `""`, `"ç"`) ou `:id` inválido | `Dados inválidos` (com `detalhes`) |
| 404 | não existe partida com esse id | `Partida não encontrada` |
| 409 | a letra já foi tentada nessa partida (não consome vida) | `Letra já tentada` |
| 409 | a partida já terminou (vitória ou derrota) | `Partida encerrada` |

Ordem de verificação: formato do pedido (400), existência da partida (404), partida encerrada (409) e letra repetida (409).

---

## GET /api/ranking

Devolve as 10 melhores vitórias: ordenadas por pontos (maior primeiro); em caso de empate, quem terminou primeiro fica à frente.

**Corpo:** nenhum.

**Sucesso: 200 OK**

```json
[
  {
    "jogador": "ana",
    "pontos": 95,
    "palavra": "PROMISE",
    "finalizadaEm": "2026-11-26T22:30:15.123Z"
  },
  {
    "jogador": "bia",
    "pontos": 80,
    "palavra": "HOOK",
    "finalizadaEm": "2026-11-26T22:41:02.456Z"
  }
]
```

Sem vitórias registradas, devolve `[]`. `finalizadaEm` é uma data no formato ISO 8601.

**Erros:** nenhum esperado (falha inesperada responde 500).

---

## Erros gerais

| Status | Quando acontece | Corpo |
|---|---|---|
| 400 | dado inválido (Zod) | `{ "erro": "Dados inválidos", "detalhes": [ ... ] }` |
| 404 | rota inexistente | `{ "erro": "Rota não encontrada" }` |
| 500 | erro inesperado no servidor | `{ "erro": "Erro interno" }` |

O campo `detalhes` no erro 400 lista cada problema encontrado pela validação (campo e motivo).