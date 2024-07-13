export default class HitPhrases {
	hitPhrases = new Array();

	constructor() {
		this.hitPhrases.push("NICE SHOT BOB! WAY TO GO <player>!");
		this.hitPhrases.push("NICE FIRING! <player>!");
		this.hitPhrases.push("WOW! THIS GUYS A HOT SHOT!");
		this.hitPhrases.push("BETTER GET YOUR ACT TOGETHER <opponent>!");
		this.hitPhrases.push("CRACK SHOT, ACE!");
		this.hitPhrases.push("NICE SHOT! GO TEAM <player>!");
		this.hitPhrases.push("TOP GUN HEY!!");
		this.hitPhrases.push("WISE GUY! HUH");
	}

	getPhrase(player, opponent) {
		let rand = Math.floor(Math.random() * this.hitPhrases.length);
		let phrase = this.hitPhrases[rand];
		if (player == "") phrase = phrase.replace("<player>", "JOE");
		else phrase = phrase.replace("<player>", player);
		if (opponent == "") phrase = phrase.replace("<opponent>", "JOE");
		else phrase = phrase.replace("<opponent>", opponent);

		return phrase;
	}
}
