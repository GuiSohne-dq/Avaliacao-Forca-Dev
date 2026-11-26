import Fastify, { type FastifyError } from 'fastify';
import cors from '@fastify/cors';
import { ZodError } from 'zod';
import { rotasPartidas } from './routes/partidas.routes';
import { ErroApp } from './errors';

//configura e cria a aplicação fastify, após registra o cors e as rotas de aplicação
export function criarApp() {
  const app = Fastify();
  app.register(cors);
  app.register(rotasPartidas, { prefix: '/api' });

  //define algum tratamento centralizado para os erros da aplicação, retornand as repostas certas conforme o erro achado
  app.setErrorHandler((err: FastifyError, _req, reply) => {
    if (err instanceof ZodError) {
      return reply.status(400).send({ erro: 'Dados inválidos', detalhes: err.issues });
    }
    if (err instanceof ErroApp) {
      return reply.status(err.status).send({ erro: err.message });
    }
    if (err.statusCode && err.statusCode < 500) {
      return reply.status(err.statusCode).send({ erro: err.message }); // ex.: JSON malformado
    }
    console.error(err);
    return reply.status(500).send({ erro: 'Erro interno' });
  });

  //define a resposta para as requisições em rotas inexistentes
  app.setNotFoundHandler((_req, reply) =>
    reply.status(404).send({ erro: 'Rota não encontrada' }),
  );

  //retorna a aplicação
  return app;
}