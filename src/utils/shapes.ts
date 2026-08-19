import { CellColor, ShapeDefinition, BoardCell } from '../types';

export const ALL_SHAPES: ShapeDefinition[] = [
  // Single dot
  {
    id: 'dot_1x1',
    name: 'Single Dot',
    matrix: [[1]],
    color: 'yellow',
    weight: 8,
  },
  // 2-blocks
  {
    id: 'bar_2x1_h',
    name: '2-Bar Horizontal',
    matrix: [[1, 1]],
    color: 'cyan',
    weight: 9,
  },
  {
    id: 'bar_2x1_v',
    name: '2-Bar Vertical',
    matrix: [[1], [1]],
    color: 'cyan',
    weight: 9,
  },
  // 3-blocks
  {
    id: 'bar_3x1_h',
    name: '3-Bar Horizontal',
    matrix: [[1, 1, 1]],
    color: 'orange',
    weight: 8,
  },
  {
    id: 'bar_3x1_v',
    name: '3-Bar Vertical',
    matrix: [[1], [1], [1]],
    color: 'orange',
    weight: 8,
  },
  // Small L (Corner 2x2)
  {
    id: 'corner_tl',
    name: 'Corner Top-Left',
    matrix: [
      [1, 1],
      [1, 0],
    ],
    color: 'purple',
    weight: 7,
  },
  {
    id: 'corner_tr',
    name: 'Corner Top-Right',
    matrix: [
      [1, 1],
      [0, 1],
    ],
    color: 'purple',
    weight: 7,
  },
  {
    id: 'corner_bl',
    name: 'Corner Bottom-Left',
    matrix: [
      [1, 0],
      [1, 1],
    ],
    color: 'purple',
    weight: 7,
  },
  {
    id: 'corner_br',
    name: 'Corner Bottom-Right',
    matrix: [
      [0, 1],
      [1, 1],
    ],
    color: 'purple',
    weight: 7,
  },
  // 4-blocks
  {
    id: 'square_2x2',
    name: '2x2 Square',
    matrix: [
      [1, 1],
      [1, 1],
    ],
    color: 'emerald',
    weight: 8,
  },
  {
    id: 'bar_4x1_h',
    name: '4-Bar Horizontal',
    matrix: [[1, 1, 1, 1]],
    color: 'blue',
    weight: 6,
  },
  {
    id: 'bar_4x1_v',
    name: '4-Bar Vertical',
    matrix: [[1], [1], [1], [1]],
    color: 'blue',
    weight: 6,
  },
  // Big L-Shapes (3x3 bounds)
  {
    id: 'l_shape_1',
    name: 'L-Shape Normal',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    color: 'pink',
    weight: 6,
  },
  {
    id: 'l_shape_2',
    name: 'L-Shape Inverted',
    matrix: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: 'pink',
    weight: 6,
  },
  {
    id: 'l_shape_3',
    name: 'L-Shape Top',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    color: 'pink',
    weight: 6,
  },
  {
    id: 'l_shape_4',
    name: 'L-Shape Top-Right',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
    ],
    color: 'pink',
    weight: 6,
  },
  // Big J-Shapes (3x3 with 3 vertical/horizontal)
  {
    id: 'l_big_corner_1',
    name: 'Big L Corner',
    matrix: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: 'gold',
    weight: 4,
  },
  {
    id: 'l_big_corner_2',
    name: 'Big L Corner Top-Right',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
    color: 'gold',
    weight: 4,
  },
  // T-Shapes
  {
    id: 't_shape_up',
    name: 'T-Shape Up',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: 'yellow',
    weight: 5,
  },
  {
    id: 't_shape_down',
    name: 'T-Shape Down',
    matrix: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: 'yellow',
    weight: 5,
  },
  {
    id: 't_shape_left',
    name: 'T-Shape Left',
    matrix: [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    color: 'yellow',
    weight: 5,
  },
  {
    id: 't_shape_right',
    name: 'T-Shape Right',
    matrix: [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
    color: 'yellow',
    weight: 5,
  },
  // Z and S shapes
  {
    id: 'z_shape_h',
    name: 'Z-Shape Horizontal',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: 'red',
    weight: 5,
  },
  {
    id: 's_shape_h',
    name: 'S-Shape Horizontal',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: 'red',
    weight: 5,
  },
  {
    id: 'z_shape_v',
    name: 'Z-Shape Vertical',
    matrix: [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
    color: 'red',
    weight: 4,
  },
  {
    id: 's_shape_v',
    name: 'S-Shape Vertical',
    matrix: [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
    color: 'red',
    weight: 4,
  },
  // 5-blocks (rare and challenging)
  {
    id: 'bar_5x1_h',
    name: '5-Bar Horizontal',
    matrix: [[1, 1, 1, 1, 1]],
    color: 'cyan',
    weight: 3,
  },
  {
    id: 'bar_5x1_v',
    name: '5-Bar Vertical',
    matrix: [[1], [1], [1], [1], [1]],
    color: 'cyan',
    weight: 3,
  },
  {
    id: 'plus_shape',
    name: 'Plus Shape',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: 'pink',
    weight: 3,
  },
  // 3x3 Big Block (Rare, rewarding)
  {
    id: 'square_3x3',
    name: '3x3 Giant Square',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: 'gold',
    weight: 2,
  },
  // 2x3 / 3x2 Rectangles
  {
    id: 'rect_2x3',
    name: '2x3 Rectangle',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: 'emerald',
    weight: 3,
  },
  {
    id: 'rect_3x2',
    name: '3x2 Rectangle',
    matrix: [
      [1, 1],
      [1, 1],
      [1, 1],
    ],
    color: 'emerald',
    weight: 3,
  },
  // Diagonal 2
  {
    id: 'diag_2_fwd',
    name: 'Diagonal 2 Forward',
    matrix: [
      [1, 0],
      [0, 1],
    ],
    color: 'orange',
    weight: 4,
  },
  {
    id: 'diag_2_back',
    name: 'Diagonal 2 Back',
    matrix: [
      [0, 1],
      [1, 0],
    ],
    color: 'orange',
    weight: 4,
  },
];

/**
 * Checks if a specific shape can be placed at (row, col) on the board
 */
export function canPlaceShapeAt(board: BoardCell[][], shape: ShapeDefinition, row: number, col: number): boolean {
  const rows = shape.matrix.length;
  const cols = shape.matrix[0].length;

  if (row < 0 || col < 0 || row + rows > 8 || col + cols > 8) {
    return false;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (shape.matrix[r][c] === 1) {
        const targetRow = row + r;
        const targetCol = col + c;
        if (board[targetRow][targetCol].filled) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Checks if a shape can be placed anywhere on the 8x8 board
 */
export function canPlaceShapeAnywhere(board: BoardCell[][], shape: ShapeDefinition): boolean {
  const rows = shape.matrix.length;
  const cols = shape.matrix[0].length;

  for (let r = 0; r <= 8 - rows; r++) {
    for (let c = 0; c <= 8 - cols; c++) {
      if (canPlaceShapeAt(board, shape, r, c)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Calculates current board fill percentage
 */
export function getBoardFillPercentage(board: BoardCell[][]): number {
  let filledCount = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c].filled) filledCount++;
    }
  }
  return filledCount / 64;
}

/**
 * Smart Generator: Generates 3 block shapes suited for current board status.
 * Ensures that at least 1 or 2 shapes are guaranteed to fit, preventing unfair instant loss.
 */
export function generateThreeSmartBlocks(board: BoardCell[][], currentScore: number): ShapeDefinition[] {
  const fillRate = getBoardFillPercentage(board);

  // Filter pool based on difficulty and board fill rate
  let availablePool = ALL_SHAPES.slice();

  // If board is very crowded (> 60%), decrease weights of massive shapes
  if (fillRate > 0.55) {
    availablePool = availablePool.map(shape => {
      const tileCount = shape.matrix.flat().filter(v => v === 1).length;
      if (tileCount >= 6) {
        return { ...shape, weight: Math.max(1, Math.floor((shape.weight || 5) / 3)) };
      }
      if (tileCount <= 3) {
        return { ...shape, weight: (shape.weight || 5) * 2 };
      }
      return shape;
    });
  }

  // Weighted random picker
  const pickWeightedRandom = (pool: ShapeDefinition[]): ShapeDefinition => {
    const totalWeight = pool.reduce((sum, s) => sum + (s.weight || 5), 0);
    let randomNum = Math.random() * totalWeight;
    for (const shape of pool) {
      const w = shape.weight || 5;
      if (randomNum < w) {
        return shape;
      }
      randomNum -= w;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const results: ShapeDefinition[] = [];

  // Pick first shape
  let shape1 = pickWeightedRandom(availablePool);
  results.push(shape1);

  // Pick second shape (try to avoid exact duplicate of big shape)
  let shape2 = pickWeightedRandom(availablePool);
  if (shape2.id === shape1.id && shape1.matrix.length > 2) {
    shape2 = pickWeightedRandom(availablePool);
  }
  results.push(shape2);

  // Pick third shape
  let shape3 = pickWeightedRandom(availablePool);
  results.push(shape3);

  // Solvability Guarantee Check:
  // Check if at least one of the 3 chosen shapes can fit on the current board.
  const hasPlaceable = results.some(s => canPlaceShapeAnywhere(board, s));

  if (!hasPlaceable) {
    // Find all shapes in the entire pool that CAN fit on the board
    const placeableShapes = ALL_SHAPES.filter(s => canPlaceShapeAnywhere(board, s));
    if (placeableShapes.length > 0) {
      // Replace the 3rd or random shape with one guaranteed placeable shape
      const guaranteedShape = placeableShapes[Math.floor(Math.random() * placeableShapes.length)];
      results[2] = guaranteedShape;
    }
  }

  // Assign distinct/vibrant color palette variation
  const vibrantColors: CellColor[] = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red', 'pink', 'gold', 'emerald'];
  return results.map((shape, idx) => {
    // Give each piece in the tray an eye-catching distinct color if needed
    const color = shape.color || vibrantColors[(idx * 3 + Math.floor(Math.random() * 4)) % vibrantColors.length];
    return {
      ...shape,
      color,
    };
  });
}
