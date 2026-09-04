import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ToyDragonCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    // Renderer with antialias and alpha
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Group for the dragon
    const dragonGroup = new THREE.Group();
    scene.add(dragonGroup);

    // Materials - Glossy Toy Plastic
    const bluePlastic = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#2563EB'),
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });

    const cyanPlastic = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#00F0FF'),
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.7,
    });

    const yellowPlastic = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFD600'),
      roughness: 0.25,
      metalness: 0.05,
      clearcoat: 0.6,
    });

    const whitePlastic = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFFFFF'),
      roughness: 0.1,
      metalness: 0.0,
      clearcoat: 0.9,
    });

    const blackPlastic = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#111827'),
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 0.9,
    });

    const pinkPlastic = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#EC4899'),
      roughness: 0.2,
      clearcoat: 0.5,
    });

    // 1. Head (Rounded Cube / Sphere mix)
    const headGeo = new THREE.SphereGeometry(1.2, 32, 32);
    headGeo.scale(1, 0.9, 1.1);
    const head = new THREE.Mesh(headGeo, bluePlastic);
    head.position.set(0, 0.6, 0.2);
    dragonGroup.add(head);

    // Snout / Muzzle
    const snoutGeo = new THREE.SphereGeometry(0.7, 24, 24);
    snoutGeo.scale(1, 0.7, 1.2);
    const snout = new THREE.Mesh(snoutGeo, cyanPlastic);
    snout.position.set(0, 0.4, 0.9);
    dragonGroup.add(snout);

    // Nostrils
    const nostrilGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const leftNostril = new THREE.Mesh(nostrilGeo, bluePlastic);
    leftNostril.position.set(-0.25, 0.5, 1.55);
    const rightNostril = leftNostril.clone();
    rightNostril.position.set(0.25, 0.5, 1.55);
    dragonGroup.add(leftNostril, rightNostril);

    // Eyes
    const eyeWhiteGeo = new THREE.SphereGeometry(0.38, 24, 24);
    const leftEyeWhite = new THREE.Mesh(eyeWhiteGeo, whitePlastic);
    leftEyeWhite.position.set(-0.65, 0.9, 0.8);
    const rightEyeWhite = leftEyeWhite.clone();
    rightEyeWhite.position.set(0.65, 0.9, 0.8);
    dragonGroup.add(leftEyeWhite, rightEyeWhite);

    // Pupils
    const pupilGeo = new THREE.SphereGeometry(0.22, 20, 20);
    pupilGeo.scale(1, 1, 0.5);
    const leftPupil = new THREE.Mesh(pupilGeo, blackPlastic);
    leftPupil.position.set(-0.68, 0.92, 1.1);
    const rightPupil = leftPupil.clone();
    rightPupil.position.set(0.68, 0.92, 1.1);
    dragonGroup.add(leftPupil, rightPupil);

    // Eye Highlights (Sparkle)
    const sparkleGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const leftSparkle = new THREE.Mesh(sparkleGeo, whitePlastic);
    leftSparkle.position.set(-0.62, 1.02, 1.2);
    const rightSparkle = leftSparkle.clone();
    rightSparkle.position.set(0.74, 1.02, 1.2);
    dragonGroup.add(leftSparkle, rightSparkle);

    // Cute Cheeks
    const cheekGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const leftCheek = new THREE.Mesh(cheekGeo, pinkPlastic);
    leftCheek.position.set(-0.85, 0.45, 0.7);
    const rightCheek = leftCheek.clone();
    rightCheek.position.set(0.85, 0.45, 0.7);
    dragonGroup.add(leftCheek, rightCheek);

    // Horns (Yellow Cones)
    const hornGeo = new THREE.ConeGeometry(0.3, 0.8, 24);
    const leftHorn = new THREE.Mesh(hornGeo, yellowPlastic);
    leftHorn.position.set(-0.7, 1.6, -0.2);
    leftHorn.rotation.set(-0.3, 0, -0.4);
    const rightHorn = new THREE.Mesh(hornGeo, yellowPlastic);
    rightHorn.position.set(0.7, 1.6, -0.2);
    rightHorn.rotation.set(-0.3, 0, 0.4);
    dragonGroup.add(leftHorn, rightHorn);

    // 2. Body (Chubby Cute Pear Shape)
    const bodyGeo = new THREE.SphereGeometry(1.35, 32, 32);
    bodyGeo.scale(1, 1.2, 1.05);
    const body = new THREE.Mesh(bodyGeo, bluePlastic);
    body.position.set(0, -1.1, -0.2);
    dragonGroup.add(body);

    // Yellow Belly Plates
    const bellyGeo = new THREE.SphereGeometry(0.9, 24, 24);
    bellyGeo.scale(0.85, 1.1, 0.4);
    const belly = new THREE.Mesh(bellyGeo, yellowPlastic);
    belly.position.set(0, -1.0, 0.75);
    dragonGroup.add(belly);

    // 3. Cute Wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.quadraticCurveTo(0.6, 1.2, 1.4, 1.1);
    wingShape.quadraticCurveTo(1.1, 0.4, 1.5, -0.2);
    wingShape.quadraticCurveTo(0.7, 0.1, 0, 0);

    const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings);
    
    const leftWing = new THREE.Mesh(wingGeo, cyanPlastic);
    leftWing.position.set(-0.8, -0.6, -0.6);
    leftWing.rotation.set(0.2, 0.6, 0.4);
    leftWing.scale.set(0.85, 0.85, 0.85);

    const rightWing = new THREE.Mesh(wingGeo, cyanPlastic);
    rightWing.position.set(0.8, -0.6, -0.6);
    rightWing.rotation.set(0.2, -0.6, -0.4);
    rightWing.scale.set(-0.85, 0.85, 0.85);
    dragonGroup.add(leftWing, rightWing);

    // 4. Back Spines (Multi-color toy ridges)
    for (let i = 0; i < 5; i++) {
      const spineGeo = new THREE.ConeGeometry(0.18 - i * 0.02, 0.45 - i * 0.04, 16);
      const spine = new THREE.Mesh(spineGeo, yellowPlastic);
      spine.position.set(0, 1.4 - i * 0.6, -0.8 - (i * 0.1));
      spine.rotation.set(-0.8, 0, 0);
      dragonGroup.add(spine);
    }

    // 5. Tail with Cute Heart/Spade tip
    const tailSegGeo = new THREE.SphereGeometry(0.45, 16, 16);
    const tail1 = new THREE.Mesh(tailSegGeo, bluePlastic);
    tail1.position.set(0, -1.9, -1.0);
    const tail2 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), bluePlastic);
    tail2.position.set(0.2, -2.1, -1.5);
    const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 16), yellowPlastic);
    tailTip.position.set(0.3, -2.0, -2.0);
    tailTip.rotation.set(1.5, 0.5, 0);
    dragonGroup.add(tail1, tail2, tailTip);

    // Floating Spool in Orbit
    const spoolGroup = new THREE.Group();
    const spoolRimGeo = new THREE.TorusGeometry(0.5, 0.12, 16, 32);
    const spoolRim = new THREE.Mesh(spoolRimGeo, cyanPlastic);
    const spoolCoilGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.35, 32);
    const spoolCoil = new THREE.Mesh(spoolCoilGeo, pinkPlastic);
    spoolCoil.rotation.x = Math.PI / 2;
    spoolGroup.add(spoolRim, spoolCoil);
    spoolGroup.position.set(2.2, 1.2, 0.5);
    spoolGroup.scale.set(0.6, 0.6, 0.6);
    dragonGroup.add(spoolGroup);

    // Floating Star
    const starGeo = new THREE.OctahedronGeometry(0.35, 0);
    const star = new THREE.Mesh(starGeo, yellowPlastic);
    star.position.set(-2.0, 1.4, 0.8);
    dragonGroup.add(star);

    // Lighting (Warm Key + Blue Rim + Cyan Fill)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x00F0FF, 3, 20);
    cyanRimLight.position.set(-6, -2, -3);
    scene.add(cyanRimLight);

    const pinkFillLight = new THREE.PointLight(0xEC4899, 2.5, 20);
    pinkFillLight.position.set(4, -4, 3);
    scene.add(pinkFillLight);

    // Interactive mouse / touch tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle float & breathing animation
      dragonGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.22;
      dragonGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.05;

      // Spool rotation
      spoolGroup.rotation.x += 0.02;
      spoolGroup.rotation.y += 0.03;
      spoolGroup.position.y = 1.2 + Math.sin(elapsedTime * 2.0) * 0.15;

      // Star rotation
      star.rotation.x += 0.015;
      star.rotation.y += 0.02;
      star.position.y = 1.4 + Math.cos(elapsedTime * 1.8) * 0.12;

      // Flap wings slightly
      leftWing.rotation.z = 0.4 + Math.sin(elapsedTime * 3) * 0.15;
      rightWing.rotation.z = -0.4 - Math.sin(elapsedTime * 3) * 0.15;

      // Smooth mouse follow
      targetRotationY = mouseX * 0.6;
      targetRotationX = mouseY * 0.4;
      dragonGroup.rotation.y += (targetRotationY - dragonGroup.rotation.y) * 0.05;
      dragonGroup.rotation.x += (targetRotationX - dragonGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
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
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Radial backlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/30 via-brand-cyan/20 to-brand-pink/30 rounded-full filter blur-3xl opacity-70 pointer-events-none transform scale-90" />
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-10" />
    </div>
  );
};
