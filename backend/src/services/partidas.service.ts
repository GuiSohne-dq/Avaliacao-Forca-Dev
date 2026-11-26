import { ErroApp } from "../errors";
import { VIDAS_INICIAIS, gerarMascara, aplicarPalpite } from "../game/regras";
import * as palavrasRepo from '../repositories/palavras.repository'
import * as partidasRepo from '../repositories/partidas.repository'
import type { EstadoPartida, StatusPartida, ItemRanking, PartidaJogo } from "../types";

//define o tipo de uma partida encontrada pelo id, fazendo ela não ser nula
type PartidaComPalavra = NonNullable<
    Awaited<ReturnType<typeof partidasRepo.buscarPartidaPorId>>
>

// converte os dados da partido do DB para o formato utilizado no app, calculando a mascara da palavra, letras tentadas e a vida restante, só exibindo a palavra completa quando termina a partida
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

// criar uma partida com uma palavra do DB
export async function criarPartida(jogador: string): Promise<EstadoPartida> {
    const palavra = await palavrasRepo.sortearPalavra()
    if(!palavra) throw new ErroApp('Nenhuma palavra cadastrada', 500)

    const partida = await partidasRepo.criarPartida(jogador, palavra.id)
    return paraEstado(partida)
}

//busca partida pelo id e retorna o estado atual
export async function buscarPartida(id:number): Promise<EstadoPartida> {
    const partida = await partidasRepo.buscarPartidaPorId(id)
    if(!partida) throw new ErroApp('Partida não encontrada', 404)
    return paraEstado(partida)
}

// Processa o palpite de uma letra, verifica se está de acordo com as regras do jogo e atualiza a partida, se a letra já foi utilizado ou  a partida acabou, a fução aplicarpalpite lança um erro, após salva os dados no DB e registra a data de finalização
export async function palpitar(id: number, letra: string): Promise<EstadoPartida> {
  const partida = await partidasRepo.buscarPartidaPorId(id);
  if (!partida) throw new ErroApp('Partida não encontrada', 404);

 
  const atual: PartidaJogo = {
    palavra: partida.palavra.palavra,
    letrasTentadas: partida.letrasTentadas.split(''),
    erros: partida.erros,
    status: partida.status as StatusPartida,
    pontos: partida.pontos,
  };

  const nova = aplicarPalpite(atual, letra); // lança 409 se letra repetida ou partida encerrada

  const atualizada = await partidasRepo.atualizarPartida(id, {
    erros: nova.erros,
    letrasTentadas: nova.letrasTentadas.join(''),
    status: nova.status,
    pontos: nova.pontos,
    finalizadaEm: nova.status === 'em_andamento' ? undefined : new Date(),
  });

  return paraEstado(atualizada);
}

// Busca a partidas vencedoras e monta o ranking dos jogadores que devolve o nome, pontuação, palavra e data de finalização de cada partida
export async function ranking(): Promise<ItemRanking[]> {
  const partidas = await partidasRepo.buscarRanking();
  return partidas.map((p) => ({
    jogador: p.jogador,
    pontos: p.pontos,
    palavra: p.palavra.palavra,
    finalizadaEm: p.finalizadaEm?.toISOString() ?? '',
  }));
}











