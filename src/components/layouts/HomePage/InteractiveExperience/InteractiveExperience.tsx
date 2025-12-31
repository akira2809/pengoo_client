"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useState, useEffect } from "react";
import { useSpring, a } from "@react-spring/three";
import Link from "next/link"; 
import Image from "next/image";

// Lá bài 3D với hiệu ứng flip
function Card() {
  const [flipped, setFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [front, back] = useTexture([
    "/sweet&SpicyFront.png",
    "/sweet&SpicyBack.png",
  ]);
  
  // Animation và auto-rotate
  const { rotationY } = useSpring({
    rotationY: flipped ? Math.PI : 0,
    config: { mass: 1, tension: 180, friction: 20 },
    onRest: () => {
      if (!isHovered && !isDragging) {
        const timer = setTimeout(() => setFlipped(!flipped), 2000);
        return () => clearTimeout(timer);
      }
    },
  });

  // Vật liệu cho từng mặt
  const edgeMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff" });
  const frontMaterial = new THREE.MeshStandardMaterial({ map: front });
  const backMaterial = new THREE.MeshStandardMaterial({ map: back });

  // Bắt đầu auto-rotation khi component mount
  useEffect(() => {
    const timer = setTimeout(() => setFlipped(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <a.mesh
      rotation-y={rotationY}
      rotation-x={0.1}
      rotation-z={0}
      onClick={() => setFlipped(!flipped)}
      onPointerOver={() => {
        document.body.style.cursor = "grab";
        setIsHovered(true);
      }}
      onPointerDown={() => {
        document.body.style.cursor = "grabbing";
        setIsDragging(true);
      }}
      onPointerUp={() => {
        document.body.style.cursor = "grab";
        setIsDragging(false);
        // Resume auto-rotation after releasing the mouse button
        setTimeout(() => setFlipped(!flipped), 1000);
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
        setIsHovered(false);
        setIsDragging(false);
        // Resume auto-rotation after a delay when mouse leaves
        if (!isDragging) {
          setTimeout(() => setFlipped(!flipped), 1000);
        }
      }}
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
          <div className="relative h-full w-full">
            {/* Background Image */}
            <div 
              className="absolute inset-0 rounded-lg overflow-hidden"
            >
              <Image 
                src="../../../../../hinh-nen-dien-thoai-bau-troi-7.webp"  // Đường dẫn đến hình ảnh của bạn
                alt="Background"
                className="w-full h-full object-cover"
                width={200}
                height={200}
              />
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 rounded-lg" />
            
            {/* Optional Pattern Overlay */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.3\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/svg%3E")',
              }}
            />
            
            <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[2, 2, 2]} intensity={1} />
              <Card />
              <OrbitControls 
                enableZoom={true}
                minDistance={4}
                maxDistance={8}
                enablePan={false}
              />
            </Canvas>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
