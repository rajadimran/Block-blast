import React, { useRef, useState, useEffect, useCallback } from 'react';
import { TrayBlock, DraggingState, BlockSkinId, BoardCell } from '../types';
import { getBlockColorClasses } from '../utils/themeStyles';
import { canPlaceShapeAnywhere, canPlaceShapeAt } from '../utils/shapes';
import { soundEngine } from '../utils/audio';

interface BlockTrayProps {
  tray: TrayBlock[];
  board: BoardCell[][];
  activeSkin: BlockSkinId;
  draggingState: DraggingState | null;
  onDragStart: (index: number, block: TrayBlock, startX: number, startY: number) => void;
  onDragMove: (currX: number, currY: number, gridRow: number | null, gridCol: number | null, isValid: boolean) => void;
  onDragEnd: () => void;
  boardRef: React.RefObject<HTMLDivElement | null>;
}

export const BlockTray: React.FC<BlockTrayProps> = ({
  tray,
  board,
  activeSkin,
  draggingState,
  onDragStart,
  onDragMove,
  onDragEnd,
  boardRef,
}) => {
  const [activeTouchIndex, setActiveTouchIndex] = useState<number | null>(null);
  const [blockedShakeIndex, setBlockedShakeIndex] = useState<number | null>(null);
  const [returningBlock, setReturningBlock] = useState<{
    index: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    block: TrayBlock;
  } | null>(null);

  // Direct DOM ref for ultra-smooth 60/120 FPS hardware-accelerated drag follower
  const dragOverlayRef = useRef<HTMLDivElement | null>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Cached board bounding rect
  const boardRectCacheRef = useRef<{
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    cellSize: number;
  } | null>(null);

  const lastSnappedGridRef = useRef<{
    row: number | null;
    col: number | null;
    isValid: boolean;
  }>({ row: null, col: null, isValid: false });

  const pointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update cached board coordinates
  const updateBoardRectCache = useCallback(() => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    // Inner board without padding
    const padding = 10;
    const innerWidth = Math.max(1, rect.width - padding * 2);
    const innerHeight = Math.max(1, rect.height - padding * 2);
    const cellSize = innerWidth / 8;

    boardRectCacheRef.current = {
      left: rect.left + padding,
      top: rect.top + padding,
      right: rect.right - padding,
      bottom: rect.bottom - padding,
      width: innerWidth,
      height: innerHeight,
      cellSize,
    };
  }, [boardRef]);

  // Compute exact grid cell under finger with 1:1 natural alignment
  const calculateGridCoordinates = (clientX: number, clientY: number, matrix: number[][]) => {
    const cached = boardRectCacheRef.current;
    if (!cached) return { row: null, col: null, isValid: false };

    // The block is placed directly under the user's touch/cursor
    const targetX = clientX;
    const targetY = clientY;

    // Check if within board region (with generous 30px boundary tolerance)
    if (
      targetX < cached.left - 30 ||
      targetX > cached.right + 30 ||
      targetY < cached.top - 30 ||
      targetY > cached.bottom + 30
    ) {
      return { row: null, col: null, isValid: false };
    }

    const relX = targetX - cached.left;
    const relY = targetY - cached.top;

    const shapeRows = matrix.length;
    const shapeCols = matrix[0].length;

    // Exact geometric center calculation
    const exactCol = Math.round(relX / cached.cellSize - shapeCols / 2);
    const exactRow = Math.round(relY / cached.cellSize - shapeRows / 2);

    const col = Math.max(0, Math.min(8 - shapeCols, exactCol));
    const row = Math.max(0, Math.min(8 - shapeRows, exactRow));

    const shapeObj = { id: 'temp', name: 'temp', matrix, color: 'cyan' as const };
    const isValid = canPlaceShapeAt(board, shapeObj, row, col);

    return { row, col, isValid };
  };

  // Direct GPU transform update for 0ms lag
  const updateDragOverlayPosition = (clientX: number, clientY: number) => {
    if (dragOverlayRef.current) {
      dragOverlayRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%) scale(1.05)`;
    }
  };

  // Handle pointer down (both touch and mouse)
  const handlePointerDown = (e: React.PointerEvent, index: number, block: TrayBlock) => {
    if (block.placed || returningBlock) return;

    // Check if placeable anywhere on the board
    const canPlace = canPlaceShapeAnywhere(board, block.shape);
    if (!canPlace) {
      soundEngine.playInvalid();
      setBlockedShakeIndex(index);
      setTimeout(() => setBlockedShakeIndex(null), 300);
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Cache board bounding box immediately
    updateBoardRectCache();

    soundEngine.playPickup();
    setActiveTouchIndex(index);
    pointerPosRef.current = { x: e.clientX, y: e.clientY };

    const grid = calculateGridCoordinates(e.clientX, e.clientY, block.shape.matrix);
    lastSnappedGridRef.current = grid;

    onDragStart(index, block, e.clientX, e.clientY);

    requestAnimationFrame(() => {
      updateDragOverlayPosition(e.clientX, e.clientY);
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (activeTouchIndex === null || !draggingState) return;

    e.preventDefault();
    pointerPosRef.current = { x: e.clientX, y: e.clientY };

    // 1. Direct hardware-accelerated GPU transform for 0ms lag
    updateDragOverlayPosition(e.clientX, e.clientY);

    // 2. Compute snap coordinates
    const grid = calculateGridCoordinates(e.clientX, e.clientY, draggingState.block.shape.matrix);

    // 3. Only notify parent if grid coordinate or validity has changed (eliminates ~95% of state re-renders)
    const prev = lastSnappedGridRef.current;
    if (prev.row !== grid.row || prev.col !== grid.col || prev.isValid !== grid.isValid) {
      lastSnappedGridRef.current = grid;
      if (grid.isValid) {
        soundEngine.playDragTick();
      }
      onDragMove(e.clientX, e.clientY, grid.row, grid.col, grid.isValid);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeTouchIndex === null || !draggingState) return;
    e.preventDefault();

    const currIndex = activeTouchIndex;
    const currBlock = draggingState.block;
    const lastGrid = lastSnappedGridRef.current;

    setActiveTouchIndex(null);

    // If valid drop, place instantly with 0 delay
    if (lastGrid.isValid && lastGrid.row !== null && lastGrid.col !== null) {
      onDragEnd();
    } else {
      // Invalid drop: Trigger smooth return snap animation to original slot
      soundEngine.playInvalid();
      const slotEl = slotRefs.current[currIndex];
      if (slotEl) {
        const slotRect = slotEl.getBoundingClientRect();
        const targetX = slotRect.left + slotRect.width / 2;
        const targetY = slotRect.top + slotRect.height / 2;

        setReturningBlock({
          index: currIndex,
          startX: pointerPosRef.current.x,
          startY: pointerPosRef.current.y,
          targetX,
          targetY,
          block: currBlock,
        });

        setTimeout(() => {
          setReturningBlock(null);
          onDragEnd();
        }, 130);
      } else {
        onDragEnd();
      }
    }
  };

  // Clean up on global pointer release
  useEffect(() => {
    const handleGlobalUp = () => {
      if (activeTouchIndex !== null) {
        setActiveTouchIndex(null);
        onDragEnd();
      }
    };
    window.addEventListener('pointerup', handleGlobalUp, { passive: true });
    window.addEventListener('pointercancel', handleGlobalUp, { passive: true });
    window.addEventListener('resize', updateBoardRectCache, { passive: true });

    return () => {
      window.removeEventListener('pointerup', handleGlobalUp);
      window.removeEventListener('pointercancel', handleGlobalUp);
      window.removeEventListener('resize', updateBoardRectCache);
    };
  }, [activeTouchIndex, onDragEnd, updateBoardRectCache]);

  return (
    <div className="w-full px-4 pb-3 pt-1 select-none flex flex-col items-center touch-none">
      {/* 3 Block Tray Container */}
      <div className="w-full max-w-[380px] h-32 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-2.5 flex items-center justify-around gap-2 shadow-inner relative">
        {tray.map((block, idx) => {
          if (block.placed) {
            return (
              <div
                key={`tray-slot-${idx}`}
                ref={el => (slotRefs.current[idx] = el)}
                className="flex-1 h-full rounded-xl border border-dashed border-slate-800/60 bg-slate-950/30 flex items-center justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-slate-800/50" />
              </div>
            );
          }

          const canFit = canPlaceShapeAnywhere(board, block.shape);
          const isBeingDragged = activeTouchIndex === idx;
          const isShaking = blockedShakeIndex === idx;
          const isReturning = returningBlock?.index === idx;

          return (
            <div
              key={block.id}
              ref={el => (slotRefs.current[idx] = el)}
              onPointerDown={e => handlePointerDown(e, idx, block)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`flex-1 h-full rounded-xl flex items-center justify-center p-1 cursor-grab active:cursor-grabbing touch-none select-none relative transition-transform duration-100 ${
                isBeingDragged || isReturning ? 'opacity-10 scale-90' : 'opacity-100 scale-100'
              } ${!canFit ? 'opacity-40 grayscale-[40%]' : ''} ${
                isShaking ? 'animate-bounce text-rose-400' : ''
              }`}
              style={{
                touchAction: 'none',
                WebkitUserSelect: 'none',
                willChange: 'transform, opacity',
              }}
            >
              {/* Render Shape Matrix Mini View */}
              <div
                className="grid gap-1 pointer-events-none"
                style={{
                  gridTemplateRows: `repeat(${block.shape.matrix.length}, minmax(0, 1fr))`,
                  gridTemplateColumns: `repeat(${block.shape.matrix[0].length}, minmax(0, 1fr))`,
                }}
              >
                {block.shape.matrix.map((rowArr, r) =>
                  rowArr.map((filled, c) => (
                    <div
                      key={`mini-${r}-${c}`}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md ${
                        filled === 1
                          ? getBlockColorClasses(block.shape.color, activeSkin)
                          : 'opacity-0'
                      }`}
                    >
                      {filled === 1 && (
                        <div className="w-full h-1/3 bg-white/40 rounded-t-sm" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Returning Snap Animation for Invalid Drops */}
      {returningBlock && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-50 transition-all duration-120 ease-out"
          style={{
            transform: `translate3d(${returningBlock.targetX}px, ${returningBlock.targetY}px, 0) translate(-50%, -50%) scale(0.6)`,
            opacity: 0.8,
            willChange: 'transform, opacity',
          }}
        >
          <div
            className="grid gap-1 drop-shadow-xl"
            style={{
              gridTemplateRows: `repeat(${returningBlock.block.shape.matrix.length}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${returningBlock.block.shape.matrix[0].length}, minmax(0, 1fr))`,
            }}
          >
            {returningBlock.block.shape.matrix.map((rowArr, r) =>
              rowArr.map((filled, c) => (
                <div
                  key={`return-${r}-${c}`}
                  className={`w-8 h-8 rounded-md ${
                    filled === 1
                      ? getBlockColorClasses(returningBlock.block.shape.color, activeSkin)
                      : 'opacity-0'
                  }`}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Floating Dragging Block Overlay (Directly Under Finger, 0ms Lag, GPU Accelerated) */}
      {draggingState && !returningBlock && (
        <div
          ref={dragOverlayRef}
          className="fixed top-0 left-0 pointer-events-none z-50"
          style={{
            transform: `translate3d(${draggingState.currentPointerX}px, ${draggingState.currentPointerY}px, 0) translate(-50%, -50%) scale(1.05)`,
            willChange: 'transform',
            transition: 'none',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <div
            className="grid gap-1.5 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
            style={{
              gridTemplateRows: `repeat(${draggingState.block.shape.matrix.length}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${draggingState.block.shape.matrix[0].length}, minmax(0, 1fr))`,
            }}
          >
            {draggingState.block.shape.matrix.map((rowArr, r) =>
              rowArr.map((filled, c) => (
                <div
                  key={`drag-${r}-${c}`}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg shadow-2xl ${
                    filled === 1
                      ? getBlockColorClasses(draggingState.block.shape.color, activeSkin)
                      : 'opacity-0'
                  }`}
                >
                  {filled === 1 && (
                    <div className="w-full h-1/3 bg-white/50 rounded-t-md" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
