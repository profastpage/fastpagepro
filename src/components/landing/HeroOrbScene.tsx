"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import type { Group, Mesh } from "three";

function OrbSceneContent() {
  const coreRef = useRef<Mesh>(null);
  const speedRingRef = useRef<Mesh>(null);
  const webRingRef = useRef<Mesh>(null);
  const packetGroupRef = useRef<Group>(null);
  const boltRef = useRef<Group>(null);

  const packets = useMemo(
    () => [
      { angle: 0.15, radius: 2.12, y: 0.22, size: 0.09 },
      { angle: 1.7, radius: 2.02, y: -0.34, size: 0.08 },
      { angle: 2.8, radius: 2.16, y: 0.4, size: 0.11 },
      { angle: 4.35, radius: 2.1, y: -0.16, size: 0.1 },
      { angle: 5.2, radius: 1.96, y: 0.28, size: 0.07 },
    ],
    [],
  );

  useFrame((state, delta) => {
    const elapsed = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.55;
      coreRef.current.rotation.x = Math.sin(elapsed * 0.85) * 0.1;
      const pulse = 1 + Math.sin(elapsed * 2.2) * 0.04;
      coreRef.current.scale.setScalar(pulse);
    }
    if (speedRingRef.current) {
      speedRingRef.current.rotation.z += delta * 0.85;
      speedRingRef.current.rotation.x = Math.PI / 2.2 + Math.sin(elapsed * 0.5) * 0.06;
    }
    if (webRingRef.current) {
      webRingRef.current.rotation.y -= delta * 0.34;
      webRingRef.current.rotation.x = Math.PI / 2.5 + Math.sin(elapsed * 0.42) * 0.04;
    }
    if (packetGroupRef.current) {
      packetGroupRef.current.rotation.y += delta * 0.6;
      packetGroupRef.current.rotation.z = Math.sin(elapsed * 0.65) * 0.06;
    }
    if (boltRef.current) {
      boltRef.current.rotation.y = Math.sin(elapsed * 0.9) * 0.45;
      boltRef.current.position.y = 0.06 + Math.sin(elapsed * 1.8) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 3]} color="#fbbf24" intensity={14} distance={10} />
      <pointLight position={[-2.1, 1.4, -1]} color="#22d3ee" intensity={8} distance={9} />
      <directionalLight position={[1.8, 2.2, 2.2]} intensity={1.15} color="#fff4cf" />

      <Float speed={1.05} floatIntensity={0.5} rotationIntensity={0.15}>
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.94, 44, 44]} />
          <meshStandardMaterial
            color="#fde68a"
            emissive="#f59e0b"
            emissiveIntensity={0.58}
            metalness={0.48}
            roughness={0.22}
          />
        </mesh>
      </Float>

      <mesh ref={speedRingRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.86, 0.082, 22, 140]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#b45309"
          emissiveIntensity={0.4}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>

      <mesh ref={webRingRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.15, 0.025, 16, 160]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0e7490"
          emissiveIntensity={0.44}
          transparent
          opacity={0.8}
          metalness={0.5}
          roughness={0.28}
        />
      </mesh>

      <group ref={boltRef} position={[0.03, 0.08, 1.18]}>
        <mesh position={[0.05, 0.45, 0]}>
          <boxGeometry args={[0.26, 0.7, 0.14]} />
          <meshStandardMaterial color="#fde047" emissive="#f59e0b" emissiveIntensity={0.62} />
        </mesh>
        <mesh position={[-0.12, 0.03, 0]} rotation={[0, 0, 0.44]}>
          <boxGeometry args={[0.22, 0.62, 0.14]} />
          <meshStandardMaterial color="#facc15" emissive="#d97706" emissiveIntensity={0.55} />
        </mesh>
        <mesh position={[0.08, -0.32, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.2, 0.56, 0.14]} />
          <meshStandardMaterial color="#fef08a" emissive="#ca8a04" emissiveIntensity={0.5} />
        </mesh>
      </group>

      <group ref={packetGroupRef}>
        {packets.map((packet, index) => (
          <mesh
            key={`${packet.angle}-${packet.radius}-${packet.size}-${index}`}
            position={[
              Math.cos(packet.angle) * packet.radius,
              packet.y,
              Math.sin(packet.angle) * packet.radius,
            ]}
          >
            <sphereGeometry args={[packet.size, 16, 16]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#67e8f9" : "#fde68a"}
              emissive={index % 2 === 0 ? "#155e75" : "#92400e"}
              emissiveIntensity={0.48}
              roughness={0.32}
              metalness={0.3}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}

export default function HeroOrbScene() {
  return (
    <div className="relative h-[220px] overflow-hidden rounded-2xl border border-amber-300/20 bg-[radial-gradient(circle_at_18%_22%,rgba(251,191,36,0.2),transparent_48%),radial-gradient(circle_at_82%_70%,rgba(34,211,238,0.14),transparent_52%),linear-gradient(150deg,rgba(7,8,10,0.98),rgba(14,16,20,0.9))]">
      <Canvas
        dpr={[1, 1.4]}
        camera={{ position: [0, 0, 5.2], fov: 38 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <OrbSceneContent />
      </Canvas>
      <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-amber-300/35 bg-black/40 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200/95">
        Fast Web Engine
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
    </div>
  );
}
