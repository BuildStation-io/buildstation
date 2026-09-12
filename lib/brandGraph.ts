export type Vec3 = [number, number, number];

export type GraphNode = {
  id: string;
  p: Vec3;
  r: number;
};

export type GraphEdge = {
  a: string;
  b: string;
  radius: number;
};

const OUTER = 0.062;
const INNER = 0.02;

const nodeList: GraphNode[] = [
  { id: "top", p: [0, 1.14, 0], r: 0.062 },
  { id: "bl", p: [-0.8, -0.56, 0], r: 0.062 },
  { id: "tail", p: [-1.08, -0.78, 0], r: 0.054 },
  { id: "br", p: [0.98, -0.62, 0], r: 0.054 },
  { id: "h0", p: [0.02, 0.22, 0.04], r: 0.046 },
  { id: "h1", p: [0.25, 0.07, -0.03], r: 0.036 },
  { id: "h2", p: [0.27, -0.18, 0.05], r: 0.05 },
  { id: "h3", p: [0.01, -0.34, -0.02], r: 0.034 },
  { id: "h4", p: [-0.28, -0.2, 0.06], r: 0.06 },
  { id: "h5", p: [-0.24, 0.06, -0.04], r: 0.036 },
  { id: "leftHigh", p: [-0.42, 0.42, 0], r: 0 },
  { id: "rightHigh", p: [0.46, 0.32, 0], r: 0 },
];

export const brandNodes: Record<string, GraphNode> = Object.fromEntries(
  nodeList.map((node) => [node.id, node]),
);

const hexIds = ["h0", "h1", "h2", "h3", "h4", "h5"] as const;

const innerPairs: GraphEdge[] = [];
for (let i = 0; i < hexIds.length; i += 1) {
  for (let j = i + 1; j < hexIds.length; j += 1) {
    innerPairs.push({ a: hexIds[i], b: hexIds[j], radius: INNER });
  }
}

export const brandEdges: GraphEdge[] = [
  { a: "top", b: "bl", radius: OUTER },
  { a: "bl", b: "tail", radius: OUTER },
  { a: "bl", b: "br", radius: OUTER },
  { a: "br", b: "top", radius: OUTER },
  ...innerPairs,
  { a: "h4", b: "bl", radius: INNER },
  { a: "h5", b: "leftHigh", radius: INNER },
  { a: "h0", b: "leftHigh", radius: INNER },
  { a: "h1", b: "rightHigh", radius: INNER },
  { a: "h2", b: "br", radius: INNER },
];
