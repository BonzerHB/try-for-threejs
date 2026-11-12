// src/environment.js
import * as THREE from 'three';

export function initEnvironment(scene) {
    // 1. 制作地板
    // 参数：宽100，高100
    const floorGeometry = new THREE.PlaneGeometry(100, 100); 
    
    // 材质：使用一种偏灰色的标准材质，这样能被灯光照亮
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x888888, 
        side: THREE.DoubleSide // 双面渲染，防止从下面看是透明的
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    
    // 核心：把平面绕着 X 轴旋转 -90 度，让它平躺下来变成地板
    floor.rotation.x = -Math.PI / 2; 
    // 稍微往下移一点，让模型刚好踩在地板上
    floor.position.y = -1; 
    
    // 接收阴影（以后加阴影必须要这个）
    floor.receiveShadow = true; 
    scene.add(floor);


    // 2. 制作一堵墙壁（举个例子）
    const wallGeometry = new THREE.PlaneGeometry(20, 10); // 宽20，高10
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xaa5555, // 偏红色的墙
        side: THREE.DoubleSide 
    });
    
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    
    // 墙壁不需要旋转，默认就是立着的
    wall.position.set(0, 4, -10); // 放在地板后方 10 米处，高度4米
    wall.receiveShadow = true;
    scene.add(wall);


    // 3. （进阶）加一个无限网格辅助线，让你更有空间感
    const gridHelper = new THREE.GridHelper(100, 50, 0xffffff, 0x444444);
    gridHelper.position.y = -0.99; // 贴在刚刚的地板上方一点点，防止闪烁
    scene.add(gridHelper);
}