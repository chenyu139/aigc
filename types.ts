import React from 'react';
import { ThreeElements } from '@react-three/fiber';

export enum ShapeType {
  SPINE = 'Cyber Spine',
  CHAOS = 'Lorenz Attractor',
  MOBIUS = 'Möbius Strip',
  HEART = 'Descartes Heart',
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
  formula: React.ReactNode; // Changed to ReactNode to allow rich formatting
  desc: string;
}

// Define the specific R3F elements to avoid "Property does not exist" errors
interface CustomThreeElements {
  points: any;
  bufferGeometry: any;
  bufferAttribute: any;
  pointsMaterial: any;
  ambientLight: any;
  pointLight: any;
  color: any;
}

// Augment the global JSX namespace to include R3F elements explicitly
declare global {
  namespace JSX {
    interface IntrinsicElements extends CustomThreeElements {}
  }
}

// Also augment React's module JSX namespace which is required for certain project configurations
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends CustomThreeElements {}
  }
}