export const WATER_COLS = 180;
export const WATER_ROWS = 110;

const DAMPING = 0.965;
const SPREAD = 0.5;
const CELLS = WATER_COLS * WATER_ROWS;

class WaterField {
  current = new Float32Array(CELLS);
  previous = new Float32Array(CELLS);

  dropCell(x: number, y: number, force: number) {
    if (x < 2 || y < 2 || x > WATER_COLS - 3 || y > WATER_ROWS - 3) {
      return;
    }
    for (let oy = -1; oy <= 1; oy += 1) {
      for (let ox = -1; ox <= 1; ox += 1) {
        this.previous[(y + oy) * WATER_COLS + (x + ox)] += force;
      }
    }
  }

  dropClient(
    clientX: number,
    clientY: number,
    rect: { left: number; top: number; width: number; height: number },
    force: number,
  ) {
    const x = Math.floor(((clientX - rect.left) / rect.width) * WATER_COLS);
    const y = Math.floor(((clientY - rect.top) / rect.height) * WATER_ROWS);
    this.dropCell(x, y, force);
  }

  step() {
    if (Math.random() < 0.08) {
      const rx = 2 + Math.floor(Math.random() * (WATER_COLS - 4));
      const ry = 2 + Math.floor(Math.random() * (WATER_ROWS - 4));
      this.previous[ry * WATER_COLS + rx] += 6 + Math.random() * 8;
    }

    const { previous, current } = this;
    for (let y = 1; y < WATER_ROWS - 1; y += 1) {
      const row = y * WATER_COLS;
      for (let x = 1; x < WATER_COLS - 1; x += 1) {
        const i = row + x;
        const next =
          (previous[i - 1]! +
            previous[i + 1]! +
            previous[i - WATER_COLS]! +
            previous[i + WATER_COLS]!) *
            SPREAD -
          current[i]!;
        current[i] = next * DAMPING;
      }
    }

    this.previous = current;
    this.current = previous;
  }

  writeTexture(data: Uint8Array) {
    const heights = this.current;
    for (let i = 0; i < heights.length; i += 1) {
      const encoded = Math.max(0, Math.min(255, 128 + heights[i]! * 8));
      const p = i * 4;
      data[p] = encoded;
      data[p + 1] = encoded;
      data[p + 2] = encoded;
      data[p + 3] = 255;
    }
  }
}

export const waterField = new WaterField();

export function sampleWater(nx: number, ny: number): number {
  const x = Math.min(
    WATER_COLS - 2,
    Math.max(1, Math.floor(nx * WATER_COLS)),
  );
  const y = Math.min(
    WATER_ROWS - 2,
    Math.max(1, Math.floor(ny * WATER_ROWS)),
  );
  return waterField.current[y * WATER_COLS + x] ?? 0;
}
