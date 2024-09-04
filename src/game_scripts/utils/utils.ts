// utils.ts
export const speed = 10; // Speed constant
// withGrid function
export function withGrid(n: number): number {
  return n * 16;
}

export function withOutGrid_RndDown(n: number): number {
  return Math.floor(n / 16);
}

export function withOutGrid_RndUp(n: number): number {
  return Math.ceil(n / 16);
}

// asGridCoord function
export function asGridCoord(x: number, y: number): string {
  return `${x * 16}, ${y * 16}`;
}

// nextPosition function
export function nextPosition(
  occupiedGrids: { x: number; y: number }[],
  direction: string
): { x: number; y: number }[] {
  // const gridPxSize = 16; // Grid size in pixels
  let xOffset = 0;
  let yOffset = 0;

  switch (direction) {
    case "up":
      yOffset = -1;
      break;
    case "down":
      yOffset = 1;
      break;
    case "left":
      xOffset = -1;
      break;
    case "right":
      xOffset = 1;
      break;
  }

  // Shift all occupied grid squares based on the direction
  const newOccupiedGrids = occupiedGrids.map((grid) => {
    return {
      x: grid.x + xOffset,
      y: grid.y + yOffset,
    };
  });

  return newOccupiedGrids;
}

// oppositeDirection function
export function oppositeDirection(direction: string): string {
  if (direction === "left") {
    return "right";
  } else if (direction === "right") {
    return "left";
  } else if (direction === "up") {
    return "down";
  } else {
    return "up";
  }
}

// emitEvent function
export function emitEvent(name: string, detail: any): void {
  const event = new CustomEvent(name, {
    detail,
  });
  document.dispatchEvent(event);
}

export function calculateWorldBounds(
  occupiedGrids: { x: number; y: number }[],
  gridSize: number
): {
  topLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
} {
  // Initialize variables to store the minimum and maximum grid coordinates
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  // Iterate through each grid coordinate to find the min and max values
  occupiedGrids.forEach((grid) => {
    if (grid.x < minX) minX = grid.x;
    if (grid.y < minY) minY = grid.y;
    if (grid.x > maxX) maxX = grid.x;
    if (grid.y > maxY) maxY = grid.y;
  });

  // Calculate the top-left and bottom-right world positions
  const topLeft = { x: minX * gridSize, y: minY * gridSize };
  const bottomRight = { x: (maxX + 1) * gridSize, y: (maxY + 1) * gridSize };

  return { topLeft, bottomRight };
}

// If you want to maintain the ability to import all functions as a single object:
export default {
  withGrid,
  asGridCoord,
  nextPosition,
  oppositeDirection,
  emitEvent,
  calculateWorldBounds,
  withOutGrid_RndDown,
  withOutGrid_RndUp,
  speed,
};
