import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const FloatingShapesCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 700;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 2.5);
    dirLight1.position.set(5, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xec4899, 2.0);
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    // Materials
    const blueMat = new THREE.MeshPhysicalMaterial({ color: 0x2563eb, roughness: 0.2, clearcoat: 0.8 });
    const cyanMat = new THREE.MeshPhysicalMaterial({ color: 0x06b6d4, roughness: 0.15, clearcoat: 0.8 });
    const pinkMat = new THREE.MeshPhysicalMaterial({ color: 0xec4899, roughness: 0.2, clearcoat: 0.7 });
    const yellowMat = new THREE.MeshPhysicalMaterial({ color: 0xfacc15, roughness: 0.2, clearcoat: 0.6 });
    const purpleMat = new THREE.MeshPhysicalMaterial({ color: 0x8b5cf6, roughness: 0.2, clearcoat: 0.8 });

    const materials = [blueMat, cyanMat, pinkMat, yellowMat, purpleMat];

    // Create 12 floating objects
    const geometries = [
      new THREE.TorusGeometry(0.6, 0.22, 16, 32),
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
      new THREE.SphereGeometry(0.55, 20, 20),
      new THREE.ConeGeometry(0.6, 1.0, 16),
      new THREE.OctahedronGeometry(0.6, 0),
      new THREE.DodecahedronGeometry(0.5, 0)
    ];

    const objects: Array<{
      mesh: THREE.Mesh;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      floatSpeed: number;
      floatOffset: number;
      initialY: number;
    }> = [];

    for (let i = 0; i < 10; i++) {
      const geo = geometries[i % geometries.length];
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(geo, mat);

      // Random position spread
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 6 - 2;

      mesh.position.set(x, y, z);
      const scale = 0.5 + Math.random() * 0.6;
      mesh.scale.set(scale, scale, scale);

      scene.add(mesh);

      objects.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.01,
        floatSpeed: 0.5 + Math.random() * 0.8,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: y
      });
    }

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      objects.forEach(obj => {
        obj.mesh.rotation.x += obj.rotSpeedX;
        obj.mesh.rotation.y += obj.rotSpeedY;
        obj.mesh.rotation.z += obj.rotSpeedZ;
        obj.mesh.position.y = obj.initialY + Math.sin(time * obj.floatSpeed + obj.floatOffset) * 0.4;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none opacity-40 mix-blend-screen overflow-hidden ${className}`} />
  );
};
