
import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const SatelliteSwarm = ({ onSelectSatellite }) => {
  const meshRef = useRef();
  const [satellites, setSatellites] = useState([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // 1. Initial Load
  useEffect(() => {
    axios.get(`${API_BASE}/satellites/all`)
      .then(res => setSatellites(res.data.data))
      .catch(err => console.error("Network Error"));
  }, []);

  // 2. High Performance Update Loop
  useEffect(() => {
    if (meshRef.current && satellites.length > 0) {
      satellites.forEach((sat, i) => {
        // Position Calc
        const SCALE = (5 / 6371) * 1.25; 
        dummy.position.set(sat.x * SCALE, sat.z * SCALE, sat.y * SCALE);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [satellites, dummy]);

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[null, null, 5000]} 
      onClick={(e) => {
        e.stopPropagation(); // Stop click from hitting Earth
        const index = e.instanceId;
        console.log("Clicked ID:", index); // Debug Log
        if (satellites[index]) {
            onSelectSatellite(satellites[index]);
        }
      }}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      {/* SIZE INCREASED to 0.08 for better visibility/clicking. 
        Segments reduced to 4 for higher FPS.
      */}
      <sphereGeometry args={[0.08, 4, 4]} />
      
      {/* COLOR CHANGED TO WHITE */}
      <meshBasicMaterial color="#FFFFFF" />
    </instancedMesh>
  );
};

export default SatelliteSwarm;


