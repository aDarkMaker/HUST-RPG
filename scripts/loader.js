import { resource, RESOURCE_TYPE, LOAD_EVENT } from '@eva/eva.js';

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
    preload: true,
    id: 'map_background'  
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
    preload: true,
    id: 'character_huaxiaoke'  
  }
];

// 预加载所有资源
export const preload = () => {
  return new Promise((resolve, reject) => {
    // 重置计数
    let loadedResources = new Set();
    
    // 清理之前可能存在的资源
    for (const res of resources) {
      if (resource.resourcesMap[res.name]) {
        resource.destroy(res.name);
      }
    }

    // 添加资源到资源管理器
    resource.addResource(resources);
    
    // 添加事件监听
    const onStart = () => {
      console.log(`开始加载资源，总共 ${resources.length} 个资源`);
    };
    
    const onProgress = (e) => {
      // 使用资源总数作为进度指示
      const loaded = loadedResources.size;
      const total = resources.length;
      console.log(`加载进度: ${loaded}/${total}`);
    };
    
    const onLoaded = (e) => {
      const res = resources.find(r => r.name === e?.name);
      if (res) {
        loadedResources.add(res.id);
        console.log(`单个资源加载完成: ${res.name} (${res.id})`);
      }
    };

    const onComplete = () => {
      // 清理所有事件监听
      resource.off(LOAD_EVENT.START, onStart);
      resource.off(LOAD_EVENT.PROGRESS, onProgress);
      resource.off(LOAD_EVENT.LOADED, onLoaded);
      resource.off(LOAD_EVENT.COMPLETE, onComplete);
      resource.off(LOAD_EVENT.ERROR, onError);
      
      // 验证所有资源是否都已加载
      const allLoaded = resources.every(res => loadedResources.has(res.id));
      
      if (allLoaded) {
        console.log(`所有资源加载完成，共 ${loadedResources.size} 个资源`);
        resolve();
      } else {
        const missing = resources.filter(res => !loadedResources.has(res.id));
        const error = new Error(`资源加载不完整，缺少: ${missing.map(r => r.name).join(', ')}`);
        console.error(error);
        reject(error);
      }
    };

    const onError = (err) => {
      // 清理所有事件监听
      resource.off(LOAD_EVENT.START, onStart);
      resource.off(LOAD_EVENT.PROGRESS, onProgress);
      resource.off(LOAD_EVENT.LOADED, onLoaded);
      resource.off(LOAD_EVENT.COMPLETE, onComplete);
      resource.off(LOAD_EVENT.ERROR, onError);
      
      // 构建详细的错误信息
      let errorInfo = {
        message: err?.message || '未知错误',
        resourcesLoaded: Array.from(loadedResources),
        resourcesMissing: resources.filter(res => !loadedResources.has(res.id)).map(r => r.name),
        originalError: err
      };
      
      console.error('资源加载失败:', errorInfo);
      reject(new Error(`资源加载失败: ${errorInfo.message}`));
    };

    // 注册事件
    resource.on(LOAD_EVENT.START, onStart);
    resource.on(LOAD_EVENT.PROGRESS, onProgress);
    resource.on(LOAD_EVENT.LOADED, onLoaded);
    resource.on(LOAD_EVENT.COMPLETE, onComplete);
    resource.on(LOAD_EVENT.ERROR, onError);

    // 开始预加载
    try {
      resource.preload();
    } catch (err) {
      onError(err);
    }
  });
};

export { resources };