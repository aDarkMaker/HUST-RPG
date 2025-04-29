import { Scene, GameObject } from '@eva/eva.js';
import { Sprite } from '@eva/plugin-renderer-sprite';
import { Graphics } from '@eva/plugin-renderer-graphics';
import { game } from '../scripts/gameInit';

export default class MainScene extends Scene {
  constructor() {
    super();
    this.name = 'MainScene';
    this.speed = 5;
  }

  init() {
    // 创建游戏背景
    const gameBg = new GameObject('gameBg', {
      size: { width: 1920, height: 1080 },
      position: { x: 0, y: 0 },
      origin: { x: 0, y: 0 }
    });
    
    const bgSprite = new Sprite({
      resource: 'bg-campus',
      spriteName: 'image'
    });
    gameBg.addComponent(bgSprite);
    this.addGameObject(gameBg);

    // 创建角色
    const player = new GameObject('player', {
      size: { width: 48, height: 48 },
      position: { x: 960, y: 540 },
      origin: { x: 0.5, y: 0.5 }
    });
    
    const playerSprite = new Sprite({
      resource: 'character',
      spriteName: 'image'
    });
    player.addComponent(playerSprite);
    this.addGameObject(player);

    // 添加键盘控制
    this.bindKeyboardEvents(player);
  }

  bindKeyboardEvents(player) {
    const keys = {
      w: false,
      a: false,
      s: false,
      d: false
    };

    window.addEventListener('keydown', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w': keys.w = true; break;
        case 'a': keys.a = true; break;
        case 's': keys.s = true; break;
        case 'd': keys.d = true; break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w': keys.w = false; break;
        case 'a': keys.a = false; break;
        case 's': keys.s = false; break;
        case 'd': keys.d = false; break;
      }
    });

    game.ticker.add(() => {
      if (keys.w) player.transform.position.y -= this.speed;
      if (keys.s) player.transform.position.y += this.speed;
      if (keys.a) player.transform.position.x -= this.speed;
      if (keys.d) player.transform.position.x += this.speed;
    });
  }
}