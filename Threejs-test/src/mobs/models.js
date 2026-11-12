// src/model.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function loadModel(scene, url, onLoaded) {
    const loader = new GLTFLoader();
    let model = null;

    loader.load(url, (gltf) => {
        model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);//大小比例
        model.updateMatrixWorld(true);

        // 自动居中
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); 

        // 2. 👇👇👇 新增：居中完之后，再基于原点进行偏移
        model.position.set(0, 1, 0); //右，上，前
        // 如果你想让它浮在空中，可以写 model.position.set(5, 2, 0);



        scene.add(model);
        console.log("模型加载成功！");
        
        // 加载完成后，把模型传回去
        if (onLoaded) onLoaded(model);
    }, undefined, (error) => {
        console.error('模型加载失败，检查路径：', error);
    });
}