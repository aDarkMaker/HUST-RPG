import { Scene, GameObject } from '@eva/eva.js';
import { Img } from '@eva/plugin-renderer-img';
import { Event } from '@eva/plugin-renderer-event';

export default class MainScene extends Scene {
  constructor() {
    super();
    this.speed = 5;
    this.init();
  }

  init() {
    // 设置场景大小
    this.transform.size.width = window.innerWidth;
    this.transform.size.height = window.innerHeight;

    // 创建游戏背景
    const map = new GameObject('map', {
      size: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      position: { x: 0, y: 0 },
      origin: { x: 0, y: 0 },
      anchor: { x: 0, y: 0 }
    });

    // 添加图片组件
    const mapImg = map.addComponent(new Img({
      resource: 'map',  // 对应 loader.js 中定义的资源名称
    }));

    // 将地图添加到场景
    this.addChild(map);

    // 创建角色
    const character = new GameObject('character', {
      size: { width: 64, height: 64 },
      position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      origin: { x: 0.5, y: 0.5 },
      anchor: { x: 0.5, y: 0.5 }
    });

    // 为角色添加图片组件
    character.addComponent(new Img({
      resource: 'character'
    }));

    // 添加事件组件
    character.addComponent(new Event());
    
    this.addChild(character);
    this.character = character;

    // 添加键盘控制
    this.bindKeyboardEvents();

    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      // 更新场景大小
      this.transform.size.width = window.innerWidth;
      this.transform.size.height = window.innerHeight;
      
      // 更新地图大小
      map.transform.size.width = window.innerWidth;
      map.transform.size.height = window.innerHeight;
    });
  }

  bindKeyboardEvents() {
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

    // 使用游戏的update循环来更新位置
    this.update = () => {
      if (!this.character) return;
      
      if (keys.w) this.character.transform.position.y -= this.speed;
      if (keys.s) this.character.transform.position.y += this.speed;
      if (keys.a) this.character.transform.position.x -= this.speed;
      if (keys.d) this.character.transform.position.x += this.speed;
    };
  }
}