import Phaser from "phaser";

import bg_jpg from "../../public/assets/background.jpg";
// import bg_jpg from "../assets/bg_1200x800.jpg";
import missile_png from "../../public/assets/white-missile.png";
import deathStar from "../../public/assets/deathStar.png";
import saturn from "../../public/assets/saturn.png";
import Meteors from "../components/meteors";
import NukedemBase from "../components/bases";
import MDS from "../utility/mds";
import BaseHitAnimation from "../components/baseHitAnimation";
import Terrain from "../components/terrain";
import GameBoard from "../components/gameBoard";
import { TERRAIN } from "../components/constants";

export class Game extends Phaser.Scene {
	constructor() {
		super("Game");

		this.screenRect = null;
		this.colorTween = null;
		this.baseHitAnimation = new BaseHitAnimation(this);
		this.terrain;
		this.gameBoard;
	}

	missile;
	isCollided = false;
	launchAngle = (65 * Math.PI) / 180;
	launchSpeed = 200;
	particles;
	tailGraphics;
	hitX = 0;
	hitY = 0;
	windForce = new Phaser.Math.Vector2(-5, 0);
	gameover = false;
	shotover = false;
	missileImageWidth = 19;

	preload() {
		const { width, height } = this.sys.game.canvas;
		this.sceneHeight = height;
		this.sceneWidth = width;

		this.load.image("bg", bg_jpg);
		this.load.image("missile", missile_png);
		this.load.image("deathStar", deathStar);
		this.load.image("saturn", saturn);

		this.gameBaord = new GameBoard(this, width, height, this.windForce.x);
		this.terrain = new Terrain(this, width, height);
		this.terrain.preload();
		this.baseHitAnimation.preload(width, height);

		this.baseHeight = this.sceneHeight - TERRAIN.height;

		this.meteors = new Meteors(this, 4);
		this.meteors.preload();

		this.bases = new NukedemBase(this, 650);
		this.bases.preload();
	}

	create() {
		this.baseHitAnimation.create();

		//Show Background
		const bg = this.add.image(0, 0, "bg");
		bg.scale = 0.5;
		bg.setDepth(1);

		//Show death star and saturn
		const deathStar = this.add.image(1100, 100, "deathStar");
		deathStar.setDepth(2);
		const saturn = this.add.image(100, 100, "saturn");
		saturn.setScale(0.4);
		saturn.setDepth(2);

		this.terrain.create();
		this.bases.create();
		this.meteors.create();
		this.gameBaord.draw();

		this.missile = this.physics.add.sprite(200, 600, "missile");
		this.missile.scale = 0.2;
		this.missile.setMass(1);
		this.missile.setDepth(10);
		this.fireMissile();

		this.physics.add.overlap(
			this.missile,
			this.terrain.terrainGroup,
			this.handleTerrainCollision,
			null,
			this
		);

		this.physics.add.overlap(
			this.missile,
			this.terrain.mountain,
			this.handleTerrainCollision,
			(missile, mountain) => {
				const offsetX =
					500 - Math.min(...this.terrain.mountainPoints.map((x) => x)); // Minimum x-value
				const offsetY = 350; // Assuming all y-values are positive (adjust if needed)

				let poly = new Phaser.Geom.Polygon(this.terrain.mountainPoints);

				const point = new Phaser.Math.Vector2(
					missile.x - offsetX,
					missile.y - offsetY
				);
				if (Phaser.Geom.Polygon.ContainsPoint(poly, point)) {
					// console.log("HIT");
					return true;
				} else {
					// console.log("MISS");
					return false;
				}
			},
			this
		);

		this.physics.add.overlap(
			this.missile,
			this.bases.baseGroup,
			this.handleBaseCollision,
			null,
			this
		);
	}

	fireMissile() {
		this.hitMarkerDrawn = false;
		this.shotover = false;

		this.missile.visible = true;
		this.missile.x = MDS.randomInt(200, 400);
		this.missile.y = 500;
		// Calculate initial velocity components based on launch angle and speed
		const vx = this.launchSpeed * Math.cos(this.launchAngle);
		const vy = this.launchSpeed * Math.sin(this.launchAngle);

		this.missile.body.setVelocity(vx, -1 * vy);
	}

	drawHitMarker() {
		if (this.hitMarkerDrawn) return;

		this.hitMarkerDrawn = true;
		const line = this.add.line(
			0,
			0,
			this.hitX,
			this.hitY + 1,
			this.hitX + 1,
			this.hitY + 3,
			0xffffff,
			1
		);
		line.setLineWidth(2);
		line.setDepth(15);
	}

	handleBaseCollision(missile, baseGroup) {
		if (baseGroup.data.list.hit) return;
		if (this.shotover) return;

		this.hitMarkerDrawn = true;

		missile.visible = false;
		missile.body.setVelocity(0, 0);
		baseGroup.visible = false;
		baseGroup.data.list.hit = true;

		this.baseHitAnimation.play(baseGroup.x, this.baseHeight + 10, "JIM", "JOE");

		this.shotover = true;
	}

	handleTerrainCollision(missile, terrainGroup) {
		console.log(missile.x, missile.y);
		// return;

		this.isCollided = true;
		missile.body.setVelocity(0, 0);
		this.hitX = missile.x + (missile.width * 0.2) / 2;
		this.hitY = this.baseHeight;

		this.fireMissile();
	}

	handleMountainCollision(missile, mountain) {
		// console.log("hit Mountain");
		this.isCollided = true;
		missile.body.setVelocity(0, 0);
		this.hitX = missile.x + (missile.width * 0.2) / 2;
		this.hitY = missile.y;

		this.fireMissile();
	}

	update() {
		this.meteors.update();

		// console.log("isCollided...", this.isCollided);
		if (this.isCollided) {
			this.isCollided = false;
			this.drawHitMarker();
		}

		const velocity = new Phaser.Math.Vector2(
			this.missile.body.velocity.x,
			this.missile.body.velocity.y
		);

		// Calculate rotation angle based on velocity (ensure it's not zero)
		if (velocity.lengthSq() > 0) {
			this.missile.rotation = Math.atan2(velocity.y, velocity.x) + Math.PI / 2;
		}

		const windResistance = velocity.clone().normalize().scale(this.windForce.x);
		this.missile.body.setAcceleration(windResistance.x, windResistance.y);

		if (this.missile.y > 800) {
			this.missile.x = 200;
			this.missile.y = 600;
			this.fireMissile();
		}
	}

	gameover() {
		const text = this.add
			.text(400, 300, "GAME OVER!", {
				fontFamily: "Arial",
				size: 20,
				color: "#000",
			})
			.setOrigin(0.5, 0.5)
			.setDepth(20);

		this.tweens.addCounter({
			from: 0,
			to: 1,
			duration: 3000,
			yoyo: true,
			onUpdate: (tween) => {
				const v = tween.getValue();
				const c = 255 * v;

				text.setFontSize(20 + v * 64);
				text.setColor(`rgb(${c}, ${c}, ${c})`);
			},
		});
	}
}
