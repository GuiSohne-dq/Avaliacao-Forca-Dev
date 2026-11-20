import { ErroApp } from "../errors";
import { VIDAS_INICIAIS, gerarMascara } from "../game/regras";
import * as palavrasRepo from '../repositories/palavras.repository'
import * as partidasRepo from '../repositories/partidas.repository'
import type { EstadoPartida, StatusPartida } from "../types";

type PartidaComPalavra = NonNullable<
    Awaited<ReturnType<typeof partidasRepo.buscarPartidaPorId>>
>

function paraEstado(partida: PartidaComPalavra): EstadoPartida{
    const tentadas = partida.letrasTentadas.split('')
    const status = partida.status as StatusPartida
    const textoPalavra = partida.palavra.palavra

    return {
        id: partida.id,
        jogador: partida.jogador,
        categoria: partida.palavra.categoria,
        mascara: gerarMascara(textoPalavra, tentadas),
        letrasTentadas: tentadas,
        vidasRestantes: VIDAS_INICIAIS - partida.erros,
        status,
        pontos: partida.pontos,
        palavra: status === 'em_andamento' ? null: textoPalavra
    }
}

export async function criarPartida(jogador: string): Promise<EstadoPartida> {
    const palavra = await palavrasRepo.sortearPalavra()
    if(!palavra) throw new ErroApp('Nenhuma palavra cadastrada', 500)

    const partida = await partidasRepo.criarPartida(jogador, palavra.id)
    return paraEstado(partida)
}

export async function buscarPartida(id:number): Promise<EstadoPartida> {
    const partida = await partidasRepo.buscarPartidaPorId(id)
    if(!partida) throw new ErroApp('Partida não encontrada', 404)
    return paraEstado(partida)
}












