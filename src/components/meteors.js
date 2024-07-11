import Phaser from "phaser";
import meteor_white_20 from "../../public/assets/meteor_white_50.jpg";
import meteor_white_50 from "../../public/assets/meteor_white_20.jpg";
import meteor_white_100 from "../../public/assets/meteor_white_100.jpg";
import meteor_red_20 from "../../public/assets/meteor_red_20.jpg";
import meteor_red_50 from "../../public/assets/meteor_red_50.jpg";
import meteor_red_100 from "../../public/assets/meteor_red_100.jpg";
import meteor_yellow_20 from "../../public/assets/meteor_yellow_20.jpg";
import meteor_yellow_50 from "../../public/assets/meteor_yellow_50.jpg";
import meteor_yellow_100 from "../../public/assets/meteor_yellow_100.jpg";
import MDS from "../utility/mds";

export default class Meteors {
	scene;
	numMeteors;
	meteors;
	meteorImages = [];

	constructor(scene, numMeteors) {
		this.scene = scene;
		this.numMeteors = numMeteors;
	}

	preload() {
		this.meteorImages.push({ name: "meteor_white_20", image: meteor_white_20 });
		this.meteorImages.push({ name: "meteor_white_50", image: meteor_white_50 });
		this.meteorImages.push({
			name: "meteor_white_100",
			image: meteor_white_100,
		});
		this.meteorImages.push({ name: "meteor_red_20", image: meteor_red_20 });
		this.meteorImages.push({ name: "meteor_red_50", image: meteor_red_50 });
		this.meteorImages.push({ name: "meteor_red_100", image: meteor_red_100 });
		this.meteorImages.push({
			name: "meteor_yellow_20",
			image: meteor_yellow_20,
		});
		this.meteorImages.push({
			name: "meteor_yellow_50",
			image: meteor_yellow_50,
		});
		this.meteorImages.push({
			name: "meteor_yellow_100",
			image: meteor_yellow_100,
		});

		for (let i = 0; i < this.meteorImages.length; i++) {
			this.scene.load.image(
				this.meteorImages[i].name,
				this.meteorImages[i].image
			);
		}
	}

	create() {
		this.meteors = [];

		// Create meteors with random angles and speeds
		for (let i = 0; i < this.meteorImages.length; i++) {
			const meteor = this.scene.add.sprite(
				MDS.randomInt(0, 1200),
				Math.random() * -50,
				this.meteorImages[i].name
			); // Start off-screen
			meteor.setDepth(2);
			const angle = Math.random() * (Math.PI / 2) + Math.PI / 4; // Random angle between 45 and 135 degrees in radians
			const speed = Math.random() * 6 + 1; // Random speed between 50 and 250

			// Store meteor data
			this.meteors.push({
				meteor: meteor,
				angle: angle,
				speed: speed,
			});
		}
	}

	update() {
		for (const meteorData of this.meteors) {
			const meteor = meteorData.meteor;
			const angle = meteorData.angle;
			const speed = meteorData.speed;

			// Update meteor position based on speed and angle
			meteor.x += speed * Math.cos(angle);
			meteor.y += speed * Math.sin(angle);

			// Set meteor rotation based on angle (adjust offset for your meteor image)
			meteor.setRotation(angle - Math.PI / 2); // Adjust offset based on your meteor sprite orientation

			// Handle screen boundaries (optional)
			this.wrapSpriteOnScreen(meteor);
		}
	}

	wrapSpriteOnScreen(meteor) {
		// Check if sprite goes off-screen and wrap it around
		if (meteor.x > this.scene.cameras.main.width) {
			meteor.x = 0;
			let angle = MDS.randomInt(45, 135);
			meteor.angle = (angle * Math.PI) / 180;
			meteor.setAngle(angle);
		} else if (meteor.x < 0) {
			meteor.x = this.scene.cameras.main.width;
		}

		if (meteor.y > this.scene.cameras.main.height) {
			meteor.y = 0;
		} else if (meteor.y < 0) {
			meteor.y = this.scene.cameras.main.height;
		}
	}
}
