import React from 'react';
import { useGLTF } from '@react-three/drei';

export default function HoodieModel({ color = 'black' }) {
  const { nodes, materials } = useGLTF('/models/hoodie.glb');

  return (
    <group dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.hoodie.geometry}
        material={materials.fabric}
        material-color={color}
      />
    </group>
  );
}

useGLTF.preload('/models/hoodie.glb');