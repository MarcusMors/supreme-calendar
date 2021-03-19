class Event {
	constructor(summary, description = "") {
		this.summary = summary
		this.description = description
		this.hasData = false
		this.ids = []
		this.starts = []
		this.ends = []
	}
	length() {
		if (this.ids === undefined) {
			return 0
		} else {
			return this.ids.length()
		}
	}
	addData(id, start, end) {
		this.ids.push(id)
		this.starts.push(start)
		this.ends.push(end)
	}
	addDescription(description) {
		this.description = description
	}
}

module.exports = { Event }
