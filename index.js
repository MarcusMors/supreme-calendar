const { google } = require("googleapis")
const fs = require("fs")
const { request } = require("http")
const { Calendar, Event } = require("./calendar.js")
const { futureDay, arrayIncludes } = require("./functions.js")
const { authorize } = require("./gapiFunctions.js")
const { doCopyCalendarEvents } = require("./copyCalendarEvents.js")

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
	if (err) return console.log("Error loading client secret file:", err)
	// Authorize a client with credentials, then call the Google Calendar API.
	authorize(JSON.parse(content), copyExternalCalendars)
})

let calendars = []

let lowestPriority = -1
let totalCalendars = 0

let wasLastEventOutside
let headingHome

let descriptionCounters = []

const standardizeAndFirstCheck = async (auth) => {
	try {
		const calendar = google.calendar({ version: "v3", auth })
		/*********************************************
		 * Get Calendar Id's
		 *********************************************/
		console.log(`Getting Calendar Id's`)
		const calendarListResponse = await calendar.calendarList.list({})
		let itemIndexHolder = []

		console.log(`Data length : ${calendarListResponse.data.items.length}`)

		for (let i = 0; i < calendarListResponse.data.items.length; i++) {
			const element = calendarListResponse.data.items[i].summary.slice(-1)
			if (element > -1 && element < 9) {
				itemIndexHolder[totalCalendars] = i
				totalCalendars++
				if (element > lowestPriority) {
					lowestPriority = element
				}
			}
		}
		// Turning the array into a 2D Array
		for (let i = 0; i < lowestPriority + 1; i++) {
			calendars[i] = []
		}
		console.log(`\ttotalCalendars : ${totalCalendars}`)
		console.log(`\tlowestPriority : ${lowestPriority}`)

		/*********************************************
		 * Creating the Calendar Instances
		 *********************************************/
		for (let i = 0; i < totalCalendars; i++) {
			const indexHolder = itemIndexHolder[i]
			const calendarItem = calendarListResponse.data.items[indexHolder]
			for (let j = 0; j <= +lowestPriority; j++) {
				if (+calendarItem.summary.slice(-1) === j) {
					calendars[j].push(
						new Calendar(calendarItem.summary, calendarItem.id)
					)
				}
			}
		}
		console.log(`calendars:`)
		for (let i = 0; i <= +lowestPriority; i++) {
			for (let j = 0; j < calendars[i].length; j++) {
				console.log(
					`calendars[${i}][${j}] : ${calendars[i][j].summary}`
				)
			}
		}

		/*********************************************
		 * Creating Event instances in calendar instance
		 *********************************************/
		console.log(`\nChecking all events in all calendars\n`)
		for (let i = 0; i < +lowestPriority + 1; i++) {
			for (let j = 0; j < calendars[i].length; j++) {
				const cal = calendars[i][j]
				console.log(`calendars[${i}][${j}] : ${cal.summary}`)
				const listEventsResponse = await calendar.events.list({
					calendarId: cal.id,
					timeMin: new Date().toISOString(),
					timeMax: futureDay(),
					// maxResults: 10,
					singleEvents: true,
					orderBy: "startTime",
				})
				if (listEventsResponse) {
					const events = listEventsResponse.data.items

					if (events) {
						console.log(
							`\n\tUpcoming 10 events in [${i}][${j}] calendar:\n`
						)
						for (let k = 0; k < events.length; k++) {
							const event = events[k]
							const start =
								event.start.dateTime || event.start.date
							if (start.length > 10) {
								const end = event.end.dateTime || event.end.date
								const id = event.id
								const summary = event.summary
								const description = event.description
								const eventsLength = cal.getEventsLength()
								if (eventsLength === 0) {
									cal.addEvent(
										summary,
										description,
										id,
										start,
										end
									)
								} else {
									let summaries = new Array()
									for (let l = 0; l < eventsLength; l++) {
										summaries.push(cal.events[l].summary)
									}

									const eventIndex = arrayIncludes(
										summaries,
										summary
									)

									console.log(`eventIndex : ${eventIndex}`)

									if (+eventIndex === -1) {
										console.log(
											`inside if eventIndex : ${eventIndex}`
										)
										cal.addEvent(
											summary,
											description,
											id,
											start,
											end
										)
									} else {
										console.log(
											`else eventIndex : ${eventIndex}`
										)
										cal.events[eventIndex].addData(
											id,
											start,
											end,
											description
										)
										// description is now added and checked in addData
										// if (
										// 	cal.events[eventIndex]
										// 		.description === false &&
										// 	description
										// ) {
										// 	calendar[i][j].events[
										// 		eventIndex
										// 	].addDescription(description)
										// }
									}
								}
								console.log(`${start} - ${end} | ${summary}`)
							}
						}
						descriptionCounters = []
					} else {
						console.log("No upcoming events found.")
					}
				} else {
					console.log(`An error happened`)
				}
			}
			console.log(`\t\t<--  No more events in ${i} priority  -->`)
		}

		//making sure the data structure is filled
		console.log(`\n\nChecking calendars and its events\n`)
		for (let i = 0; i < calendars.length; i++) {
			for (let j = 0; j < calendars[i].length; j++) {
				const cal = calendars[i][j]
				const eventsLength = cal.getEventsLength()
				console.log(`\ncalendar summary : ${cal.summary}`)
				let hasDescriptions = false
				for (let k = 0; k < eventsLength; k++) {
					const event = cal.events[k]
					const descriptions = event.descriptions
					let atLeastOneDescription = false
					for (let l = 0; l < descriptions.length; l++) {
						const description = descriptions[l]
						if (Object.entries(description).length > 0) {
							atLeastOneDescription = true
						}
					}
					descriptions
						? (hasDescriptions = true)
						: (hasDescriptions = false)
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
						// for (let l = 0; l < event.description.length; l++) {
						// 	const element = event.description[l]
						// 	console.log(`\t\t${element}`)
						// }
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
		}

		/*********************************************
		 * Standardize the event descriptions
		 *********************************************/

		// console.log(`\n\nStandardize the event descriptions\n`)

		// for (let i = 0; i < calendars.length; i++) {
		// 	for (let j = 0; j < calendars[i].length; j++) {
		// 		const cal = calendars[i][j]
		// 		const eventsLength = cal.getEventsLength()
		// 		let hasDescription = false
		// 		for (let k = 0; k < eventsLength; k++) {
		// 			hasDescription = true
		// 			const event = cal.events[k]
		// 			for (let l = 0; l < event.length; l++) {
		// 				const id = event.id[l]
		// 				const start = event.start[l]
		// 				const end = event.end[l]
		// 				console.log(`${start} - ${end} \n ${id}`)
		// 			}
		// 		}
		// 	}
		// }
	} catch (error) {
		console.error(error)
	}
}

const listCalendars = async (auth) => {
	try {
		const calendar = google.calendar({ version: "v3", auth })
		console.log(`\n\tcalendars :\n`)
	} catch (error) {
		console.error(error)
	}
}

async function copyExternalCalendars(auth) {
	try {
		// console.log(`Copying external calendars...`)
		// await doCopyCalendarEvents(auth)
		// what to do if an event of the original calendar changes, is deleted, or a new one is added?
		console.log(`standardizing the descriptions and first check...`)
		await standardizeAndFirstCheck(auth)
		// console.log(`descriptions...`)
		// await listCalendars(auth)
	} catch (error) {
		console.error(error)
	}
}
