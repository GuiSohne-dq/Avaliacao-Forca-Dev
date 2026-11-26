type VidasProps = {
  restantes: number;
};

const TOTAL_VIDAS = 6;

export function Vidas({ restantes }: VidasProps) {
  return (
    <div className="vidas" aria-label={`${restantes} vidas restantes`}>
      <div className="vidas-barras">
        {Array.from({ length: TOTAL_VIDAS }, (_, i) => (
          <span key={i} className={i < restantes ? 'vida' : 'vida perdida'} />
        ))}
      </div>
      <p>
        {restantes} {restantes === 1 ? 'vida restante' : 'vidas restantes'}
      </p>
    </div>
  );
}