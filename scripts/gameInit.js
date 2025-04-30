import { Game } from '@eva/eva.js';
import { RendererSystem } from '@eva/plugin-renderer';
import { ImgSystem } from '@eva/plugin-renderer-img';
import { EventSystem } from '@eva/plugin-renderer-event';
import MainScene from '../scenes/MainScene';
import { preload } from './loader';

// 获取浏览器窗口尺寸
const getWindowSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight
});

// 创建游戏实例
const game = new Game({
  systems: [
    new RendererSystem({
      canvas: document.querySelector('#canvas'),
      width: getWindowSize().width,
      height: getWindowSize().height,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      enableScroll: false,
      transparent: false,
      backgroundColor: 0x000000
    }),
    new ImgSystem(),
    new EventSystem()
  ]
});

// 调整画布尺寸以适应窗口
const resizeCanvas = () => {
  const { width, height } = getWindowSize();
  const canvas = document.querySelector('#canvas');
  const rendererSystem = game.getSystem(RendererSystem);
  
  if (canvas && rendererSystem) {
    // 更新渲染系统尺寸
    rendererSystem.resize(width, height);
    
    // 更新canvas样式
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    
    // 通知场景大小变化（如果需要）
    if (game.scene) {
      game.scene.transform.size.width = width;
      game.scene.transform.size.height = height;
    }
  }
};

// 创建加载提示
const showLoadingStatus = (text) => {
  let loading = document.getElementById('loading-status');
  if (!loading) {
    loading = document.createElement('div');
    loading.id = 'loading-status';
    loading.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 24px;
      z-index: 1000;
    `;
    document.body.appendChild(loading);
  }
  loading.textContent = text;
  return loading;
};

// 初始化游戏
const initGame = async () => {
  const loading = showLoadingStatus('加载中...');
  
  try {
    // 预加载资源
    await preload();
    
    // 移除加载提示
    loading.remove();
    
    // 创建主场景
    const mainScene = new MainScene();
    
    // 设置主场景
    game.scene = mainScene;
    
    // 启动游戏
    game.start();
    
    // 设置画布尺寸并监听窗口大小变化
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
  } catch (error) {
    console.error('游戏初始化失败:', error);
    loading.textContent = '加载失败，请刷新重试';
  }
};

// 等待 DOM 加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', initGame);

export default game;