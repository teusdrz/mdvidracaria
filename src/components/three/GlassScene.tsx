"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import type { Mesh } from "three";

function GlassPanel() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2}>
        <boxGeometry args={[1.8, 2.4, 0.05]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.5}
          chromaticAberration={0.3}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#1C4587"
          roughness={0.05}
          transmission={0.98}
          ior={1.5}
        />
      </mesh>
    </Float>
  );
}

function GlassDiamond() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
      <mesh ref={meshRef} position={[2.5, -0.5, -1]} scale={0.8}>
        <octahedronGeometry args={[1, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.8}
          chromaticAberration={0.5}
          anisotropy={0.5}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.05}
          color="#C9A96E"
          roughness={0.02}
          transmission={0.95}
          ior={2.0}
        />
      </mesh>
    </Float>
  );
}

function SmallShards() {
  const group = useRef<any>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={group}>
      {[
        [-3, 1.5, -2],
        [3.5, 2, -3],
        [-2.5, -1.5, -1],
        [1, 2.5, -2],
        [-1, -2, -3],
      ].map((pos, i) => (
        <Float key={i} speed={1 + i * 0.3} rotationIntensity={0.8}>
          <mesh position={pos as [number, number, number]} scale={0.3 + i * 0.08}>
            <tetrahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#1C4587" : "#C9A96E"}
              transparent
              opacity={0.3}
              roughness={0.1}
              metalness={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function GlassScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, 5]} intensity={0.5} color="#C9A96E" />
          <pointLight position={[5, 0, -5]} intensity={0.3} color="#1C4587" />
          <GlassPanel />
          <GlassDiamond />
          <SmallShards />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
