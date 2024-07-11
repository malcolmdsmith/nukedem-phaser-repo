import terrain_jpg from "../../public/assets/terrain.png";
import mountain from "../../public/assets/mountain.png";
import mountain_mask from "../../public/assets/mountain_mask.png";
import { COLORS, TERRAIN, MOUNTAIN } from "./constants";

export default class Terrain {
	terrainGroup;
	mountain;
	mountainPoints;

	constructor(scene, width, height) {
		this.scene = scene;
		this.width = width;
		this.height = height;
	}

	preload() {
		this.scene.load.image("terrainTile", terrain_jpg);
	}

	create() {
		// Create a group to hold terrain sprites
		const numTiles = Math.ceil(this.width / TERRAIN.width + 1);

		this.terrainGroup = this.scene.physics.add.staticGroup(); // Empty group

		const terrainY = this.height - TERRAIN.height;
		console.log(terrainY);

		for (let i = 0; i < numTiles; i++) {
			this.terrainGroup
				.create(i * 100, terrainY, "terrainTile")
				.setOrigin(0, 0)
				.refreshBody();
		}
		this.terrainGroup.setDepth(5);

		this.createMountain(terrainY);
	}

	createMountain(terrainY) {
		this.mountainPoints = [0, 300, 50, 0, 70, 20, 130, 20, 150, 0, 200, 300];

		const height = terrainY - MOUNTAIN.height;
		console.log(height);

		this.mountain = this.scene.add.polygon(
			this.width / 2,
			height,
			this.mountainPoints,
			COLORS.BROWN,
			1
		);
		this.mountain.setOrigin(0.5, 0);
		this.mountain.setDepth(5);
		this.scene.physics.add.existing(this.mountain, true);
	}
}
