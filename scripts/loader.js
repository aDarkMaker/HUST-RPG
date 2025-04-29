import { resource, RESOURCE_TYPE } from '@eva/eva.js';

// 定义游戏资源
export const resources = [
  {
    name: 'character',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: 'assets/Character/Huaxiaoke.png'
      }
    }
  },
  {
    name: 'bg-campus',
    type: RESOURCE_TYPE.IMAGE,
    src: {
      image: {
        type: 'png',
        url: 'assets/Background/Map.png'
      }
    }
  }
];

// 预加载所有资源
export const preload = async () => {
  try {
    await Promise.all(resources.map(res => 
      resource.addResource({
        name: res.name,
        type: res.type,
        src: res.src
      })
    ));
    console.log('资源加载成功');
  } catch (error) {
    console.error('资源加载失败:', error);
    throw error;
  }
};