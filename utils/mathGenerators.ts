import { Vector3 } from 'three';
import { ShapeType } from '../types';

const COUNT = 20000;

// Helper to get random point on a line segment
const getPointOnLine = (start: Vector3, end: Vector3, t: number) => {
  return new Vector3().copy(start).lerp(end, t);
};

// 1. Chaos: Lorenz Attractor
const generateLorenz = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  let x = 0.1, y = 0, z = 0;
  const a = 10, b = 28, c = 8 / 3;
  const dt = 0.005;

  for (let i = 0; i < count; i++) {
    const dx = a * (y - x) * dt;
    const dy = (x * (b - z) - y) * dt;
    const dz = (x * y - c * z) * dt;
    x += dx;
    y += dy;
    z += dz;

    // Scale and center
    positions[i * 3] = x * 0.5;
    positions[i * 3 + 1] = y * 0.5 - 10;
    positions[i * 3 + 2] = z * 0.5 - 10;
  }
  return positions;
};

// 2. Mobius Strip
const generateMobius = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * Math.PI * 2; // 0 to 2PI
    const v = (Math.random() * 2) - 1; // -1 to 1 (width)
    const radius = 8;

    // Parametric equations
    const x = (1 + v / 2 * Math.cos(u / 2)) * Math.cos(u) * radius;
    const y = (1 + v / 2 * Math.cos(u / 2)) * Math.sin(u) * radius;
    const z = (v / 2 * Math.sin(u / 2)) * radius * 2; 

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
};

// 3. Heart (3D)
const generateHeart = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  let i = 0;
  while (i < count) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI; 
    
    // Modified heart shape formula
    const x = 16 * Math.pow(Math.sin(v), 3) * Math.sin(u);
    const y = (13 * Math.cos(v) - 5 * Math.cos(2 * v) - 2 * Math.cos(3 * v) - Math.cos(4 * v));
    const z = 16 * Math.pow(Math.sin(v), 3) * Math.cos(u);

    // Scale down
    const scale = 0.8;

    positions[i * 3] = x * scale;
    positions[i * 3 + 1] = y * scale;
    positions[i * 3 + 2] = z * scale * 0.5;
    i++;
  }
  return positions;
};

// 4. Torus Knot (Trefoil-ish)
const generateTorusKnot = (count: number): Float32Array => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Spread points along the curve with some volume
        const t = (i / count) * Math.PI * 2 * 10 + Math.random(); 
        
        // (p,q) torus knot parameters. p=2, q=3 is a trefoil.
        const p = 2;
        const q = 3;
        
        // Tube radius
        const tubeRadius = 2.5 * Math.random(); 
        
        const r = 10 + Math.cos(q * t / p) * 5; // Major radius variation
        
        // Center line of knot
        const cx = r * Math.cos(t);
        const cy = r * Math.sin(t);
        const cz = Math.sin(q * t / p) * 5;

        // Add volume (random displacement inside tube)
        const theta = Math.random() * Math.PI * 2;
        
        positions[i * 3] = cx + tubeRadius * Math.cos(theta) * Math.cos(t);
        positions[i * 3 + 1] = cy + tubeRadius * Math.cos(theta) * Math.sin(t);
        positions[i * 3 + 2] = cz + tubeRadius * Math.sin(theta);
    }
    return positions;
}

// 5. Spiral Galaxy
const generateGalaxy = (count: number): Float32Array => {
    const positions = new Float32Array(count * 3);
    const arms = 5;
    const armWidth = 1.2;
    
    for (let i = 0; i < count; i++) {
        // Choose an arm
        const armIndex = i % arms;
        const randomOffset = Math.random();
        const distance = Math.random(); // distance from center (normalized)
        
        // Logarithmic spiral math
        // r = a * e^(b*theta)
        // Inverse to distribute points: theta scales with distance
        
        const maxAngle = 4 * Math.PI; // 2 rotations
        const angle = distance * maxAngle;
        const radius = 3 + angle * 2.5; // Linear growth approx for visual balance

        const armAngle = (Math.PI * 2 / arms) * armIndex;
        const finalAngle = angle + armAngle;

        // Add randomness for "cloud" effect
        const spread = (Math.random() - 0.5) * armWidth * (2 + distance * 5);
        const heightSpread = (Math.random() - 0.5) * (1 + distance * 3);

        const x = (radius + spread) * Math.cos(finalAngle);
        const y = (radius + spread) * Math.sin(finalAngle);
        const z = heightSpread * (1 - distance * 0.5); // thicker at center

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }
    return positions;
}

export const getShapePositions = (type: ShapeType): Float32Array => {
  switch (type) {
    case ShapeType.CHAOS:
      return generateLorenz(COUNT);
    case ShapeType.MOBIUS:
      return generateMobius(COUNT);
    case ShapeType.HEART:
      return generateHeart(COUNT);
    case ShapeType.TORUS:
      return generateTorusKnot(COUNT);
    case ShapeType.GALAXY:
      return generateGalaxy(COUNT);
    default:
      return generateLorenz(COUNT);
  }
};

export const PARTICLE_COUNT = COUNT;
