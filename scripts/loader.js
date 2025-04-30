import { resource, RESOURCE_TYPE, LOAD_EVENT } from '@eva/eva.js';

// 定义游戏资源，使用相对路径
const resources = [
  {
    name: 'map',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: './assets/Background/Map.png'
      }
    },
    preload: true
  },
  {
    name: 'character',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: './assets/Character/Huaxiaoke.png'
      }
    },
    preload: true
  }
];

// 预加载所有资源
export const preload = () => {
  return new Promise((resolve, reject) => {
    // 清理之前可能存在的资源
    for (const res of resources) {
      if (resource.resourcesMap[res.name]) {
        resource.destroy(res.name);
      }
    }

    // 添加资源到资源管理器
    resource.addResource(resources);
    
    // 添加事件监听
    const onComplete = () => {
      resource.off(LOAD_EVENT.COMPLETE, onComplete);
      resource.off(LOAD_EVENT.ERROR, onError);
      console.log('所有资源加载完成');
      resolve();
    };

    const onError = (err) => {
      resource.off(LOAD_EVENT.COMPLETE, onComplete);
      resource.off(LOAD_EVENT.ERROR, onError);
      console.error('资源加载失败:', err);
      reject(err);
    };

    // 注册事件
    resource.on(LOAD_EVENT.COMPLETE, onComplete);
    resource.on(LOAD_EVENT.ERROR, onError);

    // 开始预加载
    resource.preload();
  });
};

export { resources };