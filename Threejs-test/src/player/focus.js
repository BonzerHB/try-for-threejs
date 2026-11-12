// src/focus.js
import * as THREE from 'three';

export function initFocus(camera, renderer, controls) {
    // 👇👇👇 新增：检视参数配置
    const CONFIG = {
        distance: 2.5,           // 👈 直接写死距离，不再动态计算，防止尺寸算错导致飞过头或没飞到
        speed: 0.1,              
        offsetX: 0,              // 🚨 终极微调：如果模型还是头顶/背对你，改这里的数字！加 Math.PI 就是转 180 度
        offsetY: 0,              
        offsetZ: 0               
    };

    let isFocusing = false;
    let currentModel = null;
    
    // 👇👇👇 新增：聚焦相关的状态和变量
    const targetPos = new THREE.Vector3();       // ✏️ 改为：记录模型要飞向的目标位置
    const originalPos = new THREE.Vector3();     // ✏️ 改为：记录模型最初待的位置，方便飞回去
    const dummy = new THREE.Object3D(); 

    // 初始化交互（由 main.js 调用）
    function focus(model) {
        if (isFocusing || !model) return; // 如果已经在聚焦，不重复触发
        currentModel = model;
        isFocusing = true;

        // 1. 解除鼠标锁定，这样用户才能看到鼠标指针
        document.exitPointerLock();
        controls.setActive(false); // 禁用 WASD 移动

        // 2. ✏️ 删除了发光高亮代码（因为 emissive 叠加头灯会导致严重过曝变白）

        // 3. 👇👇👇 记录初始位置
        originalPos.copy(model.position); 
    }

    function unfocus() {
        if (!isFocusing) return;
        isFocusing = false;

        // 恢复控制
        controls.setActive(true);
        
        // 👇 用 setTimeout 延迟 10 毫秒再锁定鼠标，避开当前点击事件的冲突
        setTimeout(() => {
            renderer.domElement.requestPointerLock();
        }, 10);
    }

    // 每帧更新动画（在 main.js 的 animate 里调用）
    function update() {
        if (!currentModel) return;

        if (isFocusing) {
            // ✏️ 修改：处理聚焦飞行
            // 1. 计算目标位置：相机正前方 distance 处
            const cameraDir = new THREE.Vector3();
            camera.getWorldDirection(cameraDir);
            targetPos.copy(camera.position).add(cameraDir.multiplyScalar(CONFIG.distance));

            // 2. 模型平滑飞向正前方
            currentModel.position.lerp(targetPos, CONFIG.speed);

            // 3. 👇👇👇 修复朝向：让模型锁定水平面，看向相机
            dummy.position.copy(currentModel.position);
            dummy.lookAt(camera.position); // 这样算出的角度绝对是平视相机，绝不会歪脖子
            
            // 👇👇👇 终极微调：应用你配置的偏移量
            dummy.rotation.x += CONFIG.offsetX;
            dummy.rotation.y += CONFIG.offsetY;
            dummy.rotation.z += CONFIG.offsetZ;

            // 平滑过渡到看向相机的角度
            currentModel.quaternion.slerp(dummy.quaternion, CONFIG.speed);

        } else {
            // ✏️ 修改：退出聚焦状态，只负责平滑飞回老家，旋转交给 animations.js
            currentModel.position.lerp(originalPos, CONFIG.speed);
        }
    }

    // 暴露状态给 main.js
    return { 
        focus, 
        unfocus, 
        update, 
        getIsFocusing: () => isFocusing
    };
}