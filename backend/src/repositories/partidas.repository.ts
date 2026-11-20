import {prisma} from "../database/prisma"

export async function criarPartida(jogador: string, palavraId: number){
    return prisma.partida.create({
        data: {jogador, palavraId},
        include: {palavra: true}
    })
}

export async function buscarPartidaPorId(id:number){
    return prisma.partida.findUnique({
        where: {id},
        include: {palavra: true}
    })
}

export async function atualizarPartida(
    id:number,
    dados: {
        erros?: number
        letrasTentadas?: string
        status?: string
        pontos?: number
        finalizadaEm: Date | null
    },
) {
    return prisma.partida.update({
        where: {id},
        data: dados,
        include: {palavra: true}
    })
}

export async function buscarRanking() {
    return prisma.partida.findMany({
        where: {status: 'vitoria'},
        orderBy: [{pontos: 'desc'}, {finalizadaEm: 'asc'}],
        take: 10,
        include: {palavra: true}
    })
    
}

