class Url {
	constructor(destination, userId) {
		this.urlId = Date.now();
		this.destination = destination;
		this.userId = userId;
	}

	save() {
		console.log(`Saving to database URL : ${this.destination} with id: ${this.urlId} for user: ${this.userId}`);
	}
}

module.exports = Url;
