import { defineConfig } from 'vitest/config';

//Define o banco só de teste, cria a tabela antes dos testes e usa os mesmos arquivos do DB
export default defineConfig({
  test: {
    env: { DATABASE_URL: 'file:./test.db' }, 
    globalSetup: './tests/setup-banco.ts', 
    fileParallelism: false,
  },
})