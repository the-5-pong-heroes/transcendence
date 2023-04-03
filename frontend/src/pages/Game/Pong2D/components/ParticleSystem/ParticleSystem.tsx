/* eslint-disable react/no-unknown-property */

import React from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { type Vec3 } from "cannon-es";

import { fragmentShader, vertexShader } from "./shaders";
import { computePositions, computeUniforms } from "./helpers";

interface ParticleSystemProps {
  particlesRef: React.RefObject<THREE.Points>;
  initialPos: Vec3;
}

const UNIFORMS = computeUniforms();
const POSITIONS = computePositions();
const ITEM_SIZE = 3;

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ particlesRef, initialPos }) => {
  return (
    <points ref={particlesRef} position={new Vector3(initialPos.x, initialPos.y, initialPos.z)}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={POSITIONS}
          count={POSITIONS.length / ITEM_SIZE}
          itemSize={ITEM_SIZE}
        />
      </bufferGeometry>
      <shaderMaterial
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={UNIFORMS}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
