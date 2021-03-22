const { Event } = require("./event.js")

class Calendar {
	constructor(summary, id) {
		this.summary = summary
		this.id = id
		// this.hasEvents = false
		this.events = []
		this.eventsLength = 0
		this.hasExceptions = false
	}
	addEvent(summary, description, id, start, end) {
		this.events.push(new Event(summary))
		this.events[this.eventsLength].addData(id, start, end, description)
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
