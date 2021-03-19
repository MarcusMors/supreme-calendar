class Event {
	constructor(summary, description = "") {
		this.summary = summary
		this.description = description
		this.hasData = false
		this.ids = []
		this.starts = []
		this.ends = []
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
