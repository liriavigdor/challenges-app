import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Map mock avatar config strings to hex/CSS colors
const COLOR_MAP = {
  // Bases / Skin
  base_male_1: '#ffd1a9',
  base_female_1: '#f3c19d',
  base_alien: '#4ade80', // bright lime green
  base_robot: '#cbd5e1', // smooth metallic slate
  
  // Tops (Athletic shirts/tanktops)
  tshirt_black: '#1e293b',
  tshirt_white: '#f1f5f9',
  tshirt_red: '#ef4444',
  tshirt_blue: '#3b82f6',
  tshirt_green: '#10b981',
  hoodie_gray: '#475569',
  hoodie_purple: '#8b5cf6',
  
  // Bottoms (Athletic shorts/leggings)
  shorts_black: '#0f172a',
  shorts_blue: '#1d4ed8',
  pants_jeans: '#3b82f6',
  pants_gray: '#334155',
  skirt_pink: '#db2777',
  
  // Shoes (Sneakers)
  sneakers_white: '#ffffff',
  sneakers_black: '#09090b',
  sneakers_red: '#ef4444',
  boots_brown: '#78350f'
};

const getColor = (configVal, fallback) => {
  if (!configVal) return fallback;
  if (configVal.startsWith('#')) return configVal;
  return COLOR_MAP[configVal] || fallback;
};

