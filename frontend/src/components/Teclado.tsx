type TecladoProps = {
  tentadas: string[];
  mascara: string;
  desabilitado: boolean;
  onLetra: (letra: string) => void;
};

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function Teclado({ tentadas, mascara, desabilitado, onLetra }: TecladoProps) {
  return (
    <div className="teclado">
      {LETRAS.map((l) => {
        const tentada = tentadas.includes(l);
        const classe = !tentada ? '' : mascara.includes(l) ? 'acerto' : 'erro';
        return (
          <button
            key={l}
            className={classe}
            disabled={desabilitado || tentada}
            onClick={() => onLetra(l)}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}