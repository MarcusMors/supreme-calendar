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
let eventSummaries = []
let eventDescription = []

let wasLastEventOutside
let headingHome

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
		for (let i = 0; i < lowestPriority + 1; i++) {
			calendars[i] = []
		}
		console.log(`\ttotalCalendars : ${totalCalendars}`)
		console.log(`\tlowestPriority : ${lowestPriority}`)
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

		console.log(`\nChecking all events in all calendars\n`)
		for (let i = 0; i < +lowestPriority + 1; i++) {
			for (let j = 0; j < calendars[i].length; j++) {
				const cal = calendars[i][j]
				console.log(`calendars[${i}][${j}] : ${cal.summary}`)
				const listEvents = await calendar.events.list({
					calendarId: cal.id,
					timeMin: new Date().toISOString(),
					timeMax: futureDay(),
					maxResults: 10,
					singleEvents: true,
					orderBy: "startTime",
				})
				if (listEvents) {
					const events = listEvents.data.items
					if (events) {
						console.log(
							`\n\tUpcoming 10 events in [${i}][${j}] calendar:\n`
						)
						const eventsLength = cal.getEventsLength()
						for (let k = 0; k < events.length; k++) {
							const event = events[k]
							const start =
								event.start.dateTime || event.start.date
							if (start.length > 10) {
								const end = event.end.dateTime || event.end.date
								const id = event.id
								const summary = event.summary
								const description = event.description
								if (cal.getEventsLength() === 0) {
									cal.addNewEvent(
										summary,
										description,
										id,
										start,
										end
									)
								} else {
									const eventIndex = arrayIncludes(
										cal.events,
										summary
									)
									if (eventIndex !== -1) {
										calendar[i][j].addNewEvent(
											summary,
											description,
											id,
											start,
											end
										)
									} else {
										calendar[i][j].events[
											eventIndex
										].addData(id, start, end)
										if (
											calendar[i][j].events[eventIndex]
												.description === false &&
											description
										) {
											calendar[i][j].events[
												eventIndex
											].addDescription(description)
										}
									}
								}
								console.log(`${start} - ${end} | ${summary}`)
							}
						}
					} else {
						console.log("No upcoming events found.")
					}
				} else {
					console.log(`An error happened`)
				}
			}
			console.log(`\t\t<--  No more events in ${i} priority  -->`)
		}
		console.log(`Checking calendars and its events`)
		for (let i = 0; i < calendars.length; i++) {
			for (let j = 0; j < calendars[i].length; j++) {
				const cal = calendars[i][j]
				const eventsLength = cal.getEventsLength()
				for (let k = 0; k < eventsLength; k++) {
					const event = cal.events[k]
					console.log(`summary\t : ${event.summary}`)
					console.log(`description\t : ${event.description}`)
					for (let l = 0; l < event.length; l++) {
						const id = event.id[l]
						const start = event.start[l]
						const end = event.end[l]
						console.log(`${start} - ${end} \n ${id}`)
					}
				}
			}
		}
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
		console.log(`standardizing the descriptions and first check...`)
		await standardizeAndFirstCheck(auth)
		// console.log(`descriptions...`)
		// await listCalendars(auth)
	} catch (error) {
		console.error(error)
	}
}
