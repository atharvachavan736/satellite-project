import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

const Earth = () => {
  const earthRef = useRef();
  
  // Load a high-res, royalty-free Earth texture
  const colorMap = useTexture('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');

  // Make the Earth slowly rotate on its axis
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <mesh ref={earthRef} rotation={[0, 0, 0.4]}> 
      {/* CRITICAL FIX: Radius changed to 6.25 to match orbital physics scale */}
      <sphereGeometry args={[6.25, 64, 64]} />
      <meshStandardMaterial 
        map={colorMap} 
        metalness={0.1} 
        roughness={0.8} 
      />
    </mesh>
  );
};

export default Earth;