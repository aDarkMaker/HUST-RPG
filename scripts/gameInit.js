import Eva from 'eva.js';
import MainScene from '../components/MainScene';

const game = new Eva({
    container: document.getElementById('game'),
    width: window.innerWidth,
    height: window.innerHeight,
    resources: ['assetPath']
});

game.load();
game.addScene(new MainScene());
game.start();

export default game;