// src/scene.js
import * as THREE from 'three';

export function initScene() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    camera.rotation.order = 'YXZ'; // 第一人称必备

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(renderer.domElement);

    // 把相机加入场景（为了让挂在相机上的光源生效）
    scene.add(camera);

    // 监听窗口缩放
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 返回这三个核心对象
    return { scene, camera, renderer };
}