export default function ScratchGrid({
  grid,
  winLines,
}: {
  grid: string[][];
  winLines: string[];
}) {
  const isWinningCell = (row: number, col: number) => {
    return winLines.some(line => {
      if (line.startsWith("row")) return Number(line.replace("row", "")) === row + 1;
      if (line.startsWith("col")) return Number(line.replace("col", "")) === col + 1;
      if (line === "diag1") return row === col;
      if (line === "diag2") return row + col === 2;
      return false;
    });
  };
  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] mx-auto my-2">
      {grid.map((row, rowIdx) =>
        row.map((symbol, colIdx) => (
          <div
            key={`${rowIdx}-${colIdx}`}
            className={`flex items-center justify-center text-2xl sm:text-3xl h-14 w-14 rounded-lg border transition
              ${isWinningCell(rowIdx, colIdx)
                ? "bg-yellow-200 border-yellow-500 shadow-lg scale-105"
                : "bg-white border-gray-200"
              }
            `}
            style={{
              boxShadow: isWinningCell(rowIdx, colIdx)
                ? "0 0 8px 2px #fde68a"
                : undefined,
            }}
          >
            {symbol}
          </div>
        ))
      )}
    </div>
  );
}