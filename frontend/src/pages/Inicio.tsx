import { useEffect, useState } from 'react';
import { api } from '../api/cliente';
import { Ranking } from '../components/Ranking';
import type { EstadoPartida, ItemRanking } from '../types';

type InicioProps = {
  onIniciar: (partida: EstadoPartida) => void;
};

export function Inicio({ onIniciar }: InicioProps) {
  const [apelido, setApelido] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [ranking, setRanking] = useState<ItemRanking[]>([]);
  const [carregandoRanking, setCarregandoRanking] = useState(true);
  const [erroRanking, setErroRanking] = useState<string | null>(null);

  const apelidoValido = apelido.trim().length >= 3 && apelido.trim().length <= 20;

  useEffect(() => {
    api
      .ranking()
      .then(setRanking)
      .catch((e: Error) => setErroRanking(e.message))
      .finally(() => setCarregandoRanking(false));
  }, []); // [] = roda só quando o componente monta

  async function jogar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    try {
      onIniciar(await api.novaPartida(apelido.trim()));
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main>
      <h1 className="titulo">Forca Dev</h1>
      <p className="subtitulo">
        Um jogo de forca com termos de programação. Escolha um apelido e boa sorte!
      </p>
      <form onSubmit={jogar}>
        <input
          value={apelido}
          onChange={(e) => setApelido(e.target.value)}
          placeholder="Seu apelido (3 a 20 caracteres)"
          maxLength={20}
        />
        <button type="submit" disabled={!apelidoValido || carregando}>
          {carregando ? 'Carregando...' : 'Jogar'}
        </button>
      </form>
      {erro && <p role="alert">{erro}</p>}

      <h2>Top 10 · Quem está na frente</h2>
      {carregandoRanking && <p>Carregando ranking...</p>}
      {erroRanking && <p role="alert">{erroRanking}</p>}
      {!carregandoRanking && !erroRanking && <Ranking itens={ranking} />}
    </main>
  );
}