import {prisma} from "../database/prisma"

//Cria uma partida com um jogador associado a uma palavra, retornando dados da partida e da palavra
export async function criarPartida(jogador: string, palavraId: number){
    return prisma.partida.create({
        data: {jogador, palavraId},
        include: {palavra: true}
    })
}

// Busca partida pelo ID e retorna as informações da palavra selecionada
export async function buscarPartidaPorId(id:number){
    return prisma.partida.findUnique({
        where: {id},
        include: {palavra: true}
    })
}

//Atualaiza as informações da partida existente, permiitindo alterar erros, letras utilziadas, status e data que terminou
export async function atualizarPartida(
    id:number,
    dados: {
        erros?: number
        letrasTentadas?: string
        status?: string
        pontos?: number
        finalizadaEm?: Date | null
    },
) {
    return prisma.partida.update({
        where: {id},
        data: dados,
        include: {palavra: true}
    })
}

// busca as 10 melhores partidads com status de vitoria, organizando o ranking pela maior pontuação
export async function buscarRanking() {
    return prisma.partida.findMany({
        where: {status: 'vitoria'},
        orderBy: [{pontos: 'desc'}, {finalizadaEm: 'asc'}],
        take: 10,
        include: {palavra: true}
    })
    
}

