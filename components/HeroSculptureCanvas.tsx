"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Group, MeshPhysicalMaterial, Quaternion, Vector3 } from "three";
import { brandEdges, brandNodes, type Vec3 } from "@/lib/brandGraph";

function midpoint(a: Vec3, b: Vec3): Vec3 {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

function Tube({
  from,
  to,
  radius,
  material,
}: {
  from: Vec3;
  to: Vec3;
  radius: number;
  material: MeshPhysicalMaterial;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new Vector3(...from);
    const end = new Vector3(...to);
    const dir = end.clone().sub(start);
    const length = dir.length();
    const quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      dir.normalize(),
    );
    return { position: midpoint(from, to), quaternion, length };
  }, [from, to]);

  return (
    <mesh position={position} quaternion={quaternion} material={material}>
      <cylinderGeometry args={[radius, radius, Math.max(length, 0.01), 24]} />
    </mesh>
  );
}

function NetworkMark() {
  const material = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: "#9aa3ad",
        metalness: 1,
        roughness: 0.12,
        envMapIntensity: 2.3,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      }),
    [],
  );

  return (
    <group>
      {brandEdges.map((edge) => {
        const a = brandNodes[edge.a];
        const b = brandNodes[edge.b];
        if (!a || !b) {
          return null;
        }
        return (
          <Tube
            key={`${edge.a}-${edge.b}`}
            from={a.p}
            to={b.p}
            radius={edge.radius}
            material={material}
          />
        );
      })}
      {Object.values(brandNodes).map((node) =>
        node.r > 0 ? (
          <mesh key={node.id} position={node.p} material={material}>
            <sphereGeometry args={[node.r, 32, 32]} />
          </mesh>
        ) : null,
      )}
    </group>
  );
}

function Rig() {
  const ref = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1,
      };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const group = ref.current;
    if (!group) {
      return;
    }
    const t = state.clock.elapsedTime;
    const targetX = 0.08 + Math.sin(t * 0.38) * 0.05 + pointer.current.y * 0.1;
    const targetY = 0.1 + Math.sin(t * 0.45) * 0.16 + pointer.current.x * 0.22;
    group.rotation.x += (targetX - group.rotation.x) * Math.min(1, delta * 3);
    group.rotation.y += (targetY - group.rotation.y) * Math.min(1, delta * 2.4);
  });

  return (
    <group ref={ref} position={[0, 0.02, 0]} scale={1.18}>
      <NetworkMark />
    </group>
  );
}

export function HeroSculptureCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.02, 2.85], fov: 34 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(0x000000, 0);
        scene.background = null;
      }}
      className="h-full w-full"
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 3, 5]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-4, -1, 2]} intensity={1} color="#8eb6ff" />
      <spotLight
        position={[0, 4, 3]}
        intensity={16}
        angle={0.55}
        penumbra={0.6}
        color="#f4f7fb"
      />
      <Environment resolution={256}>
        <Lightformer intensity={6} position={[0, 3, 2]} scale={[8, 1.2, 1]} />
        <Lightformer
          intensity={3}
          position={[-3, 1, 2]}
          scale={4}
          color="#9ec5ff"
        />
        <Lightformer intensity={4} position={[3, 0.5, 3]} scale={[4, 2, 1]} />
        <Lightformer intensity={1.5} position={[0, -2, 2]} scale={5} />
      </Environment>
      <Rig />
    </Canvas>
  );
}
