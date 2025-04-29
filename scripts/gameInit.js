import { Game, resource } from '@eva/eva.js';
import { RendererSystem } from '@eva/plugin-renderer';
import { ImgSystem } from '@eva/plugin-renderer-img';
import { SpriteSystem } from '@eva/plugin-renderer-sprite';
import { GraphicsSystem } from '@eva/plugin-renderer-graphics';
import { EventSystem } from '@eva/plugin-renderer-event';
import MainScene from '../scenes/MainScene';
import { resources } from './loader';

// 创建游戏实例
export const game = new Game({
  frameRate: 60, // 设置帧率
  autoStart: true, // 自动开始
  systems: [
    new RendererSystem({
      canvas: document.querySelector('#canvas'),
      width: 1920,
      height: 1080,
      antialias: true,
      resolution: 1,
      enableScroll: true,
      transparent: false,
      backgroundColor: 0x000000,
      renderType: 'webgl'
    }),
    new ImgSystem(),
    new SpriteSystem(),
    new GraphicsSystem(),
    new EventSystem()
  ]
});

// 初始化游戏
const initGame = async () => {
  try {
    // 预加载所有资源
    for (const res of resources) {
      await resource.addResource(res);
    }
    console.log('Resources loaded successfully');

    // 创建并加载主场景
    const mainScene = new MainScene();
    game.scene.transform.size.width = 1920;
    game.scene.transform.size.height = 1080;
    
    await game.scene.loadScene(mainScene);

    // 调整画布尺寸以适应窗口
    const resizeCanvas = () => {
      const canvas = document.querySelector('#canvas');
      if (!canvas) return;
      
      const windowRatio = window.innerWidth / window.innerHeight;
      const gameRatio = 1920 / 1080;
      
      let width, height;
      if (windowRatio > gameRatio) {
        height = window.innerHeight;
        width = height * gameRatio;
      } else {
        width = window.innerWidth;
        height = width / gameRatio;
      }
      
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    // 初始调整和监听窗口变化
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
};

// 启动游戏
window.addEventListener('load', () => {
  initGame();
});