export default function AvatarPodium({ avatarConfig, isCustomizable = false }) {
  const containerRef = useRef(null);

  // Extract config colors
  const skinColor = getColor(avatarConfig?.base, '#ffd1a9');
  const topColor = getColor(avatarConfig?.top, '#ef4444');
  const bottomColor = getColor(avatarConfig?.bottom, '#0f172a');
  const shoesColor = getColor(avatarConfig?.shoes, '#ffffff');
  const glowColor = avatarConfig?.glowColor || '#00ffff';

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    const width = containerRef.current.clientWidth || 220;
    const height = containerRef.current.clientHeight || 220;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 3.6);
    camera.lookAt(0, 0.8, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
    keyLight.position.set(2, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Back Rim Light (creates a neon glow edge on the player)
    const rimLight = new THREE.DirectionalLight(glowColor, 0.7);
    rimLight.position.set(-2, 2, -2.5);
    scene.add(rimLight);

    // Glowing point light at the base pointing up
    const pointLight = new THREE.PointLight(glowColor, 3.5, 4);
    pointLight.position.set(0, 0.1, 0);
    scene.add(pointLight);

    // Master Group
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // --- 1. PREMIUM DOUBLE-DECK HOVERING PODIUM ---
    const podiumGroup = new THREE.Group();
    avatarGroup.add(podiumGroup);

    // Main base deck
    const mainDeckGeo = new THREE.CylinderGeometry(0.72, 0.77, 0.12, 32);
    const mainDeckMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.25,
      metalness: 0.8
    });
    const mainDeck = new THREE.Mesh(mainDeckGeo, mainDeckMat);
    mainDeck.position.y = -0.06;
    mainDeck.receiveShadow = true;
    podiumGroup.add(mainDeck);

    // Inner gold/silver ring deck
    const innerDeckGeo = new THREE.CylinderGeometry(0.66, 0.68, 0.04, 32);
    const innerDeckMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // gold
      roughness: 0.1,
      metalness: 0.95
    });
    const innerDeck = new THREE.Mesh(innerDeckGeo, innerDeckMat);
    innerDeck.position.y = 0.02;
    innerDeck.receiveShadow = true;
    podiumGroup.add(innerDeck);

    // Under-glow Torus Ring
    const ringGeo = new THREE.TorusGeometry(0.74, 0.025, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.9
    });
    const glowRing = new THREE.Mesh(ringGeo, ringMat);
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = -0.12;
    podiumGroup.add(glowRing);

    // Local Shadow Plane on podium surface
    const shadowGeo = new THREE.RingGeometry(0, 0.45, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const floorShadow = new THREE.Mesh(shadowGeo, shadowMat);
    floorShadow.rotation.x = Math.PI / 2;
    floorShadow.position.y = 0.041;
    podiumGroup.add(floorShadow);

    // --- 2. HIGH-FIDELITY STYLIZED ATHLETE ---
    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = 0.04;
    avatarGroup.add(bodyGroup);

    // Material Definitions
    const mats = {
      skin: new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.65, metalness: 0.05 }),
      shirt: new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.4, metalness: 0.1 }),
      shorts: new THREE.MeshStandardMaterial({ color: bottomColor, roughness: 0.5 }),
      shoesUpper: new THREE.MeshStandardMaterial({ color: shoesColor, roughness: 0.4 }),
      shoesSole: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }),
      socks: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 }),
      hair: new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.8 }), // dark indigo hair
      headband: new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.5 }),
      headphones: new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.8 }),
      metal: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.2, metalness: 0.85 }),
      white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }),
      black: new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.9 }),
      logo: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      aura: new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: 0.25 })
    };

    // --- LEGS (Tapered Cylinder Musculature) ---
    // Right Leg Group
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.13, 0.46, 0);
    bodyGroup.add(rightLegGroup);

    // Thigh (Tapered cylinder: thicker at top)
    const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.048, 0.2, 16), mats.skin);
    rightThigh.position.y = -0.1;
    rightThigh.castShadow = true;
    rightLegGroup.add(rightThigh);

    // Shorts sleeve
    const rightShortsSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.06, 0.12, 16), mats.shorts);
    rightShortsSleeve.position.y = -0.06;
    rightLegGroup.add(rightShortsSleeve);

    // Calf (Tapered cylinder: thicker at calf, thinner at ankle)
    const rightCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.2, 16), mats.skin);
    rightCalf.position.y = -0.28;
    rightCalf.castShadow = true;
    rightLegGroup.add(rightCalf);

    // Socks
    const rightSock = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.04, 0.08, 12), mats.socks);
    rightSock.position.y = -0.34;
    rightLegGroup.add(rightSock);

    // Sneaker (Detailed with separate sole)
    const rightShoeGroup = new THREE.Group();
    rightShoeGroup.position.set(0, -0.41, 0.03);
    rightLegGroup.add(rightShoeGroup);

    const rightShoeUpper = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.22), mats.shoesUpper);
    rightShoeUpper.castShadow = true;
    rightShoeGroup.add(rightShoeUpper);

    const rightShoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.24), mats.shoesSole);
    rightShoeSole.position.y = -0.04;
    rightShoeGroup.add(rightShoeSole);

    // Left Leg Group
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.13, 0.46, 0);
    bodyGroup.add(leftLegGroup);

    const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.048, 0.2, 16), mats.skin);
    leftThigh.position.y = -0.1;
    leftThigh.castShadow = true;
    leftLegGroup.add(leftThigh);

    const leftShortsSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.06, 0.12, 16), mats.shorts);
    leftShortsSleeve.position.y = -0.06;
    leftLegGroup.add(leftShortsSleeve);

    const leftCalf = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.2, 16), mats.skin);
    leftCalf.position.y = -0.28;
    leftCalf.castShadow = true;
    leftLegGroup.add(leftCalf);

    // Socks
    const leftSock = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.04, 0.08, 12), mats.socks);
    leftSock.position.y = -0.34;
    leftLegGroup.add(leftSock);

    // Sneaker left
    const leftShoeGroup = new THREE.Group();
    leftShoeGroup.position.set(0, -0.41, 0.03);
    leftLegGroup.add(leftShoeGroup);

    const leftShoeUpper = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.22), mats.shoesUpper);
    leftShoeUpper.castShadow = true;
    leftShoeGroup.add(leftShoeUpper);

    const leftShoeSole = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.24), mats.shoesSole);
    leftShoeSole.position.y = -0.04;
    leftShoeGroup.add(leftShoeSole);

    // Shorts Hip Base
    const hip = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.16, 0.15, 16), mats.shorts);
    hip.position.y = 0.44;
    hip.castShadow = true;
    bodyGroup.add(hip);

    // --- TORSO (Racerback Tank Top + Chest Musculature) ---
    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.15, 0.43, 16), mats.shirt);
    chest.position.y = 0.72;
    chest.castShadow = true;
    bodyGroup.add(chest);

    // Glowing Chest Stripe / Pulse Logo ("P")
    const pulseLogo = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.01), mats.logo);
    pulseLogo.position.set(0, 0.76, 0.15);
    bodyGroup.add(pulseLogo);
    
    const pulseLogoDot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), mats.logo);
    pulseLogoDot.position.set(0.04, 0.8, 0.15);
    bodyGroup.add(pulseLogoDot);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.052, 0.1, 12), mats.skin);
    neck.position.y = 0.96;
    bodyGroup.add(neck);

    // --- ARMS (Tapered Bicep & Forearm) ---
    // Arm Right (Holding Dumbbell)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.23, 0.86, 0);
    bodyGroup.add(rightArmGroup);

    const rightBicep = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.038, 0.18, 12), mats.skin);
    rightBicep.position.set(0.04, -0.07, 0);
    rightBicep.rotation.z = -Math.PI / 10;
    rightBicep.castShadow = true;
    rightArmGroup.add(rightBicep);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.032, 0.16, 12), mats.skin);
    rightForearm.position.set(0.09, -0.21, 0.1);
    rightForearm.rotation.x = Math.PI / 3;
    rightForearm.rotation.y = -Math.PI / 10;
    rightForearm.castShadow = true;
    rightArmGroup.add(rightForearm);

    // Hand Right
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 12), mats.skin);
    rightHand.position.set(0.09, -0.14, 0.22);
    rightArmGroup.add(rightHand);

    // Wristband right
    const wristbandR = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.012, 6, 16), mats.headband);
    wristbandR.position.set(0.09, -0.16, 0.19);
    wristbandR.rotation.x = Math.PI / 3;
    rightArmGroup.add(wristbandR);

    // --- THE DUMBBELL (Holding weight) ---
    const dbGroup = new THREE.Group();
    dbGroup.position.set(0.09, -0.14, 0.22);
    dbGroup.rotation.y = Math.PI / 4;
    rightArmGroup.add(dbGroup);

    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.22, 8), mats.metal);
    bar.rotation.z = Math.PI / 2;
    dbGroup.add(bar);

    const plateL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.045, 12), mats.metal);
    plateL.position.x = -0.08;
    plateL.rotation.z = Math.PI / 2;
    dbGroup.add(plateL);

    const plateR = new THREE.Mesh(plateL.geometry, mats.metal);
    plateR.position.x = 0.08;
    plateR.rotation.z = Math.PI / 2;
    dbGroup.add(plateR);

    // Arm Left (Relaxed / Active pose)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.23, 0.86, 0);
    bodyGroup.add(leftArmGroup);

    const leftBicep = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.038, 0.18, 12), mats.skin);
    leftBicep.position.set(-0.04, -0.07, 0);
    leftBicep.rotation.z = Math.PI / 8;
    leftBicep.castShadow = true;
    leftArmGroup.add(leftBicep);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.032, 0.16, 12), mats.skin);
    leftForearm.position.set(-0.08, -0.21, 0.04);
    leftForearm.rotation.x = Math.PI / 8;
    leftForearm.rotation.z = Math.PI / 16;
    leftForearm.castShadow = true;
    leftArmGroup.add(leftForearm);

    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 12), mats.skin);
    leftHand.position.set(-0.09, -0.3, 0.08);
    leftArmGroup.add(leftHand);

    // --- THE HEAD & FACE DETAILS ---
    const headGroup = new THREE.Group();
    headGroup.position.y = 1.18;
    bodyGroup.add(headGroup);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 32), mats.skin);
    head.castShadow = true;
    headGroup.add(head);

    // Tapered/Styled Hair (Multiple spheres to make a cool haircut, not just a block helmet)
    const hairGroup = new THREE.Group();
    headGroup.add(hairGroup);

    const hairCenter = new THREE.Mesh(new THREE.SphereGeometry(0.178, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.7), mats.hair);
    hairCenter.position.set(0, 0.01, -0.01);
    hairGroup.add(hairCenter);

    // Ponytail / Bun back
    const hairBun = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), mats.hair);
    hairBun.position.set(0, 0.1, -0.14);
    hairGroup.add(hairBun);

    // Hair sides tufts (stylized bangs)
    const hairLeftTuft = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), mats.hair);
    hairLeftTuft.position.set(-0.11, 0.08, 0.1);
    hairGroup.add(hairLeftTuft);

    const hairRightTuft = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), mats.hair);
    hairRightTuft.position.set(0.11, 0.08, 0.1);
    hairGroup.add(hairRightTuft);

    // Headband
    const hb = new THREE.Mesh(new THREE.TorusGeometry(0.172, 0.016, 8, 32), mats.headband);
    hb.rotation.x = Math.PI / 8;
    hb.position.y = 0.02;
    headGroup.add(hb);

    // --- SPORTS HEADPHONES (Around the Neck) ---
    const headphonesGroup = new THREE.Group();
    headphonesGroup.position.set(0, 0.98, 0.02);
    headphonesGroup.rotation.x = Math.PI / 12;
    bodyGroup.add(headphonesGroup);

    // Band
    const hpBand = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 8, 24, Math.PI * 1.2), mats.headphones);
    hpBand.rotation.x = Math.PI / 2;
    hpBand.rotation.z = Math.PI * 0.9;
    headphonesGroup.add(hpBand);

    // Ear Cups (Left & Right)
    const hpCupL = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 16), mats.headphones);
    hpCupL.position.set(-0.11, -0.02, 0.05);
    hpCupL.rotation.z = Math.PI / 3;
    headphonesGroup.add(hpCupL);

    const hpCupR = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 16), mats.headphones);
    hpCupR.position.set(0.11, -0.02, 0.05);
    hpCupR.rotation.z = -Math.PI / 3;
    headphonesGroup.add(hpCupR);

    // Face details (Eyes & Eyebrows)
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), mats.white);
    leftEye.position.set(-0.055, 0.02, 0.14);
    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), mats.black);
    leftPupil.position.set(0, 0, 0.01);
    leftEye.add(leftPupil);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), mats.white);
    rightEye.position.set(0.055, 0.02, 0.14);
    const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8), mats.black);
    rightPupil.position.set(0, 0, 0.01);
    rightEye.add(rightPupil);
    headGroup.add(rightEye);

    // Determined eyebrows
    const leftEb = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.01, 0.01), mats.hair);
    leftEb.position.set(-0.06, 0.056, 0.145);
    leftEb.rotation.z = Math.PI / 36;
    headGroup.add(leftEb);

    const rightEb = new THREE.Mesh(new THREE.BoxGeometry(0.048, 0.01, 0.01), mats.hair);
    rightEb.position.set(0.06, 0.056, 0.145);
    rightEb.rotation.z = -Math.PI / 36;
    headGroup.add(rightEb);

    // Nose
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.045, 4), mats.skin);
    nose.position.set(0, -0.025, 0.16);
    nose.rotation.x = Math.PI / 12;
    headGroup.add(nose);

    // Smile
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.008, 0.01), mats.black);
    mouth.position.set(0, -0.07, 0.15);
    headGroup.add(mouth);

    // Outer Aura Shield (semi-transparent capsule)
    const aura = new THREE.Mesh(new THREE.CapsuleGeometry(0.66, 1.15, 16, 16), mats.aura);
    aura.position.y = 0.65;
    avatarGroup.add(aura);

    // Mouse rotation drag controls
    let isDragging = false;
    let previousMousePosition = { x: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition.x = e.clientX;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      avatarGroup.rotation.y += deltaX * 0.012;
      previousMousePosition.x = e.clientX;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition.x = e.touches[0].clientX;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      avatarGroup.rotation.y += deltaX * 0.012;
      previousMousePosition.x = e.touches[0].clientX;
    };

    domElement.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    // Animation Loop
    const clock = new THREE.Clock();
    let reqId;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Fluid athletic breathing & idle floating
      bodyGroup.position.y = 0.04 + Math.sin(time * 2.2) * 0.045;
      
      // Arm movement while breathing
      rightArmGroup.rotation.z = Math.sin(time * 2.2) * 0.02;
      rightArmGroup.rotation.x = Math.sin(time * 1.5) * 0.02;
      leftArmGroup.rotation.z = Math.sin(time * 2.2) * -0.02;
      leftArmGroup.rotation.x = Math.sin(time * 1.5) * 0.02;

      // Dumbbell lift micro-animation
      dbGroup.rotation.x = Math.sin(time * 2.2) * 0.1;

      // Smooth auto rotation if not dragging
      if (!isDragging) {
        avatarGroup.rotation.y += 0.007;
      }

      // Pulse effects
      glowRing.scale.setScalar(1 + Math.sin(time * 4) * 0.035);
      ringMat.opacity = 0.75 + Math.sin(time * 4) * 0.18;
      mats.aura.opacity = 0.15 + Math.sin(time * 2.2) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(reqId);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      
      if (domElement && domElement.parentNode) {
        domElement.parentNode.removeChild(domElement);
      }
      
      scene.clear();
      renderer.dispose();
      mainDeckGeo.dispose();
      mainDeckMat.dispose();
      innerDeckGeo.dispose();
      innerDeckMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      rightThigh.geometry.dispose();
      rightShortsSleeve.geometry.dispose();
      rightCalf.geometry.dispose();
      rightSock.geometry.dispose();
      rightShoeUpper.geometry.dispose();
      rightShoeSole.geometry.dispose();
      hip.geometry.dispose();
      chest.geometry.dispose();
      pulseLogo.geometry.dispose();
      pulseLogoDot.geometry.dispose();
      neck.geometry.dispose();
      rightBicep.geometry.dispose();
      rightForearm.geometry.dispose();
      rightHand.geometry.dispose();
      wristbandR.geometry.dispose();
      bar.geometry.dispose();
      plateL.geometry.dispose();
      leftBicep.geometry.dispose();
      leftForearm.geometry.dispose();
      leftHand.geometry.dispose();
      head.geometry.dispose();
      hairCenter.geometry.dispose();
      hairBun.geometry.dispose();
      hairLeftTuft.geometry.dispose();
      hairRightTuft.geometry.dispose();
      hb.geometry.dispose();
      hpBand.geometry.dispose();
      hpCupL.geometry.dispose();
      hpCupR.geometry.dispose();
      leftEye.geometry.dispose();
      leftPupil.geometry.dispose();
      leftEb.geometry.dispose();
      nose.geometry.dispose();
      mouth.geometry.dispose();
      aura.geometry.dispose();
      
      Object.values(mats).forEach(m => m.dispose());
    };
  }, [skinColor, topColor, bottomColor, shoesColor, glowColor]);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div 
        ref={containerRef} 
        className="avatar-figurine-3d"
        style={{ 
          width: '220px', 
          height: '220px', 
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 72%)',
          borderRadius: '24px',
          cursor: 'grab'
        }} 
      />
      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '-8px', userSelect: 'none', pointerEvents: 'none' }}>
        👆 גרור כדי לסובב את הדמות
      </div>
    </div>
  );
}
