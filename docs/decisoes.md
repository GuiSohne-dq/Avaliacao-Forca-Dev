# Decisões técnicas — Forca Dev

## Decisão 1 — A palavra secreta fica só no servidor

- Contexto: o front precisa mostrar o progresso da partida, mas não pode permitir trapaça: qualquer dado enviado ao navegador pode ser lido na aba Network do DevTools.
- Decisão: a API devolve apenas a máscara (ex.: `PR_M_SE`). O campo `palavra` vem `null` enquanto o status for `em_andamento` e só é preenchido na vitória ou na derrota. Essa regra fica em um único ponto, a função `paraEstado` do service, por onde toda resposta de partida passa.
- Consequência: cada palpite exige uma requisição ao servidor, e o front depende da API para tudo. Em troca, o ranking é confiável e não há como descobrir a palavra antes do fim.

## Decisão 2 — Regras do jogo como funções puras, separadas do banco e do HTTP

- Contexto: as regras (RN01 a RN06) são o coração do jogo e precisam ser testadas com muitos casos: letra repetida, vitória, derrota, pontuação.
- Decisão: `gerarMascara`, `calcularPontos` e `aplicarPalpite` ficam em `src/game/regras.ts`, sem importar Prisma nem Fastify. Elas recebem um objeto simples (`PartidaJogo`) e devolvem um objeto novo, sem alterar o original. O service busca os dados, converte do formato do banco, chama a função e grava o resultado.
- Consequência: os testes das regras rodam em milissegundos e sem banco de dados. O custo é uma conversão extra no service (do registro do Prisma para `PartidaJogo` e de volta).

## Decisão 3 — Guardar só o essencial no banco e calcular o resto

- Contexto: uma partida tem informações que dependem umas das outras: vidas restantes dependem dos erros, e a máscara depende da palavra e das letras tentadas. Guardar tudo cria risco de os dados ficarem inconsistentes.
- Decisão: a tabela `partidas` guarda apenas `erros` e `letrasTentadas` (um texto como `"EPRSMA"`, já que o SQLite não tem tipo lista). `vidasRestantes` é calculado como `6 - erros`, e a `mascara` é gerada por `gerarMascara` a cada resposta.
- Consequência: não existe estado duplicado que possa divergir. Em contrapartida, as letras viram lista com `split('')` ao ler e voltam a texto com `join('')` ao gravar, e a máscara é recalculada em cada leitura (custo desprezível).

## Decisão 4 — Validação com Zod e tratamento central de erros

- Contexto: a API precisa devolver erros sempre no formato `{ erro }`, com o status correto (400, 404, 409), vindos de lugares diferentes: validação de entrada, regras do jogo e partida inexistente.
- Decisão: os dados de entrada são validados com Zod nos controllers (`.parse()` lança um `ZodError`), e as falhas de regra lançam a classe `ErroApp`, que carrega a mensagem e o status. Um único `setErrorHandler` no `app.ts` transforma cada tipo de erro na resposta certa; qualquer erro inesperado vira 500 genérico, sem vazar detalhes.
- Consequência: handlers curtos e sem repetição, e o formato de erro é garantido em um só lugar. Todo erro novo precisa ser um `ZodError` ou um `ErroApp` para receber o status correto.