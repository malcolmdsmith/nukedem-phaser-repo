export default class MDS {
	static randomInt(min, max) {
		// min and max included
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	static getRandomColor() {
		const letters = "0123456789ABCDEF";

		let color = "#";
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(this.randomInt(0, 15))];
		}

		console.log(color);
		return color;
	}

	static getRandomColorRGB() {
		const r = Math.random() * 255;
		const g = Math.random() * 255;
		const b = Math.random() * 255;

		return `rgba(${r},${g},${b}, 0.7)`;
	}
}
