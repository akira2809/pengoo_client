import Image from "next/image";

const IMAGE_MAP: Record<string, string> = {
  "ssrb.png": "/images/minigame/ssrb.png",
  "takodachi.png": "/images/minigame/takodachi.png",
  "bubba.png": "/images/minigame/bubba.png",
  "bloop.png": "/images/minigame/bloop.png",
  "greenssrb.png": "/images/minigame/greenssrb.png",
  // Add more mappings as needed
};

type WinLine = { type: "row" | "col" | "diag", index: number };

export default function ScratchGrid({
  grid,
  winLines = [],
}: {
  grid: string[][];
  winLines?: WinLine[];
}) {
  const isWinningCell = (row: number, col: number) => {
    // Row win
    if (winLines.some(line => line.type === "row" && line.index === row)) return true;
    // Col win
    if (winLines.some(line => line.type === "col" && line.index === col)) return true;
    // Diag1 win
    if (winLines.some(line => line.type === "diag" && line.index === 1) && row === col) return true;
    // Diag2 win
    if (winLines.some(line => line.type === "diag" && line.index === 2) && row + col === 2) return true;
    return false;
  };

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-[360px] mx-auto my-4">
      {grid.map((row, rowIdx) =>
        row.map((symbol, colIdx) => {
          const win = isWinningCell(rowIdx, colIdx);
          return (
            <div
              key={`${rowIdx}-${colIdx}`}
              className={`
                flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-4 transition-all duration-200
                relative overflow-hidden
                ${win
                  ? "bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-50 border-yellow-400 shadow-[0_0_24px_6px_rgba(253,230,138,0.7)] scale-105 z-10"
                  : "bg-white/90 border-gray-200 shadow"
                }
                hover:scale-105
              `}
              style={{
                boxShadow: win
                  ? "0 0 24px 6px #fde68a, 0 2px 8px 0 rgba(0,0,0,0.08)"
                  : "0 2px 8px 0 rgba(0,0,0,0.06)",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
            >
              {symbol && (
                <Image
                  src={IMAGE_MAP[symbol] || "/images/minigame/ssrb.png"}
                  alt={symbol}
                  width={72}
                  height={72}
                  className={`w-14 h-14 sm:w-16 sm:h-16 drop-shadow-lg transition-all duration-200
                    ${win ? "scale-110 saturate-150" : "opacity-80"}
                  `}
                  unoptimized
                  draggable={false}
                />
              )}
              {win && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none border-4 border-yellow-400 animate-pulse" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
