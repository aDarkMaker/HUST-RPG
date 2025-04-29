import { Game } from '@eva/eva.js';
import { RendererSystem } from '@eva/plugin-renderer';
import { ImgSystem } from '@eva/plugin-renderer-img';
import { SpriteSystem } from '@eva/plugin-renderer-sprite';
import MainScene from '../scenes/MainScene';
import { preload } from './loader';

// 创建游戏实例
const game = new Game({
  systems: [
    new RendererSystem({
      canvas: document.querySelector('#canvas'),
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
    }),
    new ImgSystem(),
    new SpriteSystem(),
  ]
});

// 初始化游戏
const initGame = async () => {
  // 预加载资源
  await preload();

  // 添加场景并启动游戏
  const scene = new MainScene();
  game.addScene(scene);
  game.loadScene(scene);
};

// 启动游戏
initGame().catch(console.error);

export default game;