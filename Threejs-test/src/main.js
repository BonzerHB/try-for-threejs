// src/main.js
import * as THREE from 'three'; 
import { initScene } from './bases/scene.js';
import { initLights } from './bases/lights.js';
import { initControls } from './player/controls.js';
import { loadModel } from './mobs/models.js'; 
import { spinModel } from './systems/animations.js'; 
import { initEnvironment } from './room/environment.js'; 
import { initInteraction } from './bases/interaction.js'; 
import { initFocus } from './player/focus.js'; 

// 1. 初始化
const { scene, camera, renderer } = initScene();
initLights(scene, camera);
initEnvironment(scene);
const controls = initControls(camera, renderer); 

// 2. 初始化检视模块
const focusManager = initFocus(camera, renderer, controls);

// 3. 加载模型
let mainModel = null;
loadModel(scene, 'models/ghost.glb', (model) => {
    mainModel = model; 
});

// 4. 绑定交互
// 点击选中 -> 触发 focusManager.focus
initInteraction(camera, renderer, () => mainModel, (model) => {
    focusManager.focus(model);
});

// 按空格退出 -> 触发 focusManager.unfocus
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); 
        focusManager.unfocus();
    }
});

// 5. 动画循环
function animate() {
    requestAnimationFrame(animate);
    controls.update(); 

    // 飞行交给 focusManager.update() 处理
    focusManager.update();

    if (mainModel) {
        // 只要没在聚焦，就开始空闲状态的处理
        if (!focusManager.getIsFocusing()) {
            // 👇👇👇 核心修复：把聚焦时扭歪的 X 和 Z 轴平滑拉回 0（挺直腰板）
            mainModel.rotation.x = THREE.MathUtils.lerp(mainModel.rotation.x, 0, 0.1);
            mainModel.rotation.z = THREE.MathUtils.lerp(mainModel.rotation.z, 0, 0.1);
            
            // 然后在正常的基础上，让它原地自转
            spinModel(mainModel); 
        }
    }

    renderer.render(scene, camera);
}

animate();