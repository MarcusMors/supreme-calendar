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
	print() {
		const eventsLength = this.getEventsLength()
		console.log(`\ncalendar summary : ${this.summary}`)
		let hasDescriptions = false
		for (let k = 0; k < eventsLength; k++) {
			const event = this.events[k]
			const descriptions = event.descriptions
			let atLeastOneDescription = false
			for (let l = 0; l < descriptions.length; l++) {
				const description = descriptions[l]
				if (Object.entries(description).length > 0) {
					atLeastOneDescription = true
				}
			}
			descriptions ? (hasDescriptions = true) : (hasDescriptions = false)
			console.log(`\tsummary\t\t : ${event.summary}`)

			if (atLeastOneDescription) {
				for (let l = 0; l < descriptions.length; l++) {
					const description = descriptions[l]
					let hasDescription
					Object.entries(description).length === 0
						? (hasDescription = false)
						: (hasDescription = true)
					if (hasDescription) {
						console.log(description)
					} else {
						console.log(`\t\tNo description`)
					}
				}
			} else {
				console.log(`\tdescription\t : no-descriptions`)
			}
			console.log(`\tdataLength\t :\t${event.getLength()}`)
			for (let l = 0; l < event.length; l++) {
				const id = event.id[l]
				const start = event.start[l]
				const end = event.end[l]
				console.log(`${start} - ${end} \n ${id}`)
			}
		}
		if (!hasDescriptions) {
			console.log(`\tNo events have been found`)
		}
	}
	getDayEvents(date) {
		let events = []
		// if (date > 10) {
		// } else {
		for (let i = 0; i < this.events.length; i++) {
			const event = this.events[i]
			const eventsLength = event.getLength()
			for (let j = 0; j < eventsLength; j++) {
				const start = event.start[j].slice(0, 10)
				const end = event.end[j].slice(0, 10)
				if (start === date || end === date) {
					events.push[event]
				}
			}
		}
		// }
		return events
	}
}

module.exports = { Calendar, Event }
