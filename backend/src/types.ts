export type StatusPartida = 'em_andamento' | 'vitoria' | 'derrota'

export interface EstadoPartida{
    id: number
    jogador: string
    categoria: string
}