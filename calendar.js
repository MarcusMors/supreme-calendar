const { Event } = require("./event.js")
const { splitDate } = require("./functions")
Array.prototype.move = function (length, position) {
	const data = this[length]
	if (position <= 0) {
		this.unshift(data)
	} else {
		for (let i = length; i >= position; i--) {
			this[i] = this[i - 1]
		}
		this[position] = data
	}
}
function merge(left, right) {
	let arr = []
	// Break out of loop if any one of the array gets empty
	while (left.length && right.length) {
		// Pick the smaller among the smallest element of left and right sub arrays
		if (left[0] < right[0]) {
			arr.push(left.shift())
		} else {
			arr.push(right.shift())
		}
	}

	// Concatenating the leftover elements
	// (in case we didn't go through the entire left or right array)
	return [...arr, ...left, ...right]
}
function mergeSort(array) {
	const half = array.length / 2

	// Base case or terminating case
	if (array.length < 2) {
		return array
	}

	const left = array.splice(0, half)
	return merge(mergeSort(left), mergeSort(array))
}

function binaryEventInsertion(events, element, begin, tail, length) {
	console.log(`begin : ${begin}\ttail : ${tail}`)
	if (begin > tail) {
		console.log("\tbase condition")
		// console.log(`\t\toldId : ${element.id}`)
		// console.log(`\t\toldStart : ${element.start}`)
		// console.log(`\t\toldEnd : ${element.end}`)
		events.move(length, begin)
		// console.log(`\t\tnewId : ${events[begin].id}`)
		// console.log(`\t\tnewStart : ${events[begin].start}`)
		// console.log(`\t\tnewEnd : ${events[begin].end}`)
		// console.log(`\t\tnextId : ${events[begin + 1].id}`)
		// console.log(`\t\tnextStart : ${events[begin + 1].start}`)
		// console.log(`\t\tnextEnd : ${events[begin + 1].end}`)
	} else {
		const mid = Math.floor((tail + begin) / 2)
		const event = events[mid]
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
		] = splitDate(element.start)

		if (eventStartYear === elementStartYear) {
			console.log(
				`\teventStartYear\t= elementStartYear\t: ${eventStartYear} = ${elementStartYear}`
			)
			if (eventStartMonth === elementStartMonth) {
				console.log(
					`\teventStartMonth\t= elementStartMonth\t: ${eventStartMonth} = ${elementStartMonth}`
				)
				if (eventStartDay === elementStartDay) {
					console.log(
						`\teventStartDay\t= elementStartDay\t: ${eventStartDay} = ${elementStartDay}`
					)
					if (eventStartHour === elementStartHour) {
						console.log(
							`\teventStartHour\t= elementStartHour\t: ${eventStartHour} = ${elementStartHour}`
						)
						if (eventStartMinute === elementStartMinute) {
							console.log(
								`\teventStartMinute\t= elementStartMinute\t: ${eventStartMinute} = ${elementStartMinute}`
							)
							//ENDS
							const [
								eventEndYear,
								eventEndMonth,
								eventEndDay,
								eventEndHour,
								eventEndMinute,
							] = splitDate(event.end)
							const [
								elementEndYear,
								elementEndMonth,
								elementEndDay,
								elementEndHour,
								elementEndMinute,
							] = splitDate(element.end)
							// the same up but end instead of start
							if (eventEndYear === elementEndYear) {
								if (eventEndMonth === elementEndMonth) {
									if (eventEndDay === elementEndDay) {
										if (eventEndHour === elementEndHour) {
											if (
												eventEndMinute <=
												elementEndMinute
											) {
												console.log(
													`\teventEndMinute\t<= elementEndMinute\t: ${eventEndMinute} <= ${elementEndMinute}`
												)
												events.move(length, mid + 1)
											} else {
												events.move(length, mid)
												console.log(
													`\teventEndMinute\t> elementEndMinute\t: ${eventEndMinute} > ${elementEndMinute}`
												)
											}
										} else if (
											eventEndHour > elementEndHour
										) {
											console.log(
												`\teventEndHour\t> elementEndHour\t: ${eventEndHour} > ${elementEndHour}`
											)
											events.move(length, mid + 1)
										} else {
											console.log(
												`\teventEndHour\t> elementEndHour\t: ${eventEndHour} > ${elementEndHour}`
											)
											events.move(length, mid)
										}
									} else if (eventEndDay > elementEndDay) {
										console.log(
											`\teventEndDay\t> elementEndDay\t: ${eventEndDay} > ${elementEndDay}`
										)
										events.move(length, mid + 1)
									} else {
										console.log(
											`\teventEndDay\t< elementEndDay\t: ${eventEndDay} < ${elementEndDay}`
										)
										events.move(length, mid)
									}
								} else if (eventEndMonth > elementEndMonth) {
									console.log(
										`\teventEndMonth\t> elementEndMonth\t: ${eventEndMonth} > ${elementEndMonth}`
									)
									events.move(length, mid + 1)
								} else {
									console.log(
										`\teventEndMonth\t< elementEndMonth\t: ${eventEndMonth} < ${elementEndMonth}`
									)
									events.move(length, mid)
								}
							} else if (eventEndYear > elementEndYear) {
								console.log(
									`\teventEndYear\t> elementEndYear\t: ${eventEndYear} > ${elementEndYear}`
								)
								events.move(length, mid + 1)
							} else {
								console.log(
									`\teventEndYear\t< elementEndYear\t: ${eventEndYear} < ${elementEndYear}`
								)
								events.move(length, mid)
							}
						} else if (eventStartMinute > elementStartMinute) {
							console.log(
								`\teventStartMinute\t> elementStartMinute\t: ${eventStartMinute} > ${elementStartMinute}`
							)
							binaryEventInsertion(
								events,
								element,
								begin,
								mid - 1,
								length
							)
						} else {
							console.log(
								`\teventStartMinute\t< elementStartMinute\t: ${eventStartMinute} < ${elementStartMinute}`
							)
							binaryEventInsertion(
								events,
								element,
								mid + 1,
								tail,
								length
							)
						}
					} else if (eventStartHour > elementStartHour) {
						console.log(
							`\teventStartHour\t> elementStartHour\t: ${eventStartHour} > ${elementStartHour}`
						)
						binaryEventInsertion(
							events,
							element,
							begin,
							mid - 1,
							length
						)
					} else {
						console.log(
							`\teventStartHour\t< elementStartHour\t: ${eventStartHour} < ${elementStartHour}`
						)
						binaryEventInsertion(
							events,
							element,
							mid + 1,
							tail,
							length
						)
					}
				} else if (eventStartDay > elementStartDay) {
					console.log(
						`\teventStartDay\t> elementStartDay\t: ${eventStartDay} > ${elementStartDay}`
					)
					binaryEventInsertion(
						events,
						element,
						begin,
						mid - 1,
						length
					)
				} else {
					console.log(
						`\teventStartDay\t< elementStartDay\t: ${eventStartDay} < ${elementStartDay}`
					)
					binaryEventInsertion(events, element, mid + 1, tail, length)
				}
			} else if (eventStartMonth > elementStartMonth) {
				console.log(
					`\teventStartMonth\t> elementStartMonth\t: ${eventStartMonth} > ${elementStartMonth}`
				)
				binaryEventInsertion(events, element, begin, mid - 1, length)
			} else {
				console.log(
					`\teventStartMonth\t< elementStartMonth\t: ${eventStartMonth} < ${elementStartMonth}`
				)
				binaryEventInsertion(events, element, mid + 1, tail, length)
			}
		} else if (eventStartYear > elementStartYear) {
			console.log(
				`\teventStartYear\t> elementStartYear\t: ${eventStartYear} > ${elementStartYear}`
			)
			binaryEventInsertion(events, element, begin, mid - 1, length)
		} else {
			console.log(
				`\teventStartYear\t< elementStartYear\t: ${eventStartYear} < ${elementStartYear}`
			)
			console.log(`\t\tRETURNED`)
			binaryEventInsertion(events, element, mid + 1, tail, length)
		}
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
	getDayEvents(startDate, endDate) {
		let events = []

		for (let i = 0; i < this.eventsLength; i++) {
			const event = this.events[i]
			const [ids, starts, ends, descriptions] = event.getDayEvents(
				startDate,
				endDate
			)
			if (ids && starts && ends) {
				// undefined checker
				for (let j = 0; j < ids.length; j++) {
					const eventObj = {
						summary: event.summary,
						id: ids[j],
						start: starts[j],
						end: ends[j],
						description: descriptions[j],
					}
					events.push(eventObj)
				}
			}
		}
		//sort
		// eg. 2021-03-24T19:23:28.132Z
		//insertion sort
		if (events) {
			console.log("<<<<<<<<<<<<>>>>>>>>>>>>")
			for (let i = 0; i < events.length; i++) {
				const event = events[i]
				console.log(`i : ${i}`)
				console.log(event)
			}
			for (let i = 1; i < events.length; i++) {
				const event = events[i]
				console.log(`event[${i}]:`)
				console.log(event)
				console.log(`event[${i + 1}]:`)
				console.log(events[i + 1])
				if (event) {
					binaryEventInsertion(events, event, 0, i - 1, i)
				}
				console.log(
					`<<<<<<<<<<<<<<<<<<<SORTED EVENTS>>>>>>>>>>>>>>>>>>>>`
				)
				for (let j = 0; j <= i; j++) {
					const event = events[j]
					console.log(`j : ${j}`)
					console.log(event.summary)
					console.log(event.id)
					console.log(event.start)
					console.log(event.end)
				}
				console.log(`<<<<<<<<<---------END SORTED-------->>>>>>>>>\n`)
			}
		}
		return events
	}
}
module.exports = { Calendar, Event }
