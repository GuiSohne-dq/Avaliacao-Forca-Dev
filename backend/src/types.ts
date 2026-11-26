
export type StatusPartida = 'em_andamento' | 'vitoria' | 'derrota'

//Estrutura dos dados da partida
export interface EstadoPartida{
    id: number
    jogador: string
    categoria: string
    mascara: string
    letrasTentadas: string[]
    vidasRestantes: number
    status: StatusPartida
    pontos: number
    palavra: string | null 
}

//Estrutura de cada item do ranking
export interface ItemRanking {
    jogador: string
    pontos: number
    palavra: string
    finalizadaEm: string
}

//Estrutura interna dos dados utilizados
export interface PartidaJogo{
    palavra: string
    letrasTentadas: string[]
    erros: number
    status: StatusPartida
    pontos: number
}