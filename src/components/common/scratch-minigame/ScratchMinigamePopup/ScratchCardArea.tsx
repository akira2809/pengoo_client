import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import ScratchCanvas from "../ScratchCanvas";
import ScratchGrid from "../ScratchGrid";
import ScratchRewardPanel from "./ScratchRewardPanel";

interface ScratchCardAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement> | React.MutableRefObject<HTMLCanvasElement | null>;
  scratching: boolean;
  setScratching: (v: boolean) => void;
  scratched: boolean;
  setScratched: (v: boolean) => void;
  scratchedPercent: number;
  loading: boolean;
  error: Error | null;
  result: {
    grid?: string[][];
    winLines?: Array<{type: 'row' | 'col' | 'diag'; index: number}>;
    reward?: {
      type: string;
      value: number;
      description: string;
    };
  } | null;
  handleScratch: (e: React.MouseEvent | React.TouchEvent) => void;
  onPlayAgain: () => void;
  tickets: number;
}

export default function ScratchCardArea({
  canvasRef,
  scratching,
  setScratching,
  scratched,
  scratchedPercent,
  loading,
  error,
  result,
  handleScratch,
  setScratched,
  onPlayAgain,
  tickets,
}: ScratchCardAreaProps) {
  const { width = 0, height = 0 } = useWindowSize();

  // Determine if the user won (has at least one winLine)
  const isWin = scratched && result?.winLines && result.winLines.length > 0;

  // Handle play again button click
  const handlePlayAgain = () => {
    setScratching(false);
    setScratched(false);
    onPlayAgain();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Confetti when win */}
      {isWin && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={250}
          recycle={false}
        />
      )}

      {/* Scratch card */}
      <div className="relative w-full flex justify-center my-4">
        <div
          className="relative bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl shadow-2xl border-4 border-yellow-300"
          style={{ width: 500, height: 360 }}
        >
          {/* The grid is always rendered underneath */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            {result?.grid ? (
              <ScratchGrid grid={result.grid} winLines={result.winLines} />
            ) : (
              <span className="text-6xl text-yellow-200 select-none">?</span>
            )}
          </div>
          {/* The scratchable overlay */}
          <ScratchCanvas
            canvasRef={canvasRef}
            onScratch={handleScratch}
            scratching={scratching}
            setScratching={setScratching}
            disabled={scratched || loading || !!error}
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-xl z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-yellow-400"></div>
            </div>
          )}
        </div>
      </div>
      {/* Show reward/scores only after scratching */}
      {scratched && result && (
        <ScratchRewardPanel result={result} />
      )}
      {/* Retry or progress info */}
      <div className="mt-6 text-center w-full">
        {scratched && !loading && !error ? (
          <button
            onClick={handlePlayAgain}
            disabled={loading || tickets <= 0}
            className={`px-6 py-2 rounded-full font-bold text-white transition-all ${loading || tickets <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg transform hover:scale-105"
              }`}
          >
            🎲 Chơi lại
          </button>
        ) : (
          !loading &&
          !error && (
            <span className="text-yellow-700 text-base font-semibold drop-shadow">
              Cào thẻ để nhận phần thưởng!
              <br />
              <span className="text-yellow-500">{Math.round(scratchedPercent)}% đã cào</span>
            </span>
          )
        )}
      </div>
    </div>
  );
}