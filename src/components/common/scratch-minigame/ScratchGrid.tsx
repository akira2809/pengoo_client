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
    <div className="grid grid-cols-3 gap-4 w-full max-w-[360px] mx-auto my-4">
      {grid.map((row, rowIdx) =>
        row.map((symbol, colIdx) => (
          <div
            key={`${rowIdx}-${colIdx}`}
            className={`flex items-center justify-center text-3xl sm:text-4xl h-24 w-24 rounded-xl border-2 transition
              ${isWinningCell(rowIdx, colIdx)
                ? "bg-yellow-200 border-yellow-500 shadow-xl scale-105"
                : "bg-white border-gray-200"
              }
            `}
            style={{
              boxShadow: isWinningCell(rowIdx, colIdx)
                ? "0 0 12px 4px #fde68a"
                : undefined,
            }}
          >
            {symbol && (
              <Image
                src={IMAGE_MAP[symbol] || "/images/minigame/ssrb.png"}
                alt={symbol}
                width={72}
                height={72}
                className="w-16 h-16"
                unoptimized
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
