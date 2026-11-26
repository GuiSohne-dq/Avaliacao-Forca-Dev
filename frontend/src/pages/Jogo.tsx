import { useEffect, useState } from 'react';
import { api } from '../api/cliente';
import { Mascara } from '../components/Mascara';
import { Teclado } from '../components/Teclado';
import { Vidas } from '../components/Vidas';
import type { EstadoPartida } from '../types';

type JogoProps = {
  partida: EstadoPartida;
  onAtualizar: (partida: EstadoPartida) => void;
};

export function Jogo({ partida, onAtualizar }: JogoProps) {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const encerrada = partida.status !== 'em_andamento';
  const frase = mensagem ?? `Oi, ${partida.jogador}! Escolha uma letra para começar.`;

  async function aoEscolherLetra(letra: string) {
    setCarregando(true);
    setErro(null);
    try {
      // o servidor devolve o estado novo: o front só exibe
      const nova = await api.palpitar(partida.id, letra);
      setMensagem(
        nova.mascara.includes(letra)
          ? `Boa! Tem ${letra} na palavra.`
          : `Hmm, não tem ${letra} por aqui.`,
      );
      onAtualizar(nova);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!/^[a-z]$/i.test(e.key)) return;
      const letra = e.key.toUpperCase();
      if (carregando || encerrada || partida.letrasTentadas.includes(letra)) return;
      void aoEscolherLetra(letra);
    }
    window.addEventListener('keydown', aoTeclar);
    return () => window.removeEventListener('keydown', aoTeclar);
  });

  return (
    <main>
      <p className="info">Categoria · {partida.categoria}</p>
      <Mascara mascara={partida.mascara} />
      <Vidas restantes={partida.vidasRestantes} />
      <p className="dica">{frase}</p>
      {partida.vidasRestantes === 1 && (
        <p className="aviso">Última chance. Respire e pense bem.</p>
      )}
      <Teclado
        tentadas={partida.letrasTentadas}
        mascara={partida.mascara}
        desabilitado={carregando || encerrada}
        onLetra={aoEscolherLetra}
      />
      {carregando && <p>Carregando...</p>}
      {erro && <p role="alert">{erro}</p>}
    </main>
  );
}