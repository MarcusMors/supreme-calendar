class Event {
	constructor(
		summary,
		description,
		ids = false,
		starts = false,
		ends = false
	) {
		this.summary = summary
		this.description = description
		ids ? (this.ids = ids) : (this.ids = [])
		starts ? (this.starts = starts) : (this.starts = [])
		ends ? (this.ends = ends) : (this.ends = [])
	}
	length() {
		return this.ids.length()
	}
	addEvent(id, start, end) {
		this.ids.push(id)
		this.starts.push(start)
		this.ends.push(end)
	}
}

module.exports = { Event }
