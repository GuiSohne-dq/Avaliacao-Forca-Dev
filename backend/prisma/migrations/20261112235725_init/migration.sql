-- CreateTable
CREATE TABLE "palavras" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "palavra" TEXT NOT NULL,
    "categoria" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "partidas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jogador" TEXT NOT NULL,
    "palavraId" INTEGER NOT NULL,
    "letrasTentadas" TEXT NOT NULL DEFAULT '',
    "erros" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'em_andamento',
    "pontos" INTEGER NOT NULL DEFAULT 0,
    "criadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizadaEm" DATETIME,
    CONSTRAINT "partidas_palavraId_fkey" FOREIGN KEY ("palavraId") REFERENCES "palavras" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "palavras_palavra_key" ON "palavras"("palavra");
