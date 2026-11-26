import type { FastifyReply, FastifyRequest } from 'fastify';
import { idSchema, novaPartidaSchema, palpiteSchema } from '../schemas/partida.schemas';
import * as service from '../services/partidas.service';

/** POST /api/partidas: cria uma partida nova. */
export async function criar(req: FastifyRequest, reply: FastifyReply) {
  const { jogador } = novaPartidaSchema.parse(req.body);
  const partida = await service.criarPartida(jogador);
  return reply.status(201).send(partida);
}

/** GET /api/partidas/:id: devolve o estado da partida. */
export async function buscar(req: FastifyRequest) {
  const { id } = idSchema.parse(req.params);
  return service.buscarPartida(id);
}

/** POST /api/partidas/:id/palpites: aplica um palpite. */
export async function palpitar(req: FastifyRequest) {
  const { id } = idSchema.parse(req.params);
  const { letra } = palpiteSchema.parse(req.body);
  return service.palpitar(id, letra);
}

/** GET /api/ranking: top 10 vitórias. */
export async function ranking() {
  return service.ranking();
}