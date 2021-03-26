const { Event } = require("./event.js")

Array.prototype.insert = function (data, position) {
	if (position >= this.length) {
		this.push(data)
	} else if (position <= 0) {
		this.unshift(data)
	} else {
		for (let i = this.length; i >= position; i--) {
			this[i] = this[i - 1]
		}
		this[position] = data
	}
}
function (arr, x, start, end) {

    // Base Condition
    if (start > end) return false;

    // Find the middle index
    let mid=Math.floor((start + end)/2);

    // Compare mid with given key x
    if (arr[mid]===x) return true;

    // If element at mid is greater than x,
    // search in the left half of mid
    if(arr[mid] > x)
        return recursiveFunction(arr, x, start, mid-1);
    else

        // If element at mid is smaller than x,
        // search in the right half of mid
        return recursiveFunction(arr, x, mid+1, end);
}
function binaryEventInsertion(events, element, begin, tail) {
	if (tail - begin >= 1) {
		const mid = Math.floor((tail - begin) / 2)
		const event = event[mid]
		if (element.start > event.start) {
			return binaryEventInsertion(events, element, mid, tail)
		} else if (element.start < event.start) {
			return binaryEventInsertion(events, element, begin, tail)
		} else {
			if (element.end < event.end) {
				//
			} else {
				//
			}
			//
		}
	} else {
		// .insert or .splice(index, delete, element 1, element 2)
	}
}
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
	getDayEvents(date, sortByStart = true) {
		let events = []
		if (date > 10) {
		} else {
			for (let i = 0; i < this.eventsLength; i++) {
				const event = this.events[i]
				const [ids, starts, ends, descriptions] = event.getDayEvents(
					date,
					sortByStart
				)
				for (let j = 0; j < ids.length; j++) {
					const id = ids[j]
					const start = starts[j]
					const end = ends[j]
					const description = descriptions[j]
					const eventObj = {
						summary: event.summary,
						id: id,
						start: start,
						end: end,
						description: description,
					}
					events.push(eventObj)
				}
			}
			//sort
			// eg. 2021-03-24T19:23:28.132Z
			const eventsLength = events.length
			if (eventsLength < 64) {
				//insertion sort
				let sortedLength = 1
				for (let i = 1; i < eventsLength; i++) {
					// let auxEventYear
					// let auxEventMonth
					// let auxEventDay
					const event = events[i]
					// const year = event.start.slice(0, 4)
					const day = event.start.slice(0, 4)
					for (let j = 0; j < sortedLength; j++) {
						//
					}
				}
			} else {
				for (let i = 0; i < eventsLength; i++) {
					const event = events[i]
				}
			}
		}
		return events
	}
}

module.exports = { Calendar, Event }
