const { Event } = require("./event.js")

class Calendar {
	constructor(summary, id) {
		this.summary = summary
		this.id = id
		this.hasEvents = false
		// this.events = events ? events : []
	}
	addEvent(summary, description, ids = false, starts = false, ends = false) {
		this.events.push(new Event(summary, description, ids, starts, ends))
	}
	addNewEvent(summary, description, id, start, end) {
		if (this.hasEvents) {
			this.events.push(new Event(summary, description))
			this.events[this.events.length].addData(id, start, end)
		} else {
			this.hasEvents = true
			this.events = []
			this.events[0] = new Event(summary, description)
			this.events[0].addData(id, start, end)
		}
	}
	getEventsLength() {
		if (this.hasEvents) {
			return events.length
		} else {
			return 0
		}
	}
}

module.exports = { Calendar, Event }
