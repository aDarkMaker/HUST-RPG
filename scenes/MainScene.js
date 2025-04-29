import { Scene, GameObject } from '@eva/eva.js';
import { Sprite } from '@eva/plugin-renderer-sprite';

export default class MainScene extends Scene {
  constructor() {
    super('MainScene');
    this.speed = 5; // 移动速度
    this.init();
  }

  init() {
    // 创建背景
    const background = new GameObject('background', {
      size: { width: window.innerWidth, height: window.innerHeight },
      position: { x: 0, y: 0 }
    });
    background.addComponent(new Sprite({
      resource: 'bg-campus',
      spriteName: 'bg-campus'
    }));
    this.addChild(background);

    // 创建角色
    const player = new GameObject('player', {
      size: { width: 64, height: 64 },
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    });
    player.addComponent(new Sprite({
      resource: 'character',
      spriteName: 'character'
    }));
    this.addChild(player);

    // 添加键盘控制
    this.bindKeyboardEvents();
  }

  bindKeyboardEvents() {
    // 记录按键状态
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false
    };

    // 键盘按下事件
    window.addEventListener('keydown', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w': this.keys.w = true; break;
        case 'a': this.keys.a = true; break;
        case 's': this.keys.s = true; break;
        case 'd': this.keys.d = true; break;
      }
    });

    // 键盘释放事件
    window.addEventListener('keyup', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w': this.keys.w = false; break;
        case 'a': this.keys.a = false; break;
        case 's': this.keys.s = false; break;
        case 'd': this.keys.d = false; break;
      }
    });

    // 添加更新循环
    this.gameObject.addComponent({
      update: () => {
        this.updatePlayerPosition();
      }
    });
  }

  updatePlayerPosition() {
    const player = this.gameObjects.find(obj => obj.name === 'player');
    if (!player) return;

    // 计算移动方向
    if (this.keys.w) player.position.y -= this.speed;
    if (this.keys.s) player.position.y += this.speed;
    if (this.keys.a) player.position.x -= this.speed;
    if (this.keys.d) player.position.x += this.speed;
  }
}