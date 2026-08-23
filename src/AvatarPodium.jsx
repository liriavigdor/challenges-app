import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Map mock avatar config strings to hex/CSS colors
const COLOR_MAP = {
  base_male_1: '#ffd1a9',
  base_female_1: '#f3c19d',
  base_alien: '#4ade80',
  base_robot: '#cbd5e1',
  
  tshirt_black: '#1e293b',
  tshirt_white: '#f1f5f9',
  tshirt_red: '#ef4444',
  tshirt_blue: '#3b82f6',
  tshirt_green: '#10b981',
  hoodie_gray: '#475569',
  hoodie_purple: '#8b5cf6',
  
  shorts_black: '#0f172a',
  shorts_blue: '#1d4ed8',
  pants_jeans: '#3b82f6',
  pants_gray: '#334155',
  skirt_pink: '#db2777',
  
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

// 6 Pre-configured presets (All using the high-quality sci-fi model with different glow tints)
export const AVATAR_PRESETS = [
  // --- Simple Series (Cylinder Dolls for Beginners) ---
  {
    id: 'simple_rookie_green',
    name: 'טירון (ירוק)',
    base: 'cylinder',
    isGlb: false,
    glowColor: '#22c55e',
    desc: 'דמות בסיסית לשחקנים מתחילים',
    reqTrophies: 0
  },
  {
    id: 'simple_rookie_blue',
    name: 'חייל פשוט (כחול)',
    base: 'cylinder',
    isGlb: false,
    glowColor: '#3b82f6',
    desc: 'דמות בסיס משודרגת מעט',
    reqTrophies: 200
  },
  {
    id: 'simple_rookie_orange',
    name: 'חייל מתקדם (כתום)',
    base: 'cylinder',
    isGlb: false,
    glowColor: '#f97316',
    desc: 'דמות בסיס מתקדמת',
    reqTrophies: 500
  },

  // --- Cyber Series (Requires 1000+ Trophies) ---
  {
    id: 'robot_cyber_blue',
    name: 'לוחם סייבר (כחול)',
    base: 'robot',
    isGlb: true,
    glowColor: '#00f0ff',
    desc: 'לוחם סייבר קלאסי עם תאורת נאון תכלת מרוכזת',
    reqTrophies: 1000
  },
  {
    id: 'robot_plasma_red',
    name: 'לוחם פלזמה (אדום)',
    base: 'robot',
    isGlb: true,
    glowColor: '#ff2a2a',
    desc: 'חליפת משוריין עמידה לחום עם הילה אדומה ועוצמתית',
    reqTrophies: 1000
  },
  {
    id: 'robot_acid_green',
    name: 'לוחם רעל (ירוק)',
    base: 'robot',
    isGlb: true,
    glowColor: '#39ff14',
    desc: 'חייל ביולוגי משודרג עם הילה ירוקה תעשייתית',
    reqTrophies: 1000
  },
  
  // --- Elite Series (Female Models, Requires 1500+ Trophies) ---
  {
    id: 'robot_elite_purple',
    name: 'לוחמת עלית (סגול)',
    base: 'female',
    isGlb: true,
    glowColor: '#a855f7',
    desc: 'לוחמת מיומנת למשימות לילה עם הילת אנרגיה סגולה עמוקה',
    reqTrophies: 1500
  },
  {
    id: 'robot_elite_emerald',
    name: 'לוחמת אמרלד (ברקת)',
    base: 'female',
    isGlb: true,
    glowColor: '#10b981', // emerald
    desc: 'לוחמת התגנבות יוקרתית עם תאורת ברקת זוהרת מבריקה',
    reqTrophies: 1500
  },
  {
    id: 'robot_elite_gold',
    name: 'לוחמת מפקדת (זהב)',
    base: 'female',
    isGlb: true,
    glowColor: '#eab308', // gold/yellow
    desc: 'מפקדת חוליית הסייבר עם הילת חלקיקי זהב דומיננטית',
    reqTrophies: 1500
  }
];

import robotGlbUrl from './assets/models/human_rigged.glb?url';
import femaleGlbUrl from './assets/models/female_human.glb?url';

export default function AvatarPodium({ avatarConfig, isCustomizable = false, onAvatarChange, userTrophies = 10000, onPodiumClick }) {
  const containerRef = useRef(null);

  const availablePresets = AVATAR_PRESETS.filter(p => userTrophies >= (p.reqTrophies || 0));

  // Match the active preset based on configuration or id
  const getActiveIndex = () => {
    if (!avatarConfig) return 0;
    if (avatarConfig.id) {
      const idx = availablePresets.findIndex(p => p.id === avatarConfig.id);
      if (idx !== -1) return idx;
    }
    // Match by glowColor since that's our primary differentiator now
    const glow = avatarConfig.glowColor;
    if (glow === '#00f0ff' || glow === 'blue') return 0;
    if (glow === '#ff2a2a' || glow === 'red') return 1;
    if (glow === '#39ff14' || glow === 'green') return 2;
    if (glow === '#a855f7' || glow === 'purple') return 3;
    if (glow === '#10b981' || glow === 'emerald') return 4;
    if (glow === '#eab308' || glow === 'gold') return 5;
    
    return 0; // Default
  };

  const activeIndex = getActiveIndex();
  const currentPreset = availablePresets[activeIndex] || availablePresets[0];

  // Resolve visual variables based on current preset
  const skinColor = getColor(currentPreset.base === 'robot' ? 'base_robot' : 'base_female_1', '#ffd1a9');
  const topColor = currentPreset.top || '#ef4444';
  const bottomColor = currentPreset.bottom || '#0f172a';
  const shoesColor = currentPreset.shoes || '#ffffff';
  const glowColor = currentPreset.glowColor || '#00ffff';
  const hairColorHex = currentPreset.hairColor || '#1e1b4b';

  const handleNext = (e) => {
    e.stopPropagation();
    const nextIdx = (activeIndex + 1) % availablePresets.length;
    if (onAvatarChange) {
      onAvatarChange(availablePresets[nextIdx]);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const prevIdx = (activeIndex - 1 + availablePresets.length) % availablePresets.length;
    if (onAvatarChange) {
      onAvatarChange(availablePresets[prevIdx]);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 220;
    const height = containerRef.current.clientHeight || 220;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 3.6);
    camera.lookAt(0, 0.8, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(2, 4, 3);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.0);
    rimLight.position.set(-2, 2, -2.5);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0xffffff, 2.0, 4);
    pointLight.position.set(0, 0.5, 1);
    scene.add(pointLight);

    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    const podiumGroup = new THREE.Group();
    avatarGroup.add(podiumGroup);

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

    const innerDeckGeo = new THREE.CylinderGeometry(0.66, 0.68, 0.04, 32);
    const innerDeckMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.1,
      metalness: 0.95
    });
    const innerDeck = new THREE.Mesh(innerDeckGeo, innerDeckMat);
    innerDeck.position.y = 0.02;
    innerDeck.receiveShadow = true;
    podiumGroup.add(innerDeck);

    const ringGeo = new THREE.TorusGeometry(0.74, 0.025, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });
    const glowRing = new THREE.Mesh(ringGeo, ringMat);
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = -0.12;
    podiumGroup.add(glowRing);

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

    // --- AVATAR BODY ---
    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = 0.04;
    avatarGroup.add(bodyGroup);

    let mixer = null;
    let loadedModel = null;

    if (currentPreset.isGlb) {
      const loader = new GLTFLoader();
      const glbPath = currentPreset.base === 'female' ? femaleGlbUrl : robotGlbUrl;
      const scaleVal = currentPreset.base === 'female' ? 0.75 : 0.85; // Increased scale

      loader.load(
        glbPath,
        (gltf) => {
          loadedModel = gltf.scene;
          loadedModel.scale.set(scaleVal, scaleVal, scaleVal);
          
          // Try to center the model just in case it's off-origin
          const box = new THREE.Box3().setFromObject(loadedModel);
          const center = box.getCenter(new THREE.Vector3());
          loadedModel.position.x = -center.x;
          // loadedModel.position.y = -box.min.y; // Align feet to bottom
          loadedModel.position.z = -center.z;
          
          loadedModel.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              
              if (child.material) {
                // Enhance metallic feel but DO NOT overwrite the color
                const mat = child.material;
                if (currentPreset.base === 'robot') {
                  mat.roughness = currentPreset.customRobotRoughness ?? 0.65;
                  mat.metalness = currentPreset.customRobotMetalness ?? 0.6;
                } else {
                  // Female model material tweaks
                  mat.roughness = 0.6;
                  mat.metalness = 0.1;
                }
              }
            }
          });

          bodyGroup.add(loadedModel);

          // Play animation if available
          if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(loadedModel);
            const idleClip = gltf.animations[0];
            const action = mixer.clipAction(idleClip);
            action.play();
          }
        },
        undefined,
        (error) => {
          console.warn('Failed to load local GLB robot:', error);
          // Fallback to empty box if error
          const fallbackMesh = new THREE.Mesh(new THREE.BoxGeometry(0.2,0.2,0.2), new THREE.MeshStandardMaterial({color: 0x555555}));
          bodyGroup.add(fallbackMesh);
        }
      );
    } else {
      // BUILD SIMPLE CYLINDER DOLL (For Rookies)
      const cylinderGroup = new THREE.Group();
      
      const matSkin = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.8 });
      const matCloth = new THREE.MeshStandardMaterial({ color: glowColor, roughness: 0.9 });
      const matDark = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
      
      // Head
      const headGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const head = new THREE.Mesh(headGeo, matSkin);
      head.position.y = 0.6;
      head.castShadow = true;
      cylinderGroup.add(head);
      
      // Eyes
      const eyeGeo = new THREE.SphereGeometry(0.015, 8, 8);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
      eyeL.position.set(-0.04, 0.62, 0.11);
      const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
      eyeR.position.set(0.04, 0.62, 0.11);
      cylinderGroup.add(eyeL, eyeR);
      
      // Torso
      const torsoGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.3, 16);
      const torso = new THREE.Mesh(torsoGeo, matCloth);
      torso.position.y = 0.35;
      torso.castShadow = true;
      cylinderGroup.add(torso);
      
      // Arms
      const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 8);
      const armL = new THREE.Mesh(armGeo, matSkin);
      armL.position.set(-0.16, 0.35, 0);
      armL.rotation.z = -0.3;
      armL.castShadow = true;
      const armR = new THREE.Mesh(armGeo, matSkin);
      armR.position.set(0.16, 0.35, 0);
      armR.rotation.z = 0.3;
      armR.castShadow = true;
      cylinderGroup.add(armL, armR);
      
      // Legs
      const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 8);
      const legL = new THREE.Mesh(legGeo, matDark);
      legL.position.set(-0.06, 0.1, 0);
      legL.castShadow = true;
      const legR = new THREE.Mesh(legGeo, matDark);
      legR.position.set(0.06, 0.1, 0);
      legR.castShadow = true;
      cylinderGroup.add(legL, legR);
      
      // Idle Animation state for the cylinder doll
      cylinderGroup.userData = { isSimple: true };
      
      cylinderGroup.scale.set(1.6, 1.6, 1.6);
      
      bodyGroup.add(cylinderGroup);
    }





    // Drag controls
    let isDragging = false;
    let previousMousePosition = { x: 0 };
    let dragTotalX = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition.x = e.clientX;
      dragTotalX = 0;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      dragTotalX += Math.abs(deltaX);
      avatarGroup.rotation.y += deltaX * 0.015;
      previousMousePosition.x = e.clientX;
    };

    const handleMouseUp = () => {
      if (isDragging && dragTotalX < 5) {
        if (onPodiumClick) onPodiumClick();
      }
      isDragging = false;
    };

    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition.x = e.touches[0].clientX;
        dragTotalX = 0;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      dragTotalX += Math.abs(deltaX);
      avatarGroup.rotation.y += deltaX * 0.015;
      previousMousePosition.x = e.touches[0].clientX;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    const clock = new THREE.Clock();
    let reqId;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (mixer) {
        mixer.update(delta || 0.016);
      }

      // Fluid breathing idle float
      if (!mixer) {
        bodyGroup.position.y = 0.04 + Math.sin(time * 1.8) * 0.015;
      }

      // Auto rotation
      if (!isDragging) {
        avatarGroup.rotation.y += 0.007;
      }

      // Pulse effects
      glowRing.scale.setScalar(1 + Math.sin(time * 1.5) * 0.005);
      ringMat.opacity = 0.85 + Math.sin(time * 1.5) * 0.02;

      renderer.render(scene, camera);
    };

    animate();

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
    };
  }, [skinColor, topColor, bottomColor, shoesColor, glowColor, currentPreset]);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* 3D Canvas Box */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '320px' }}>
        <div 
          ref={containerRef} 
          className="avatar-figurine-3d"
          style={{ 
            width: '280px', 
            height: '280px', 
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 72%)',
            borderRadius: '24px',
            cursor: 'pointer'
          }} 
        />
      </div>


    </div>
  );
}


