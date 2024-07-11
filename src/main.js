import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
	type: Phaser.AUTO,
	width: 1200,
	height: 800,
	plugins: {
		scene: [
			{
				plugin: Phaser.Plugins.Tweens,
				start: true,
			},
		],
	},
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 35 },
			debug: false,
		},
	},
	parent: "game-container",
	// backgroundColor: '#028af8',
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [Boot, Preloader, MainMenu, Game, GameOver],
};

// export default new Phaser.Game(config);
const game = new Phaser.Game(config);
game.scene.start("Game");
