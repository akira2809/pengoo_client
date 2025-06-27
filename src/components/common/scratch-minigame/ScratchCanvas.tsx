export default function ScratchCanvas({
  canvasRef,
  onScratch,
  scratching,
  setScratching,
  disabled,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onScratch: (e: React.MouseEvent | React.TouchEvent) => void;
  scratching: boolean;
  setScratching: (v: boolean) => void;
  disabled: boolean;
}) {
  // Helper to check if mouse is pressed (for mousemove)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!disabled && scratching && e.buttons === 1) {
      onScratch(e);
    }
  };

  // For touch, just check scratching
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!disabled && scratching) {
      onScratch(e);
    }
  };

  return !disabled ? (
    <canvas
      ref={canvasRef}
      width={500}
      height={360}
      className="absolute inset-0 w-full h-full rounded-xl select-none transition
    ${scratching ? 'cursor-grabbing' : 'cursor-pointer'}"
      style={{ zIndex: 2 }}
      onMouseDown={() => setScratching(true)}
      onMouseUp={() => setScratching(false)}
      onMouseLeave={() => setScratching(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setScratching(true)}
      onTouchEnd={() => setScratching(false)}
      onTouchCancel={() => setScratching(false)}
      onTouchMove={handleTouchMove}
    />
  ) : null;
}