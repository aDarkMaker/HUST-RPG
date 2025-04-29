import { Scene } from 'eva.js';

export default class MainScene extends Scene {
    constructor() {
        super();
        this.name = 'MainScene';
        this.init();
    }

    init() {
        // 初始化场景内容，例如添加背景、角色等
        console.log('MainScene initialized');
    }
}