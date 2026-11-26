import type { EstadoPartida } from '../types';

type FimProps = {
  partida: EstadoPartida;
  onNovo: () => void;
};

export function Fim({ partida, onNovo }: FimProps) {
  const venceu = partida.status === 'vitoria';
  const sobra = partida.vidasRestantes;

  const comentario = venceu
    ? sobra === 6
      ? 'Perfeito, você não perdeu nenhuma vida!'
      : `Você terminou com ${sobra} ${sobra === 1 ? 'vida sobrando' : 'vidas sobrando'}.`
    : 'Faz parte: cada partida ensina alguma coisa. Que tal tentar de novo?';

  return (
    <main>
      <h1 className="resultado">
        {venceu ? `Mandou bem, ${partida.jogador}!` : `Não foi dessa vez, ${partida.jogador}`}
      </h1>
      <p>{comentario}</p>
      <p>
        A palavra era <strong className="palavra">{partida.palavra}</strong>
      </p>
      {venceu && (
        <p className="pontos">
          <span>{partida.pontos}</span>
          pontos
        </p>
      )}
      <button onClick={onNovo}>Jogar de novo</button>
    </main>
  );
}