import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getShapePositions, PARTICLE_COUNT } from '../utils/mathGenerators';
import { ShapeType } from '../types';

interface ParticleSystemProps {
  shape: ShapeType;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ shape }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const currentPositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const targetPositions = useMemo(() => getShapePositions(shape), [shape]);
  
  useMemo(() => {
    if (currentPositions[0] === 0 && currentPositions[1] === 0) {
        currentPositions.set(targetPositions);
    }
  }, [currentPositions, targetPositions]);

  // Dynamic Coloring based on Position (X-axis split for Orange/Blue duality)
  const colors = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const colorAttr = pointsRef.current.geometry.attributes.color;
    const time = state.clock.getElapsedTime();
    
    const lerpFactor = 0.04; 

    // Colors
    const cOrange = new THREE.Color('#ff9900'); // Orange
    const cGold = new THREE.Color('#ffcc00');   // Gold
    const cBlue = new THREE.Color('#0088ff');   // Blue
    const cCyan = new THREE.Color('#00ffff');   // Cyan
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Interpolation
      positions[ix] += (targetPositions[ix] - positions[ix]) * lerpFactor;
      positions[iy] += (targetPositions[iy] - positions[iy]) * lerpFactor;
      positions[iz] += (targetPositions[iz] - positions[iz]) * lerpFactor;

      // Noise / Breathing
      const noiseAmp = 0.02;
      positions[ix] += Math.sin(time * 3 + positions[iy] * 0.5) * noiseAmp;
      positions[iy] += Math.cos(time * 2 + positions[iz] * 0.5) * noiseAmp;
      positions[iz] += Math.sin(time * 2.5 + positions[ix] * 0.5) * noiseAmp;

      // Update Colors based on current X position to match the "Dual Life" look
      const xVal = positions[ix];
      let col;
      
      // If x < 0 (Left side) -> Orange/Gold
      // If x > 0 (Right side) -> Blue/Cyan
      if (xVal < 0) {
         const t = Math.min(1, Math.abs(xVal) / 10);
         col = cOrange.clone().lerp(cGold, t + Math.sin(time + i)*0.2);
      } else {
         const t = Math.min(1, Math.abs(xVal) / 10);
         col = cBlue.clone().lerp(cCyan, t + Math.cos(time + i)*0.2);
      }
      
      // Add a bit of shimmer
      col.multiplyScalar(1.0 + Math.sin(time * 5 + i) * 0.2);

      colors[ix] = col.r;
      colors[ix+1] = col.g;
      colors[ix+2] = col.b;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    colorAttr.needsUpdate = true;
    
    pointsRef.current.rotation.y = time * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={currentPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleSystem;