export interface Ripple {
  id: number;
  x: number;
  y: number;
  color?: string;
}

interface RippleLayerProps {
  ripples: Ripple[];
}

/** Full-screen layer for the outlined ripple that fans out from page clicks. */
export function RippleLayer({ ripples }: RippleLayerProps) {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }} aria-hidden="true">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full ripple-anim"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            border: `3px solid ${ripple.color}`,
            backgroundColor: 'transparent',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}
