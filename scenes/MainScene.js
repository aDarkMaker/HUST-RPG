import { Scene, GameObject } from '@eva/eva.js';
import { Img } from '@eva/plugin-renderer-img';
import { Event } from '@eva/plugin-renderer-event';

export default class MainScene extends Scene {
  constructor() {
    super();
    this.speed = 5;
    this.mapSize = {
      width: 1920,  // 地图实际宽度
      height: 1080  // 地图实际高度
    };
    this.init();
  }

  init() {
    console.log('正在初始化主场景...');
    // 设置场景大小为窗口大小
    this.transform.size.width = window.innerWidth;
    this.transform.size.height = window.innerHeight;

    // 创建地图
    this.createMap();
    
    // 创建角色
    this.createCharacter();
    
    // 初始化角色位置和摄像机
    this.initCameraAndCharacter();
    
    // 添加键盘控制
    this.bindKeyboardEvents();
    
    // 监听窗口大小变化
    window.addEventListener('resize', () => {
      // 更新场景大小
      this.transform.size.width = window.innerWidth;
      this.transform.size.height = window.innerHeight;
      
      // 调整摄像机
      this.updateCameraPosition();
    });

    console.log('主场景初始化完成');
  }
  
  createMap() {
    // 创建地图容器
    this.mapContainer = new GameObject('mapContainer', {
      position: { x: 0, y: 0 }
    });
    
    // 创建地图精灵
    const map = new GameObject('map', {
      size: {
        width: this.mapSize.width,
        height: this.mapSize.height
      }
    });
    
    console.log('创建地图对象...');
    
    // 添加地图图片
    map.addComponent(new Img({
      resource: 'map',
      autoSize: false
    }));
    
    // 将地图添加到容器
    this.mapContainer.addChild(map);
    
    console.log('地图对象创建完成，添加到场景');
    
    // 将地图容器添加到场景
    this.addChild(this.mapContainer);
  }
  
  createCharacter() {
    // 创建角色精灵
    this.character = new GameObject('character', {
      size: { width: 64, height: 64 },
      origin: { x: 0.5, y: 0.5 },
      anchor: { x: 0.5, y: 0.5 }
    });
    
    console.log('创建角色对象...');
    
    // 为角色添加图片组件
    this.character.addComponent(new Img({
      resource: 'character',
      autoSize: false
    }));
    
    // 添加事件组件
    this.character.addComponent(new Event());
    
    console.log('角色对象创建完成，添加到场景');
    
    // 将角色添加到场景
    this.addChild(this.character);
  }
  
  initCameraAndCharacter() {
    // 设置角色在世界中的位置 (地图中心)
    this.characterWorldPosition = {
      x: this.mapSize.width / 2,
      y: this.mapSize.height / 2
    };
    
    // 更新摄像机和角色位置
    this.updateCameraPosition();
  }

  bindKeyboardEvents() {
    const keys = {
      w: false,
      a: false,
      s: false,
      d: false
    };

    // 监听按键按下
    window.addEventListener('keydown', (e) => {
      switch(e.key.toLowerCase()) {
        case 'w': keys.w = true; break;
        case 'a': keys.a = true; break;
        case 's': keys.s = true; break;
        case 'd': keys.d = true; break;
      }
    });

    // 监听按键抬起
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
      
      let dx = 0;
      let dy = 0;
      
      // 计算移动方向
      if (keys.w) dy -= this.speed;
      if (keys.s) dy += this.speed;
      if (keys.a) dx -= this.speed;
      if (keys.d) dx += this.speed;
      
      if (dx === 0 && dy === 0) return; // 没有移动则不更新
      
      // 计算新位置
      const newX = Math.max(32, Math.min(this.mapSize.width - 32, this.characterWorldPosition.x + dx));
      const newY = Math.max(32, Math.min(this.mapSize.height - 32, this.characterWorldPosition.y + dy));
      
      // 更新角色世界位置
      this.characterWorldPosition.x = newX;
      this.characterWorldPosition.y = newY;
      
      // 更新摄像机位置
      this.updateCameraPosition();
    };
  }

  updateCameraPosition() {
    if (!this.character || !this.mapContainer) return;
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // 计算角色在屏幕上的理想位置（屏幕中心）
    const targetScreenX = screenWidth / 2;
    const targetScreenY = screenHeight / 2;
    
    // 计算地图容器应该的偏移量，使角色位于屏幕中心
    let mapOffsetX = targetScreenX - this.characterWorldPosition.x;
    let mapOffsetY = targetScreenY - this.characterWorldPosition.y;
    
    // 边界检查：确保地图不会显示黑边
    
    // 右边界：地图右侧不能超出屏幕右侧
    if (mapOffsetX + this.mapSize.width < screenWidth) {
      mapOffsetX = screenWidth - this.mapSize.width;
    }
    
    // 左边界：地图左侧不能超出屏幕左侧
    if (mapOffsetX > 0) {
      mapOffsetX = 0;
    }
    
    // 下边界：地图底部不能超出屏幕底部
    if (mapOffsetY + this.mapSize.height < screenHeight) {
      mapOffsetY = screenHeight - this.mapSize.height;
    }
    
    // 上边界：地图顶部不能超出屏幕顶部
    if (mapOffsetY > 0) {
      mapOffsetY = 0;
    }
    
    // 设置地图容器位置
    this.mapContainer.transform.position.x = mapOffsetX;
    this.mapContainer.transform.position.y = mapOffsetY;
    
    // 计算角色在屏幕上的实际位置
    const characterScreenX = this.characterWorldPosition.x + mapOffsetX;
    const characterScreenY = this.characterWorldPosition.y + mapOffsetY;
    
    // 更新角色的屏幕位置
    this.character.transform.position.x = characterScreenX;
    this.character.transform.position.y = characterScreenY;
  }
}