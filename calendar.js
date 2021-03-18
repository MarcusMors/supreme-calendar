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
	addNewEvent(summary, description, id, start, end) {
		this.events.push(new Event(summary, description))
		this.events[this.events.length].addData(id, start, end)
	}
}

module.exports = { Calendar, Event }
