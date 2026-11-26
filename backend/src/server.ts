import { criarApp } from './app';

//define a porta em que o server vai ser executado e cria a instacia da aplicação com todas as configurações e rotas
const PORTA = Number(process.env.PORT ?? 3333);
const app = criarApp();

//inicia o server na porta definida e exibe a mensagem no terminal, quando estiver funcional, mas casso der algum erro encerra o processo
app
  .listen({ port: PORTA })
  .then(() => console.log(`API em http://localhost:${PORTA}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });