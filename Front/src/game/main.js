import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        Game,
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
        matter: {
            debug: true,
            gravity: {
                y: 0,
            }
        },
    },
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });
}

export default StartGame;
