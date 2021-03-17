const { Event } = require("./event.js")

class Calendar {
	constructor(summary, id, events = false) {
		this.summary = summary
		this.id = id
		events ? (this.events = events) : (this.events = [])
	}
	addEvent(summary, description, ids = false, starts = false, ends = false) {
		this.events.push(new Event(summary, description, ids, starts, ends))
	}
}

module.exports = { Calendar, Event }
