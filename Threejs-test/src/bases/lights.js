// src/lights.js
import * as THREE from 'three';

export function initLights(scene, camera) {
    // 环境光（全局提亮）
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    // 戴在相机上的“头灯”（跟随移动）
    const headLight = new THREE.PointLight(0xffffff, 10, 20, 2);
    headLight.position.set(0, 1, 0);
    camera.add(headLight); // 加到相机上

    // 场景全局平行光（提供主明暗）
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);
}