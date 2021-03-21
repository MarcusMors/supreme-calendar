const { Event } = require("./event.js")

class Calendar {
	constructor(summary, id) {
		this.summary = summary
		this.id = id
		this.hasEvents = false
		this.events = []
		this.eventsLength = 0
		this.hasExceptions = false
		this.exceptionDays = []
	}
	addEvent(summary, description, id, start, end) {
		this.events.push(new Event(summary, description))
		this.events[this.events.length - 1].addData(id, start, end, description)
		console.log(`An event has been added`)
		if (!description) {
			this.events[this.eventsLength].addNoDescription(0)
		}
		this.eventsLength++
	}
	getEventsLength() {
		// if (this.hasEvents) {
		// 	console.log(`getEventsLength\nthis.hasEvents : ${this.hasEvents}`)
		// 	console.log(`this.summary : ${this.summary}`)
		// 	return this.events.length
		// } else {
		// 	return 0
		// }
		return this.eventsLength
	}
}

module.exports = { Calendar, Event }
