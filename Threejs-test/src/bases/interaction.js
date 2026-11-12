// src/interaction.js
import * as THREE from 'three';

export function initInteraction(camera, renderer, getModel, onSelect) {
    const raycaster = new THREE.Raycaster();
    const screenCenter = new THREE.Vector2(0, 0); // (0,0) 就是屏幕正中心

    renderer.domElement.addEventListener('click', () => {
        // 只有在鼠标锁定状态（第一人称漫游）下，才进行准星检测
        if (document.pointerLockElement !== renderer.domElement) return;

        const model = getModel();
        if (!model) return;

        // 从屏幕中心发射射线
        raycaster.setFromCamera(screenCenter, camera);
        
        // 检测射线是否打中了模型（true表示检测模型的所有子物体）
        const intersects = raycaster.intersectObject(model, true);

        if (intersects.length > 0) {
            // 打中了！调用外部传进来的选中回调函数
            onSelect(model);
        }
    });
}