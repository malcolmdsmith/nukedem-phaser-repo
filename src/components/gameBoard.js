export default class GameBoard {
	constructor(scene, width, height, wind) {
		this.scene = scene;
		this.width = width;
		this.height = height;
		this.windVelocity = wind;
	}

	update(wind) {
		this.windVelocity = wind;
	}

	draw() {
		this.drawWind();
	}

	drawWind() {
		let wind = "";
		let velocity = Math.abs(this.windVelocity) * 10 + "km/h";

		if (this.windVelocity > 0) wind = "WIND ---> " + velocity;
		else wind = "<--- WIND " + velocity;

		const text = this.scene.add
			.text(this.width / 2, 20, wind, 0xffffff, 1)
			.setOrigin(0.5, 0);
		text.setDepth(30);

		// const line = this.scene.add
		// 	.line(this.width / 2, 30, this.width / 2 + 50, 30, 0xffffff, 1)
		// 	.setOrigin(0.5);
		// line.setDepth(30);
	}
}
