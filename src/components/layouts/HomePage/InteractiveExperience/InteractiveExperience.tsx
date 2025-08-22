"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useState } from "react";
import { useSpring, a } from "@react-spring/three";
import Link from "next/link"; 

// Lá bài 3D với hiệu ứng flip
function Card() {
  const [flipped, setFlipped] = useState(false);
  const [front, back] = useTexture([
    "/sweet&SpicyFront.png",
    "/sweet&SpicyBack.png",
  ]);

  // vật liệu cho từng mặt
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });
  const frontMaterial = new THREE.MeshStandardMaterial({ map: front });
  const backMaterial = new THREE.MeshStandardMaterial({ map: back });

  // animation xoay 180°
  const { rotationY } = useSpring({
    rotationY: flipped ? Math.PI : 0,
    config: { mass: 1, tension: 180, friction: 20 },
  });

  return (
    <a.mesh
      rotation-y={rotationY}
      rotation-x={0.1}
      rotation-z={0}
      onClick={() => setFlipped(!flipped)}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <boxGeometry args={[2.5, 3, 0.05]} />
      <meshStandardMaterial attach="material-0" {...edgeMaterial} />
      <meshStandardMaterial attach="material-1" {...edgeMaterial} />
      <meshStandardMaterial attach="material-2" {...edgeMaterial} />
      <meshStandardMaterial attach="material-3" {...edgeMaterial} />
      <meshStandardMaterial attach="material-4" {...frontMaterial} />
      <meshStandardMaterial attach="material-5" {...backMaterial} />
    </a.mesh>
  );
}

export default function InteractiveExperience() {
  return (
    <section className="py-20 bg-gradient-to-br from-background-800 to-background-50 text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
        {/* Text giới thiệu */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-4">Trải nghiệm Board Game đang hot</h2>
          <p className="text-lg text-gray-300 mb-6">
            Click vào lá bài để lật mặt trước / mặt sau. 
            Cảm giác chân thực như cầm bài ngoài đời!
          </p>

          <Link href="/products/sweet-and-spicy" passHref>
            <motion.a
              whileHover={{ scale: 1.1 }}
              className="inline-block bg-background-500 px-6 py-3 rounded-lg text-lg font-semibold cursor-pointer"
            >
              Khám phá thêm
            </motion.a>
          </Link>
        </motion.div>

        {/* Phần 3D */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="h-[400px] bg-gray-800 rounded-lg"
        >
          <Canvas>
            <ambientLight />
            <directionalLight position={[2, 2, 2]} />
            <Card />
            <OrbitControls enableZoom={true} />
          </Canvas>
        </motion.div>
      </div>
    </section>
  );
}
