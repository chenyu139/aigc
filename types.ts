export enum ShapeType {
  CHAOS = 'Lorenz Attractor',
  MOBIUS = 'Möbius Strip',
  HEART = 'Descartes Heart',
  TORUS = 'Torus Knot',
  GALAXY = 'Logarithmic Spiral',
}

export interface ParticleState {
  fps: number;
  particleCount: number;
  currentShape: ShapeType;
  isTransitioning: boolean;
}

export interface ShapeInfo {
  id: ShapeType;
  name: string;
  formula: string;
  desc: string;
}
