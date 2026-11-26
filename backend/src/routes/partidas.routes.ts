import type { FastifyInstance } from 'fastify';
import * as controller from '../controllers/partidas.controller';

// plugin que registra as 4 rotas do jogo, sendo post(criar partida), get(buscar partidade pelo id), post(enviar um palpite) e get(consulta o ranking dos jogadores)
export async function rotasPartidas(app: FastifyInstance) {
  app.post('/partidas', controller.criar);
  app.get('/partidas/:id', controller.buscar);
  app.post('/partidas/:id/palpites', controller.palpitar);
  app.get('/ranking', controller.ranking);
}