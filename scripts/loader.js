import { resource, RESOURCE_TYPE } from '@eva/eva.js';

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
    // 添加新资源
    resource.addResource(resources);
    
    // 开始预加载
    resource.preload().then(() => {
      console.log('资源加载完成');
      resolve();
    }).catch(err => {
      console.error('资源加载失败:', err);
      reject(err);
    });
  });
};

export { resources };