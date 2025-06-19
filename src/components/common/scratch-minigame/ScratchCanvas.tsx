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
  return !disabled ? (
    <canvas
      ref={canvasRef}
      width={320}
      height={200}
      className="absolute inset-0 w-full h-full rounded-xl touch-none cursor-pointer"
      style={{ zIndex: 2 }}
      onMouseDown={() => setScratching(true)}
      onMouseUp={() => setScratching(false)}
      onMouseLeave={() => setScratching(false)}
      onMouseMove={(e) => scratching && onScratch(e)}
      onTouchStart={() => setScratching(true)}
      onTouchEnd={() => setScratching(false)}
      onTouchCancel={() => setScratching(false)}
      onTouchMove={(e) => scratching && onScratch(e)}
    />
  ) : null;
}