import type { ItemRanking } from '../types';

type RankingProps = {
  itens: ItemRanking[];
};

export function Ranking({ itens }: RankingProps) {
  if (itens.length === 0) {
    return <p>Ainda não há vitórias. Seja o primeiro!</p>;
  }

  return (
    <table className="ranking">
      <thead>
        <tr>
          <th>#</th>
          <th>Jogador</th>
          <th>Pontos</th>
          <th>Palavra</th>
        </tr>
      </thead>
      <tbody>
        {itens.map((item, i) => (
          <tr key={`${item.jogador}-${item.finalizadaEm}`}>
            <td>{i + 1}</td>
            <td>{item.jogador}</td>
            <td>{item.pontos}</td>
            <td>{item.palavra}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}