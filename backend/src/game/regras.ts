import type { PartidaJogo, StatusPartida } from "../types";

import { ErroApp } from "../errors";
export const VIDAS_INICIAIS = 6
import { Partida } from "../../generated/prisma/client";

//mostra as letras utilizadas e troca as outras por _
export function gerarMascara(palavra: string, tentadas: string[]): string{
    return [...palavra].map((l) => (tentadas.includes(l) ? l : '_')).join('')
}


//RN06: Vidas restantes * 10 + letras distintas x 5
export function calcularPontos(palavra: string, vidasRestantes: number): number{
    return vidasRestantes * 10 + new Set(palavra).size * 5
    
}

//RN01 a RN05 e devolve uma nova partida ( não altera a recebida)
export function aplicarPalpite(partida: PartidaJogo, letra: string): PartidaJogo{
    if(partida.status !== 'em_andamento'){
        throw new ErroApp('Partida encerrada', 409)//RN04
    }

    if (partida.letrasTentadas.includes(letra)){
        throw new ErroApp('Letra já utilizada', 409)
    }

    const letrasTentadas = [...partida.letrasTentadas, letra]
    const erros = partida.palavra.includes(letra) ? partida.erros : partida.erros + 1 //RN01
    const vidasRestantes = VIDAS_INICIAIS - erros
    const venceu = [...partida.palavra].every((l) => letrasTentadas.includes(l))

    const status: StatusPartida = venceu
    ? 'vitoria'
    : vidasRestantes <= 0
        ? 'derrota'
        : 'em_andamento' 
    
    const pontos = venceu ? calcularPontos(partida.palavra, vidasRestantes) : 0

    return {...partida, letrasTentadas, erros, status, pontos}

}


