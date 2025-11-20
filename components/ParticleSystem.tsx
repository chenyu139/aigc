import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getShapePositions, PARTICLE_COUNT } from '../utils/mathGenerators';
import { ShapeType } from '../types';

interface ParticleSystemProps {
  shape: ShapeType;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ shape }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Buffers
  // currentPosition is the live buffer attribute displayed
  // targetPosition is where we want to go
  const currentPositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const targetPositions = useMemo(() => getShapePositions(shape), [shape]);
  
  // Initialize current positions to target (instant first load)
  useMemo(() => {
    if (currentPositions[0] === 0 && currentPositions[1] === 0) {
        currentPositions.set(targetPositions);
    }
  }, [currentPositions, targetPositions]);

  // Helper for colors based on shape
  const colorAttribute = useMemo(() => {
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const color1 = new THREE.Color('#00ffff'); // Cyan
    const color2 = new THREE.Color('#ff00ff'); // Magenta
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const mixed = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }
    return colors;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();
    
    // Morphing speed
    const lerpFactor = 0.03; 

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // 1. Interpolate towards target shape
      positions[ix] += (targetPositions[ix] - positions[ix]) * lerpFactor;
      positions[iy] += (targetPositions[iy] - positions[iy]) * lerpFactor;
      positions[iz] += (targetPositions[iz] - positions[iz]) * lerpFactor;

      // 2. Add subtle noise / "breathing" motion based on time
      // This gives the "Quantum/Living" feel
      const noiseAmp = 0.03;
      positions[ix] += Math.sin(time * 2 + positions[iy] * 0.5) * noiseAmp;
      positions[iy] += Math.cos(time * 1.5 + positions[iz] * 0.5) * noiseAmp;
      positions[iz] += Math.sin(time * 2.2 + positions[ix] * 0.5) * noiseAmp;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Slowly rotate the whole system
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.z = time * 0.02;
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
          array={colorAttribute}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};

export default ParticleSystem;
