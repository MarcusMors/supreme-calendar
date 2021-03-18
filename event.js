class Event {
	constructor(
		summary,
		description = false,
		ids = false,
		starts = false,
		ends = false
	) {
		this.summary = summary
		description
			? (this.description = description)
			: (this.description = false)
		ids ? (this.ids = ids) : (this.ids = [])
		starts ? (this.starts = starts) : (this.starts = [])
		ends ? (this.ends = ends) : (this.ends = [])
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
