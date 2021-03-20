class Event {
	constructor(summary, description = "") {
		this.summary = summary
		this.hasData = false
		this.ids = []
		this.starts = []
		this.ends = []
		this.educational = false
		this.description = {}
		if (description) {
			description = description.replace(/<\/span>/g, "")
			description = description.replace(/<span>/g, "")
			description = description.replace(/ /g, "")
			description = description.toLowerCase()
			description = description.split("<br>")
			for (let i = 0; i < description.length; i++) {
				const property = description[i]
				const colon = property.indexOf(":")
				if (colon === -1) {
					description[property] = true
				} else {
					const key = property.slice(0, colon)
					const value = property.slice(colon + 1, property.length)
					this.description[key] = value
				}
			}
		}
	}
	getLength() {
		if (this.hasData) {
			return this.ids.length
		} else {
			return 0
		}
	}
	addData(id, start, end) {
		this.ids.push(id)
		this.starts.push(start)
		this.ends.push(end)
		this.hasData = true
	}
	addDescription(description) {
		this.description = description
	}
}

module.exports = { Event }
