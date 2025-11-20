import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ParticleSystem from './components/ParticleSystem';
import HolographicUI from './components/HolographicUI';
import { ShapeType, ShapeInfo } from './types';

// Configuration for all shapes
const SHAPES: Record<ShapeType, ShapeInfo> = {
  [ShapeType.CHAOS]: {
    id: ShapeType.CHAOS,
    name: 'LORENZ ATTRACTOR',
    formula: 'dx/dt = σ(y-x)\ndy/dt = x(ρ-z)-y\ndz/dt = xy - βz',
    desc: 'A chaotic system where small changes in initial conditions produce large variations.'
  },
  [ShapeType.MOBIUS]: {
    id: ShapeType.MOBIUS,
    name: 'MÖBIUS STRIP',
    formula: 'x = [1 + (v/2)cos(u/2)]cos(u)\ny = [1 + (v/2)cos(u/2)]sin(u)\nz = (v/2)sin(u/2)',
    desc: 'A non-orientable surface with only one side and one boundary.'
  },
  [ShapeType.HEART]: {
    id: ShapeType.HEART,
    name: 'DESCARTES HEART',
    formula: '(x² + 9/4y² + z² - 1)³ - x²z³ - 9/80y²z³ = 0',
    desc: 'A complex algebraic surface creating a 3D heart shape.'
  },
  [ShapeType.TORUS]: {
    id: ShapeType.TORUS,
    name: 'TORUS KNOT',
    formula: 'r = 10 + 5cos(3u/2)\nx = r·cos(u), y = r·sin(u)\nz = 5sin(3u/2)',
    desc: 'A knot wound around a torus; specifically a (2,3) trefoil configuration.'
  },
  [ShapeType.GALAXY]: {
    id: ShapeType.GALAXY,
    name: 'LOGARITHMIC SPIRAL',
    formula: 'r = a · e^(bθ)\nx = r·cos(θ), y = r·sin(θ)',
    desc: 'Simulating galactic arms using logarithmic spiral equations.'
  }
};

const SHAPE_KEYS = Object.values(ShapeType);
const TRANSITION_DURATION = 10; // seconds

const SceneContent = ({ currentShape }: { currentShape: ShapeType }) => {
  return (
    <>
      <color attach="background" args={['#020205']} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
      
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5} 
      />

      <ParticleSystem shape={currentShape} />

      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.1} 
          mipmapBlur 
          intensity={1.2} 
          radius={0.5} 
        />
      </EffectComposer>

      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        autoRotate 
        autoRotateSpeed={0.8}
        minDistance={5}
        maxDistance={60}
      />
    </>
  );
};

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TRANSITION_DURATION);

  const currentShape = SHAPE_KEYS[currentIndex];
  const nextShape = SHAPE_KEYS[(currentIndex + 1) % SHAPE_KEYS.length];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCurrentIndex((curr) => (curr + 1) % SHAPE_KEYS.length);
          return TRANSITION_DURATION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      <HolographicUI 
        currentShapeInfo={SHAPES[currentShape]} 
        nextShapeName={SHAPES[nextShape].name}
        timeToNext={timeLeft}
      />
      
      <Canvas
        camera={{ position: [0, 0, 35], fov: 55 }}
        dpr={[1, 2]} 
        gl={{ antialias: false }}
      >
        <Suspense fallback={null}>
          <SceneContent currentShape={currentShape} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
