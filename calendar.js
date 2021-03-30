const { Event } = require("./event.js")

function splitDate(date) {
	const year = date.slice(0, 4)
	const month = date.slice(5, 7)
	const day = date.slice(8, 10)
	const hour = date.slice(11, 13)
	const minute = date.slice(14, 16)
	return [year, month, day, hour, minute]
}

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

function binaryEventInsertion(events, element, begin, tail) {
	if (begin > end) {
		arr.insert(element, begin)
	} else {
		const mid = Math.floor((tail + begin) / 2)
		const event = event[mid]
		const [
			eventStartYear,
			eventStartMonth,
			eventStartDay,
			eventStartHour,
			eventStartMinute,
		] = splitDate(event.start)
		const [
			elementStartYear,
			elementStartMonth,
			elementStartDay,
			elementStartHour,
			elementStartMinute,
		] = splitDate(event.start)

		if (eventStartYear === elementStartYear) {
			if (eventStartMonth === elementStartMonth) {
				if (eventStartDay === elementStartDay) {
					if (eventStartHour === elementStartHour) {
						if (eventStartMinute === elementStartMinute) {
							//ENDS
							const [
								eventEndYear,
								eventEndMonth,
								eventEndDay,
								eventEndHour,
								eventEndMinute,
							] = splitDate(event.End)
							const [
								elementEndYear,
								elementEndMonth,
								elementEndDay,
								elementEndHour,
								elementEndMinute,
							] = splitDate(element.End)
							// the same up but end instead of start
							eventEndYear === elementEndYear
								? eventEndMonth === elementEndMonth
									? eventEndDay === elementEndDay
										? eventEndHour === elementEndHour
											? eventEndMinute <= elementEndMinute
												? events.insert(
														element,
														begin + 1
												  )
												: events.insert(element, begin)
											: eventEndHour > elementEndHour
											? events.insert(element, begin + 1)
											: events.insert(element, begin)
										: eventEndHour > elementEndHour
										? events.insert(element, begin + 1)
										: events.insert(element, begin)
									: eventEndMonth > elementEndMonth
									? events.insert(element, begin + 1)
									: events.insert(element, begin)
								: eventEndYear > elementEndYear
								? events.insert(element, begin + 1)
								: events.insert(element, begin)
						} else if (eventStartMinute > elementStartMinute) {
							binaryEventInsertion(
								events,
								element,
								begin,
								mid - 1
							)
						} else {
							binaryEventInsertion(events, element, mid + 1, tail)
						}
					} else if (eventStartHour > elementStartHour) {
						binaryEventInsertion(events, element, begin, mid - 1)
					} else {
						binaryEventInsertion(events, element, mid + 1, tail)
					}
				} else if (eventStartDay > elementStartDay) {
					binaryEventInsertion(events, element, begin, mid - 1)
				} else {
					binaryEventInsertion(events, element, mid + 1, tail)
				}
			} else if (eventStartMonth > elementStartMonth) {
				binaryEventInsertion(events, element, begin, mid - 1)
			} else {
				binaryEventInsertion(events, element, mid + 1, tail)
			}
		}
	}
	if (eventStartYear > elementStartYear) {
		binaryEventInsertion(events, element, begin, mid - 1)
	} else {
		binaryEventInsertion(events, element, mid + 1, tail)
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
