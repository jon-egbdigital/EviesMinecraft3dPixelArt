// Minecraft-inspired color palette for the game
// Each color has a unique ID and display number

export const MINECRAFT_COLORS = [
  { id: 1, name: "Oak Wood", hex: "#BA8C51", number: 1 },
  { id: 2, name: "Stone", hex: "#7F7F7F", number: 2 },
  { id: 3, name: "Diamond", hex: "#4AEDD9", number: 3 },
  { id: 4, name: "Iron", hex: "#D8D8D8", number: 4 },
  { id: 5, name: "Gold", hex: "#FCDB5B", number: 5 },
  { id: 6, name: "Emerald", hex: "#17DD62", number: 6 },
  { id: 7, name: "Redstone", hex: "#FF0000", number: 7 },
  { id: 8, name: "Lapis", hex: "#345EC3", number: 8 },
  { id: 9, name: "Obsidian", hex: "#1B1B2F", number: 9 },
  { id: 10, name: "Grass", hex: "#5D9B47", number: 10 },
  { id: 11, name: "Dirt", hex: "#8B5A2B", number: 11 },
  { id: 12, name: "Netherrack", hex: "#723232", number: 12 },
  { id: 13, name: "End Stone", hex: "#DBDBA5", number: 13 },
  { id: 14, name: "Prismarine", hex: "#5B9A8B", number: 14 },
  { id: 15, name: "Copper", hex: "#B4684D", number: 15 },
  { id: 16, name: "Amethyst", hex: "#9A5CC6", number: 16 },
];

// Get color by ID
export const getColorById = (id) =>
  MINECRAFT_COLORS.find(c => c.id === id);

// Get hex value by ID
export const getHexById = (id) =>
  getColorById(id)?.hex ?? "#CCCCCC";

// Color for unpainted blocks
export const UNPAINTED_COLOR = "#888888";

// Color for incorrect paint attempt (flash)
export const ERROR_COLOR = "#FF4444";
