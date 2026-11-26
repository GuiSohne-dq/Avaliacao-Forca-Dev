type MascaraProps = {
  mascara: string;
};

export function Mascara({ mascara }: MascaraProps) {
  return <div className="mascara">{[...mascara].join(' ')}</div>;
}