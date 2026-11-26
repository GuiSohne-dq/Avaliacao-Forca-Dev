import { execSync } from 'node:child_process';

//cria a tabela de acordo com schema
export default function setup() {
  execSync('npx prisma db push --skip-generate', {
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    stdio: 'inherit',
  });
}