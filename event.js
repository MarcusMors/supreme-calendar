class Event {
	constructor(summary) {
		this.summary = summary
		this.hasData = false
		this.ids = []
		this.starts = []
		this.ends = []
		this.descriptions = []
	}

	refineDescription(description) {
		description = description.replace(/<\/span>/g, "")
		description = description.replace(/<span>/g, "")
		description = description.replace(/ /g, "")
		description = description.toLowerCase()
		description = description.split("<br>")
		let descriptionObj = new Object()
		for (let i = 0; i < description.length; i++) {
			const property = description[i]
			const colon = property.indexOf(":")
			if (colon === -1) {
				descriptionObj[property] = true
			} else {
				const key = property.slice(0, colon)
				const value = property.slice(colon + 1, property.length)
				descriptionObj[key] = value
			}
		}
		return descriptionObj
	}

	getLength() {
		if (this.hasData) {
			return this.ids.length
		} else {
			return 0
		}
	}

	addData(id, start, end, description = "") {
		this.ids.push(id)
		this.starts.push(start)
		this.ends.push(end)
		this.hasData = true
		let refinedDescription = this.refineDescription(description)
		if (description) {
			this.descriptions.push(refinedDescription)
		} else {
			this.descriptions.push({})
		}
	}
}

module.exports = { Event }
