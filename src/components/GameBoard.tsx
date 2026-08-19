import React from 'react';
import { BoardCell, DraggingState, BlockSkinId, BoardThemeId, ActivePowerUp, ScorePopup } from '../types';
import { getBlockColorClasses, BOARD_THEMES_METADATA } from '../utils/themeStyles';
import { AnimatePresence, motion } from 'motion/react';
import { Hammer, Bomb } from 'lucide-react';

interface GameBoardProps {
  board: BoardCell[][];
  activeSkin: BlockSkinId;
  activeBoardTheme: BoardThemeId;
  draggingState: DraggingState | null;
  activePowerUp: ActivePowerUp;
  hoveredPowerUpCell: { row: number; col: number } | null;
  scorePopups: ScorePopup[];
  onBoardCellClick: (row: number, col: number) => void;
  onBoardCellHover: (row: number, col: number) => void;
  boardRef: React.RefObject<HTMLDivElement | null>;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  activeSkin,
  activeBoardTheme,
  draggingState,
  activePowerUp,
  hoveredPowerUpCell,
  scorePopups,
  onBoardCellClick,
  onBoardCellHover,
  boardRef,
}) => {
  const themeMeta = BOARD_THEMES_METADATA.find(t => t.id === activeBoardTheme) || BOARD_THEMES_METADATA[0];

  // Calculate potential full rows/cols with fast lookups
  const previewClears = React.useMemo(() => {
    if (!draggingState || draggingState.gridRow === null || draggingState.gridCol === null || !draggingState.isValid) {
      return { rows: new Set<number>(), cols: new Set<number>() };
    }

    const { shape } = draggingState.block;
    const anchorR = draggingState.gridRow;
    const anchorC = draggingState.gridCol;

    const tempRows = new Uint8Array(8);
    const tempCols = new Uint8Array(8);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c].filled) {
          tempRows[r]++;
          tempCols[c]++;
        }
      }
    }

    for (let r = 0; r < shape.matrix.length; r++) {
      for (let c = 0; c < shape.matrix[0].length; c++) {
        if (shape.matrix[r][c] === 1) {
          const tr = anchorR + r;
          const tc = anchorC + c;
          if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8 && !board[tr][tc].filled) {
            tempRows[tr]++;
            tempCols[tc]++;
          }
        }
      }
    }

    const fullRows = new Set<number>();
    const fullCols = new Set<number>();

    for (let i = 0; i < 8; i++) {
      if (tempRows[i] === 8) fullRows.add(i);
      if (tempCols[i] === 8) fullCols.add(i);
    }

    return { rows: fullRows, cols: fullCols };
  }, [board, draggingState]);

  return (
    <div className="relative w-full px-4 flex items-center justify-center select-none my-auto touch-none">
      {/* Power-up targeting banner */}
      <AnimatePresence>
        {activePowerUp && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.12 }}
            className="absolute -top-7 z-20 px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30"
          >
            {activePowerUp === 'hammer' ? <Hammer className="w-3.5 h-3.5" /> : <Bomb className="w-3.5 h-3.5" />}
            <span>Tap any {activePowerUp === 'hammer' ? 'single block' : '3x3 area'} to blast!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating score popups */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        <AnimatePresence>
          {scorePopups.map(popup => (
            <motion.div
              key={popup.id}
              initial={{ opacity: 1, scale: 0.8, y: popup.y, x: popup.x }}
              animate={{ opacity: 0, scale: 1.25, y: popup.y - 45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`absolute font-black font-['Outfit'] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] pointer-events-none whitespace-nowrap ${
                popup.isCombo ? 'text-2xl text-yellow-300' : 'text-xl text-cyan-300'
              }`}
              style={{ left: `${popup.x}px`, top: `${popup.y}px` }}
            >
              {popup.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 8x8 Board Container */}
      <div
        ref={boardRef}
        id="imran-blast-board"
        className={`w-full max-w-[380px] aspect-square rounded-2xl p-2 md:p-2.5 border-2 grid grid-cols-8 grid-rows-8 gap-1 md:gap-1.5 touch-none relative transition-colors duration-200 ${
          draggingState?.isValid ? 'border-cyan-500/60 ring-2 ring-cyan-500/20' : themeMeta.boardBgClass
        }`}
        style={{
          touchAction: 'none',
          willChange: 'transform',
        }}
      >
        {board.map((rowArr, r) =>
          rowArr.map((cell, c) => {
            // Ghost preview check
            let isGhostCell = false;
            let ghostValid = false;

            if (draggingState && draggingState.gridRow !== null && draggingState.gridCol !== null) {
              const { shape } = draggingState.block;
              const rDiff = r - draggingState.gridRow;
              const cDiff = c - draggingState.gridCol;

              if (
                rDiff >= 0 &&
                rDiff < shape.matrix.length &&
                cDiff >= 0 &&
                cDiff < shape.matrix[0].length &&
                shape.matrix[rDiff][cDiff] === 1
              ) {
                isGhostCell = true;
                ghostValid = draggingState.isValid;
              }
            }

            // Power-up hover highlight
            const isPowerUpTarget =
              activePowerUp === 'hammer'
                ? hoveredPowerUpCell?.row === r && hoveredPowerUpCell?.col === c && cell.filled
                : activePowerUp === 'bomb'
                ? hoveredPowerUpCell &&
                  Math.abs(hoveredPowerUpCell.row - r) <= 1 &&
                  Math.abs(hoveredPowerUpCell.col - c) <= 1
                : false;

            // Row / col clear highlight
            const isRowColClearPreview =
              previewClears.rows.has(r) || previewClears.cols.has(c);

            return (
              <div
                key={`cell-${r}-${c}`}
                id={`cell-${r}-${c}`}
                onClick={() => onBoardCellClick(r, c)}
                onMouseEnter={() => onBoardCellHover(r, c)}
                className={`relative rounded-lg flex items-center justify-center overflow-hidden transition-all duration-75 ${
                  activePowerUp ? 'cursor-crosshair' : ''
                } ${
                  cell.filled
                    ? `${getBlockColorClasses(cell.color, cell.skin || activeSkin)} ${
                        cell.clearing ? 'scale-110 brightness-150 animate-pulse' : 'scale-100'
                      }`
                    : `${themeMeta.cellEmptyClass} border ${
                        draggingState ? 'border-slate-700/60' : ''
                      }`
                } ${
                  isGhostCell
                    ? ghostValid
                      ? `${getBlockColorClasses(draggingState?.block.shape.color, activeSkin)} opacity-90 ring-2 ring-white scale-95 shadow-md`
                      : 'bg-rose-950/80 border-2 border-rose-500/80 opacity-60'
                    : ''
                } ${
                  isRowColClearPreview && cell.filled && !cell.clearing
                    ? 'ring-2 ring-yellow-300 ring-offset-1 ring-offset-slate-900 brightness-125'
                    : ''
                } ${
                  isPowerUpTarget
                    ? 'ring-2 ring-red-500 bg-red-600/40 animate-pulse'
                    : ''
                }`}
                style={{
                  willChange: 'transform, opacity',
                }}
              >
                {/* 3D Glass / Gem Specular Highlight */}
                {(cell.filled || (isGhostCell && ghostValid)) && !cell.clearing && (
                  <div className="absolute inset-0 pointer-events-none rounded-lg">
                    <div className="absolute top-0.5 left-0.5 right-0.5 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-t-md" />
                    <div className="absolute bottom-0.5 right-0.5 w-1/2 h-1/2 bg-gradient-to-tl from-black/25 to-transparent rounded-br-md" />
                  </div>
                )}

                {/* Empty cell center subtle dot */}
                {!cell.filled && !isGhostCell && (
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-700/40 pointer-events-none" />
                )}

                {/* Clearing flash particles */}
                {cell.clearing && (
                  <div className="absolute inset-0 bg-white rounded-lg animate-pulse" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
