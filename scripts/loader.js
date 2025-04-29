import { resource } from '@eva/eva.js';

// 定义游戏资源
export const resources = [
  {
    name: 'character',
    type: 'IMAGE',
    src: './assets/Character/Huaxiaoke.png'
  },
  {
    name: 'bg-campus',
    type: 'IMAGE',
    src: './assets/Background/Map.png'
  }
];

// 预加载所有资源
export const preload = async () => {
  await Promise.all(resources.map(res => 
    resource.addResource(res)
  ));
};