import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver'

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        // Boot,
        Preloader,
        Game,
        GameOver,
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

    return new Phaser.Game({ ...config, parent, transparent: true, });
}

export default StartGame;
