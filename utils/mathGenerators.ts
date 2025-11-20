import { Vector3 } from 'three';
import { ShapeType } from '../types';

const COUNT = 20000;

// 1. Cyber Spine (The requested effect)
const generateSpine = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  const half = Math.floor(count / 2);
  
  // Left Spine (Orange/Gold side)
  for (let i = 0; i < half; i++) {
    const t = (i / half) * Math.PI * 8; // Vertical span
    const y = (i / half) * 24 - 12; // -12 to 12 height
    
    // Complex rib structure
    const ribScale = 1.0 - Math.abs(y) / 14; // Taper at ends
    const theta = (i % 100) / 100 * Math.PI * 2;
    
    // Parametric shape resembling a complex biological spine/leaf
    const rad = (2 + Math.sin(t * 2) * 1.5 + Math.cos(t * 5) * 0.5) * ribScale;
    
    // Add "feathery" offset
    const featherX = Math.sin(theta) * rad;
    const featherZ = Math.cos(theta) * rad * 0.5;
    
    // Spinal twist
    const twist = y * 0.2;
    const finalX = featherX * Math.cos(twist) - featherZ * Math.sin(twist);
    const finalZ = featherX * Math.sin(twist) + featherZ * Math.cos(twist);

    positions[i * 3] = finalX - 5; // Shift Left
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = finalZ;
  }

  // Right Spine (Blue/Cyan side) - Mirrored and slightly different phase
  for (let i = half; i < count; i++) {
    const idx = i - half;
    const t = (idx / half) * Math.PI * 8;
    const y = (idx / half) * 24 - 12;
    
    const ribScale = 1.0 - Math.abs(y) / 14;
    const theta = (idx % 100) / 100 * Math.PI * 2;
    
    const rad = (2 + Math.sin(t * 2 + Math.PI) * 1.5 + Math.cos(t * 5) * 0.5) * ribScale;
    
    const featherX = Math.sin(theta) * rad;
    const featherZ = Math.cos(theta) * rad * 0.5;
    
    const twist = -y * 0.2; // Opposite twist
    const finalX = featherX * Math.cos(twist) - featherZ * Math.sin(twist);
    const finalZ = featherX * Math.sin(twist) + featherZ * Math.cos(twist);

    positions[i * 3] = finalX + 5; // Shift Right
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = finalZ;
  }
  
  return positions;
};

// 2. Chaos: Lorenz Attractor
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

    positions[i * 3] = x * 0.5;
    positions[i * 3 + 1] = y * 0.5 - 10;
    positions[i * 3 + 2] = z * 0.5 - 10;
  }
  return positions;
};

// 3. Mobius Strip
const generateMobius = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = (Math.random() * 2) - 1;
    const radius = 8;

    const x = (1 + v / 2 * Math.cos(u / 2)) * Math.cos(u) * radius;
    const y = (1 + v / 2 * Math.cos(u / 2)) * Math.sin(u) * radius;
    const z = (v / 2 * Math.sin(u / 2)) * radius * 2; 

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
};

// 4. Heart (3D)
const generateHeart = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3);
  let i = 0;
  while (i < count) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI; 
    
    const x = 16 * Math.pow(Math.sin(v), 3) * Math.sin(u);
    const y = (13 * Math.cos(v) - 5 * Math.cos(2 * v) - 2 * Math.cos(3 * v) - Math.cos(4 * v));
    const z = 16 * Math.pow(Math.sin(v), 3) * Math.cos(u);

    const scale = 0.5;
    positions[i * 3] = x * scale;
    positions[i * 3 + 1] = y * scale;
    positions[i * 3 + 2] = z * scale;
    i++;
  }
  return positions;
};

// 5. Spiral Galaxy
const generateGalaxy = (count: number): Float32Array => {
    const positions = new Float32Array(count * 3);
    const arms = 3;
    const armWidth = 1.5;
    
    for (let i = 0; i < count; i++) {
        const armIndex = i % arms;
        const distance = Math.random(); 
        const maxAngle = 4 * Math.PI;
        const angle = distance * maxAngle;
        const radius = 2 + angle * 3; 

        const armAngle = (Math.PI * 2 / arms) * armIndex;
        const finalAngle = angle + armAngle;

        const spread = (Math.random() - 0.5) * armWidth * (2 + distance * 5);
        const heightSpread = (Math.random() - 0.5) * (1 + distance * 5);

        const x = (radius + spread) * Math.cos(finalAngle);
        const y = (radius + spread) * Math.sin(finalAngle);
        const z = heightSpread * (1 - distance * 0.5);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }
    return positions;
}

export const getShapePositions = (type: ShapeType): Float32Array => {
  switch (type) {
    case ShapeType.SPINE:
      return generateSpine(COUNT);
    case ShapeType.CHAOS:
      return generateLorenz(COUNT);
    case ShapeType.MOBIUS:
      return generateMobius(COUNT);
    case ShapeType.HEART:
      return generateHeart(COUNT);
    case ShapeType.GALAXY:
      return generateGalaxy(COUNT);
    default:
      return generateSpine(COUNT);
  }
};

export const PARTICLE_COUNT = COUNT;