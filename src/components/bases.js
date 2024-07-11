import Phaser from "phaser";
import red_base from "../../public/assets/red_base.png";
import blue_base from "../../public/assets/blue_base.png";
import green_base from "../../public/assets/green_base.png";
import gray_base from "../../public/assets/gray_base.png";

class Base {
	constructor(sprite, data) {
		this.sprite = sprite; // The Phaser sprite or image object
		this.data = data; // Any additional data you need (e.g., ID, type)
	}
}

export default class NukedBase {
	baseGroup;

	constructor(scene, baseHeight) {
		this.scene = scene;
		this.baseHeight = baseHeight;
	}

	preload() {
		this.scene.load.image("red_base", red_base);
		this.scene.load.image("blue_base", blue_base);
		this.scene.load.image("green_base", green_base);
		this.scene.load.image("gray_base", gray_base);
	}

	create() {
		// this.baseGroup = this.scene.physics.add.staticGroup();
		// this.baseGroup.create(100, this.baseHeight, "red_base");
		// this.baseGroup.create(200, this.baseHeight, "blue_base");
		// this.baseGroup.create(300, this.baseHeight, "green_base");
		// this.baseGroup.create(1100, this.baseHeight, "red_base");
		// this.baseGroup.create(1000, this.baseHeight, "blue_base");
		// this.baseGroup.create(900, this.baseHeight, "green_base");

		this.baseGroup = this.scene.physics.add.staticGroup();
		const base1 = this.scene.add
			.sprite(100, this.baseHeight, "red_base")
			.setData({
				player: 1,
				color: "red",
				points: 100,
				hit: false,
			});
		this.baseGroup.add(base1);

		const base2 = this.scene.add
			.sprite(200, this.baseHeight, "blue_base")
			.setData({
				player: 1,
				color: "blue",
				points: 70,
				hit: false,
			});
		this.baseGroup.add(base2);

		const base3 = this.scene.add
			.sprite(300, this.baseHeight, "green_base")
			.setData({
				player: 1,
				color: "green",
				points: 40,
				hit: false,
			});
		this.baseGroup.add(base3);

		const base4 = this.scene.add
			.sprite(1100, this.baseHeight, "red_base")
			.setData({
				player: 2,
				color: "red",
				points: 100,
				hit: false,
			});
		this.baseGroup.add(base4);

		const base5 = this.scene.add
			.sprite(1000, this.baseHeight, "blue_base")
			.setData({
				player: 2,
				color: "blue",
				points: 70,
				hit: false,
			});
		this.baseGroup.add(base5);

		const base6 = this.scene.add
			.sprite(900, this.baseHeight, "green_base")
			.setData({
				player: 2,
				color: "green",
				points: 40,
				hit: false,
			});
		this.baseGroup.add(base6);

		const baseBonus = this.scene.add
			.sprite(600, this.baseHeight - 280, "gray_base")
			.setData({
				player: 0,
				color: "gray",
				points: 200,
				hit: false,
			});
		this.baseGroup.add(baseBonus);

		this.baseGroup.setDepth(6);
	}
}
