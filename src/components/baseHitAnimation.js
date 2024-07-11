import Phaser from "phaser";
import MDS from "../utility/mds";
import HitPhrases from "../components/hitPhrases";
import crater from "../../public/assets/holeInground.png";
import mushroomCloud from "../../public/assets/mushroomCloud.png";

export default class BaseHitAnimation {
	constructor(scene) {
		this.scene = scene;
		this.screenRect = null;
		this.line = null;
		this.phrase = null;
		this.hitPhrases = new HitPhrases();
		this.flames = null;
		this.cloud = null;
	}

	preload(width, height) {
		this.width = width;
		this.height = height;
		this.scene.load.image("crater", crater);
		this.scene.load.image("mushroomCloud", mushroomCloud);

		this.scene.load.audio("explosion", [
			"assets/explosion.wav",
			"assets/explosion.mp3",
			"assets/explosion.ogg",
		]);

		// this.scene.load.video("flames", "flames.mp4", true);
	}

	create() {
		this.explosion = this.scene.sound.add("explosion");

		this.screenRect = this.scene.add.rectangle(
			600,
			400,
			this.width,
			this.height
		);
		this.screenRect.setDepth(30);
		this.screenRect.visible = false;

		this.createCracks();
	}

	play(x, y, player, opponent) {
		this.x = x;
		this.y = y;
		const img1 = this.scene.add.image(x, y, "crater");
		img1.setDepth(16);
		this.showCloud();
		this.explosion.play();
		this.screenRect.visible = true;
		this.showColorTween();
		this.showPhrase(player, opponent);
	}

	showCloud() {
		this.cloud = this.scene.add
			.sprite(this.x, this.y, "mushroomCloud")
			.setDepth(20);

		this.scene.tweens.addCounter({
			from: 0,
			to: 1,
			duration: 4000,
			yoyo: false,
			onUpdate: (tween) => {
				const v = tween.getValue();
				// console.log(v);
				this.cloud.setScale(v);
				this.cloud.y -= v * 0.4;
			},
		});
	}

	showColorTween() {
		const color1 = Phaser.Display.Color.ValueToColor(MDS.getRandomColor());
		const color2 = Phaser.Display.Color.ValueToColor(MDS.getRandomColor());

		this.line.visible = true;

		const colorTween = this.scene.tweens.addCounter({
			from: 0,
			to: 5,
			duration: 3000,
			ease: Phaser.Math.Easing.Linear,
			yoyo: true,
			repeat: 0,
			paused: false,
			onUpdate: (tween) => {
				const value = tween.getValue();
				const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
					color1,
					color2,
					10,
					value
				);
				const color = Phaser.Display.Color.GetColor(
					colorObject.r,
					colorObject.g,
					colorObject.b
				);
				this.screenRect.setFillStyle(color, 0.8);
			},
			onComplete: () => {
				this.cloud.visible = true;
				this.screenRect.visible = false;
				this.line.visible = false;
				this.phrase.visible = false;
				// this.flames = this.scene.add.video(400, 400, "flames");
				// this.flames.setDepth(50);
				// this.flames.play();
			},
		});
	}

	createCracks() {
		const color = 0x000000;

		this.line = this.scene.add.graphics(0, 0).lineStyle(2, color, 1);
		this.line.moveTo(100, 100);
		this.line.lineTo(600, 300);
		this.line.lineTo(1100, 700);
		this.line.moveTo(1100, 100);
		this.line.lineTo(100, 600);
		this.line.moveTo(680, 100);
		this.line.lineTo(560, 700);
		this.line.strokePath();
		this.line.setDepth(50);
		this.line.visible = false;
	}

	showPhrase(player, opponent) {
		const screenCenterX =
			this.scene.cameras.main.worldView.x + this.scene.cameras.main.width / 2;
		const screenCenterY =
			this.scene.cameras.main.worldView.y + this.scene.cameras.main.height / 2;
		const phrase = this.hitPhrases.getPhrase(player, opponent);
		this.phrase = this.scene.add
			.text(screenCenterX, screenCenterY, phrase, {
				font: "56px Arial",
			})
			.setOrigin(0.5);
		this.phrase.setDepth(50);
		this.speak(phrase);
	}

	speak(phrase) {
		// Create a SpeechSynthesisUtterance
		const utterance = new SpeechSynthesisUtterance(phrase);

		// Select a voice
		const voices = speechSynthesis.getVoices();
		utterance.voice = voices[0]; // Choose a specific voice

		// Speak the text
		speechSynthesis.speak(utterance);
	}
}
