import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { criarApp } from '../src/app';
import { prisma } from '../src/database/prisma';
import type { EstadoPartida, ItemRanking } from '../src/types';

const app = criarApp();

// Cria partida com a API devolvendo o estado que começou
async function novaPartida(jogador = 'ana') {
  const res = await app.inject({ method: 'POST', url: '/api/partidas', payload: { jogador } });
  return res.json<EstadoPartida>();
}

//Envia o palpite pela API
function palpitar(id: number, letra: string) {
  return app.inject({ method: 'POST', url: `/api/partidas/${id}/palpites`, payload: { letra } });
}

describe('API', () => {
  beforeAll(async () => {
    await prisma.partida.deleteMany(); 
    await prisma.palavra.deleteMany();
    await prisma.palavra.create({ data: { palavra: 'PROMISE', categoria: 'JavaScript' } });
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('recusa apelido curto com 400', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/partidas', payload: { jogador: 'a' } });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toHaveProperty('erro');
  });

  it('cria partida com 201 e sem revelar a palavra (RN07)', async () => {
    const partida = await novaPartida();
    expect(partida.mascara).toBe('_______');
    expect(partida.vidasRestantes).toBe(6);
    expect(partida.palavra).toBeNull();
  });

  it('devolve 404 para partida inexistente', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/partidas/999999' });
    expect(res.statusCode).toBe(404);
  });

  it('recusa letra inválida com 400 (RN02)', async () => {
    const { id } = await novaPartida();
    const res = await palpitar(id, 'ab');
    expect(res.statusCode).toBe(400);
  });

  it('letra repetida devolve 409 e não tira vida (RN03)', async () => {
    const { id } = await novaPartida();
    await palpitar(id, 'Z'); 
    const repetida = await palpitar(id, 'Z');
    expect(repetida.statusCode).toBe(409);

    const estado = await app.inject({ method: 'GET', url: `/api/partidas/${id}` });
    expect(estado.json<EstadoPartida>().vidasRestantes).toBe(5);
  });

  it('vitória revela a palavra, dá 95 pontos e entra no ranking', async () => {
    const { id } = await novaPartida('campea');
    let ultimo = await palpitar(id, 'P');
    for (const letra of ['R', 'O', 'M', 'I', 'S', 'E']) {
      ultimo = await palpitar(id, letra);
    }
    const estado = ultimo.json<EstadoPartida>();
    expect(estado.status).toBe('vitoria');
    expect(estado.palavra).toBe('PROMISE');
    expect(estado.pontos).toBe(95);

    const ranking = await app.inject({ method: 'GET', url: '/api/ranking' });
    expect(ranking.json<ItemRanking[]>()[0].jogador).toBe('campea');
  });
});