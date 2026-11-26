import { useState } from 'react';
import { Fim } from './pages/Fim';
import { Inicio } from './pages/Inicio';
import { Jogo } from './pages/Jogo';
import type { EstadoPartida } from './types';
import './App.css';

export default function App() {
  const [partida, setPartida] = useState<EstadoPartida | null>(null);

  if (!partida) {
    return <Inicio onIniciar={setPartida} />;
  }
  if (partida.status === 'em_andamento') {
    return <Jogo partida={partida} onAtualizar={setPartida} />;
  }
  return <Fim partida={partida} onNovo={() => setPartida(null)} />;
}