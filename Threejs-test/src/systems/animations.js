// src/animations.js
// 👇👇👇 新增：公共动画模块，专门处理模型的自转、悬浮等通用逻辑

// 自转方法：传进模型，默认每帧转 0.01 弧度
export function spinModel(model, speed = 0.01) {
    if (!model) return;
    // 横向自转
    model.rotation.y += speed;
}