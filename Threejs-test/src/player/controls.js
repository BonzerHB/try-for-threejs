// src/controls.js
import * as THREE from 'three';

export function initControls(camera, renderer) {
    let isLocked = false;
    let isActive = true; // 👈 新增：控制是否允许键盘移动
    const keys = { w: false, a: false, s: false, d: false };
    const moveSpeed = 0.1;

    // 鼠标视角
    renderer.domElement.addEventListener('click', () => {
        if (isActive) {
        renderer.domElement.requestPointerLock();
        }
    });

    document.addEventListener('pointerlockchange', () => {
        isLocked = (document.pointerLockElement === renderer.domElement);
    });

    document.addEventListener('mousemove', (event) => {
        if (!isLocked || !isActive) return;
        const sensitivity = 0.002;
        camera.rotation.y -= event.movementX * sensitivity;
        camera.rotation.x -= event.movementY * sensitivity;
        camera.rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, camera.rotation.x));
    });

    // 键盘移动
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();
        if (key === 'alt') {
            document.exitPointerLock();
            event.preventDefault();
            return;
        }
        if (keys.hasOwnProperty(key)) keys[key] = true;
    });

    document.addEventListener('keyup', (event) => {
        const key = event.key.toLowerCase();
        if (keys.hasOwnProperty(key)) keys[key] = false;
    });

    // 导出更新函数，在动画循环里调用
    return {
        update: function () {
            if (isLocked && isActive) { // 👈 修改：只有激活时才允许移动
                // 简化版：不区分前后左右，直接基于水平方向移动
                const front = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
                front.y = 0; front.normalize();
                
                const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
                right.y = 0; right.normalize();

                if (keys.w) camera.position.addScaledVector(front, moveSpeed);
                if (keys.s) camera.position.addScaledVector(front, -moveSpeed);
                if (keys.d) camera.position.addScaledVector(right, moveSpeed);
                if (keys.a) camera.position.addScaledVector(right, -moveSpeed);
            }
            return isLocked; // 返回锁定状态，给主循环判断用
        },
        setActive: (active) => { isActive = active; }

    };
    
}