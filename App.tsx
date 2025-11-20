import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ParticleSystem from './components/ParticleSystem';
import HolographicUI from './components/HolographicUI';
import { ShapeType, ShapeInfo } from './types';

// Configuration with React Nodes for rich formula display
const SHAPES: Record<ShapeType, ShapeInfo> = {
  [ShapeType.SPINE]: {
    id: ShapeType.SPINE,
    name: '赛博脊虫',
    formula: (
      <>
        <span className="text-cyan-300">x = i</span>, <span className="text-cyan-300">y = <span className="italic">i</span>/235</span>, <span className="text-orange-400">e = <span className="italic">y</span>/8 - 13</span>
        <br/>
        <span className="text-orange-400">k = (4 + 3sin(2<span className="italic">y</span> - <span className="italic">t</span>))cos(<span className="italic">x</span>/35)</span>, <span className="text-cyan-300">d = √<span className="overline">k² + e²</span></span>
      </>
    ),
    desc: 'A cyber-organic structure resembling a biological spine.'
  },
  [ShapeType.CHAOS]: {
    id: ShapeType.CHAOS,
    name: '洛伦兹吸引子',
    formula: (
      <>
        <span className="text-orange-400">dx/dt = σ(y-x)</span> &nbsp;
        <span className="text-cyan-300">dy/dt = x(ρ-z)-y</span> &nbsp;
        <span className="text-orange-400">dz/dt = xy - βz</span>
      </>
    ),
    desc: 'Chaotic system sensitive to initial conditions.'
  },
  [ShapeType.MOBIUS]: {
    id: ShapeType.MOBIUS,
    name: '莫比乌斯环',
    formula: (
      <>
        <span className="text-cyan-300">x = [1 + (v/2)cos(u/2)]cos(u)</span>
        <br/>
        <span className="text-orange-400">y = [1 + (v/2)cos(u/2)]sin(u)</span>
      </>
    ),
    desc: 'A surface with only one side and one boundary.'
  },
  [ShapeType.HEART]: {
    id: ShapeType.HEART,
    name: '笛卡尔心形',
    formula: (
      <>
        <span className="text-red-400">(x² + 9/4y² + z² - 1)³ - x²z³ - 9/80y²z³ = 0</span>
      </>
    ),
    desc: 'A 3D representation of love.'
  },
  [ShapeType.GALAXY]: {
    id: ShapeType.GALAXY,
    name: '对数螺线星系',
    formula: (
      <>
        <span className="text-cyan-300">r = a · e^(bθ)</span> &nbsp;
        <span className="text-orange-400">x = r·cos(θ), y = r·sin(θ)</span>
      </>
    ),
    desc: 'Geometric representation of a galaxy.'
  }
};

const SHAPE_KEYS = Object.values(ShapeType);
const TRANSITION_DURATION = 15; // Slightly longer for the video player feel

const SceneContent = ({ currentShape }: { currentShape: ShapeType }) => {
  return (
    <>
      <color attach="background" args={['#000000']} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ff9900" />
      
      <Stars 
        radius={100} 
        depth={50} 
        count={3000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5} 
      />

      <ParticleSystem shape={currentShape} />

      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.15} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.6} 
        />
      </EffectComposer>

      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        autoRotate 
        autoRotateSpeed={0.5}
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
        if (prev <= 0.1) {
          setCurrentIndex((curr) => (curr + 1) % SHAPE_KEYS.length);
          return TRANSITION_DURATION;
        }
        return prev - 0.1; // Smoother update for progress bar
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      <HolographicUI 
        currentShapeInfo={SHAPES[currentShape]} 
        nextShapeName={SHAPES[nextShape].name}
        timeToNext={timeLeft}
        totalDuration={TRANSITION_DURATION}
      />
      
      <Canvas
        camera={{ position: [0, 0, 40], fov: 45 }}
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