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
    console.log(`调整画布大小: ${width}x${height}`);
    // 更新渲染系统尺寸
    rendererSystem.resize(width, height);
    
    // 更新canvas样式
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
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
      text-shadow: 2px 2px 4px #000000;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 10px 20px;
      border-radius: 5px;
    `;
    document.body.appendChild(loading);
  }
  loading.textContent = text;
  return loading;
};

// 初始化游戏
const initGame = async () => {
  console.log('游戏初始化开始...');
  const loading = showLoadingStatus('加载中...');
  
  try {
    console.log('开始预加载资源...');
    // 预加载资源
    await preload();
    
    console.log('资源加载完成，创建场景...');
    // 移除加载提示
    loading.remove();
    
    // 创建主场景
    const mainScene = new MainScene();
    console.log('主场景创建成功');
    
    // 设置主场景
    game.scene = mainScene;
    
    // 启动游戏
    console.log('启动游戏...');
    game.start();
    console.log('游戏启动成功');
    
    // 设置画布尺寸并监听窗口大小变化
    resizeCanvas();
    
    // 防抖处理窗口大小变化事件
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 200);
    });
    
  } catch (error) {
    console.error('游戏初始化失败:', error);
    loading.textContent = '加载失败，请刷新重试';
    
    // 添加更多的错误详情显示
    const errorDetails = document.createElement('div');
    errorDetails.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      color: red;
      font-size: 14px;
      background: rgba(0,0,0,0.7);
      padding: 10px;
      border-radius: 5px;
      max-width: 80%;
      word-break: break-all;
      z-index: 1000;
    `;
    errorDetails.textContent = `错误详情: ${error.message || '未知错误'}`;
    document.body.appendChild(errorDetails);
  }
};

// 确保 DOM 已完全加载
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

export default game;