'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, PerspectiveCamera, Environment, MeshTransmissionMaterial, RoundedBox, Torus } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

/* --- 3D Geometries --- */

function TravelObj({ ...props }) {
    return (
        <group {...props}>
            {/* Central Globe */}
            <mesh>
                <sphereGeometry args={[0.9, 32, 32]} />
                <MeshTransmissionMaterial
                    backside
                    thickness={1}
                    roughness={0.1}
                    transmission={1}
                    ior={1.5}
                    chromaticAberration={0.2}
                    color="#ff0050"
                    distortion={0.2}
                />
            </mesh>

            {/* Orbital Rings (Travel Paths) */}
            <group rotation={[0.5, 0.5, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[1.4, 0.05, 16, 100]} />
                    <meshStandardMaterial color="#ff0050" emissive="#ff0050" emissiveIntensity={0.5} />
                </mesh>
                <mesh rotation={[0, Math.PI / 2, 0]}>
                    <torusGeometry args={[1.25, 0.05, 16, 100]} />
                    <meshStandardMaterial color="#ff0050" emissive="#ff0050" emissiveIntensity={0.5} />
                </mesh>
            </group>
        </group>
    )
}

function CameraObj({ ...props }) {
    return (
        <group {...props}>
            {/* Modern Body - Rounded */}
            <RoundedBox args={[2, 1.5, 0.8]} radius={0.2} smoothness={4}>
                <MeshTransmissionMaterial
                    backside
                    thickness={1}
                    roughness={0.2}
                    transmission={1}
                    ior={1.5}
                    chromaticAberration={0.3}
                    color="#ffaa00"
                    distortion={0.2}
                />
            </RoundedBox>

            {/* Pro Lens */}
            <group position={[0, 0, 0.5]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.7, 0.7, 0.4, 64]} />
                    <meshStandardMaterial color="#111" roughness={0.2} metalness={0.8} />
                </mesh>
                {/* Glass Element */}
                <mesh position={[0, 0, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
                    <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.3]} />
                    <MeshTransmissionMaterial
                        thickness={0.5}
                        roughness={0}
                        transmission={1}
                        ior={1.5}
                        color="white"
                    />
                </mesh>
            </group>

            {/* Abstract Flash/Sensor */}
            <mesh position={[0.7, 0.5, 0.45]}>
                <circleGeometry args={[0.15, 32]} />
                <meshBasicMaterial color="white" />
            </mesh>
        </group>
    )
}

function Phone({ ...props }) {
    return (
        <group {...props}>
            {/* Sleek Glass Slab */}
            <RoundedBox args={[1.1, 2.2, 0.15]} radius={0.1} smoothness={4}>
                <MeshTransmissionMaterial
                    backside
                    thickness={0.5}
                    roughness={0.1}
                    transmission={1}
                    ior={1.5}
                    chromaticAberration={0.2}
                    color="#bd00ff"
                />
            </RoundedBox>

            {/* Glowing Border/Frame */}
            <RoundedBox args={[1.12, 2.22, 0.14]} radius={0.1} smoothness={4}>
                <meshStandardMaterial color="#bd00ff" emissive="#bd00ff" emissiveIntensity={0.5} transparent opacity={0.3} />
            </RoundedBox>

            {/* Dynamic Island / Notch */}
            <mesh position={[0, 0.9, 0.08]} rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
                <meshStandardMaterial color="black" roughness={0.2} />
            </mesh>
        </group>
    )
}

function SceneContent() {
    const group = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (group.current) {
            const { x, y } = state.mouse
            // Smooth, floaty rotation
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y * 0.05, 0.05)
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.05, 0.05)
        }
    })

    return (
        <group ref={group}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
                <TravelObj position={[3.5, 2, -2]} rotation={[0, 0, -Math.PI / 4]} scale={0.8} />
            </Float>

            <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8} floatingRange={[-0.2, 0.2]}>
                <CameraObj position={[-3.5, -1.5, -1]} rotation={[0, Math.PI / 6, 0]} scale={0.7} />
            </Float>

            <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2} floatingRange={[-0.2, 0.2]}>
                <Phone position={[-2.5, 2.5, -3]} rotation={[0, -Math.PI / 4, Math.PI / 6]} scale={0.8} />
            </Float>
        </group>
    )
}

export default function Scene3D() {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#00f0ff" />
                <Environment preset="city" />

                <SceneContent />
            </Canvas>
        </div>
    )
}
