const { google } = require("googleapis")
const fs = require("fs")
const { request } = require("http")
const { Calendar } = require("./calendar.js")
const { futureDay, arrayIncludes } = require("./functions.js")
const { authorize } = require("./gapiFunctions.js")
const { doCopyCalendarEvents } = require("./copyCalendarEvents.js")
// let csv = require("csv")
// master, main, core,
// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
	if (err) return console.log("Error loading client secret file:", err)
	// Authorize a client with credentials, then call the Google Calendar API.
	authorize(JSON.parse(content), main)
})
const DATA_PATH = "data.json"

function setData(callback, auth) {
	console.log("setData")
	let data = getData(auth)
	fs.writeFile(DATA_PATH, JSON.stringify(data), (err) => {
		if (err) return console.error(err)
		console.log("data stored to", DATA_PATH)
	})
	callback(data)
}

let wasLastEventOutside
let headingHome

const getData = async (auth) => {
	try {
		// calendars is the main variable
		let calendars = {}
		let lowestPriority = -1
		let totalCalendars = 0
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
			calendars[i] = {}
		}
		console.log(`\ttotalCalendars : ${totalCalendars}`)
		console.log(`\tlowestPriority : ${lowestPriority}`)

		/*********************************************
		 * Creating the Calendar Instances
		 *********************************************/
		for (let i = 0; i < totalCalendars; i++) {
			const indexHolder = itemIndexHolder[i]
			const calendarItem = calendarListResponse.data.items[indexHolder]
			let aux = 0
			for (let j = 0; j <= +lowestPriority; j++) {
				if (+calendarItem.summary.slice(-1) === j) {
					calendars[j][aux] = new Calendar(
						calendarItem.summary,
						calendarItem.id
					)
					// calendars[j].push(
					// 	new Calendar(calendarItem.summary, calendarItem.id)
					// )
					aux++
				}
			}
		}
		// checking the calendar instances
		// console.log(`calendars:`)
		// for (let i = 0; i <= +lowestPriority; i++) {
		// 	for (let j = 0; j < calendars[i].length; j++) {
		// 		console.log(
		// 			`calendars[${i}][${j}] : ${calendars[i][j].summary}`
		// 		)
		// 	}
		// }

		/*********************************************
		 * Creating Event instances in calendar instance
		 *********************************************/
		console.log(`\nChecking all events in all calendars\n`)
		for (let i = 0; i < +lowestPriority + 1; i++) {
			const calendarsLength = Object.keys(calendars[i]).length
			for (let j = 0; j < calendarsLength; j++) {
				// for (let j = 0; j < calendars[i].length; j++) {
				const cal = calendars[i][j]
				// const cal = calendars[i][j]
				// console.log(`calendars[${i}][${j}] : ${cal.summary}`)
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
						// console.log(
						// 	`\n\tUpcoming 10 events in [${i}][${j}] calendar:\n`
						// )
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

									// console.log(`eventIndex : ${eventIndex}`)

									if (+eventIndex === -1) {
										// console.log(
										// 	`inside if eventIndex : ${eventIndex}`
										// )
										cal.addEvent(
											summary,
											description,
											id,
											start,
											end
										)
									} else {
										// console.log(
										// 	`else eventIndex : ${eventIndex}`
										// )
										cal.events[eventIndex].addData(
											id,
											start,
											end,
											description
										)
									}
								}
								// console.log(`${start} - ${end} | ${summary}`)
							}
						}
						// descriptionCounters = [] // useless? perhaps yes
						// } else {
						// console.log("No upcoming events found.")
					}
					// } else {
					// console.log(`An error happened`)
				}
			}
			// console.log(`\t\t<--  No more events in ${i} priority  -->`)
		}

		//making sure the data structure is filled
		console.log(`\n\nChecking calendars and its events\n`)
		for (let i = 0; i < +lowestPriority + 1; i++) {
			const calendarsLength = Object.keys(calendars[i]).length
			for (let j = 0; j < calendarsLength; j++) {
				// for (let j = 0; j < calendars[i].length; j++) {
				const cal = calendars[i][j]
				cal.print()
			}
		}
		return calendars
	} catch (error) {
		console.error(error)
	}
}

let dayEvents = []

function mainProcess(calendars, days = 14) {
	// turn dayEvents into a 2D array
	for (let i = 0; i < calendars.length; i++) {
		dayEvents[i] = []
	}
	/*********************************************
	 * Getting a specific day events
	 *********************************************/
	//get today events, from now until the end of the day
	const length = Object.keys(calendars).length
	for (let i = 0; i < length; i++) {
		let calendarsLength = Object.keys(calendars[i]).length
		// for (let i = 0; i < calendars.length; i++) {
		for (let j = 0; j < calendarsLength; j++) {
			const cal = calendars[i][j]
			const startDate = futureDay(0)
			const endDate = futureDay(1, false)
			dayEvents[i][j] = cal.getDayEvents(startDate, endDate)
		}
	}
	//checking the content
	console.log(`checking event starts`)
	for (let i = 0; i < dayEvents.length; i++) {
		for (let j = 0; j < dayEvents[i].length; j++) {
			const events = dayEvents[i][j]
			const cal = calendars[i][j]
			console.log(`calendar : ${cal.summary}`)
			for (let k = 0; k < events.length; k++) {
				const event = events[k]
				console.log(`\tevent.start : ${event.start}`)
			}
		}
	}
	/*********************************************
	 * First Check
	 *********************************************/

	/*********************************************
	 * Second Check
	 *********************************************/

	/*********************************************
	 * Third Check
	 *********************************************/

	//the events of the next two weeks
	// for (let i = 1; i < days; i++) {
	// 	for (let j = 0; j < calendars.length; j++) {
	// 		for (let k = 0; k < calendars[j].length; k++) {
	// 			const cal = calendars[j][k]
	// 			const startDate = futureDay(i, false)
	// 			const endDate = futureDay(i + 1, false)
	// 			dayEvents[j][k] = cal.getDayEvents(startDate, endDate)
	// 		}
	// 	}
	// 	// reorder and etc
	// }
}

async function main(auth) {
	try {
		// console.log(`Copying external calendars...`)
		// await doCopyCalendarEvents(auth)
		// what to do if an event of the original calendar changes, is deleted, or a new one is added?
		// console.log(`standardizing the descriptions and first check...`)

		/*********************************************
		 * Save data to speed up the debugging process and to sell it later <3
		 *********************************************/
		fs.readFile(DATA_PATH, "utf-8", (err, data) => {
			if (err) return setData(mainProcess, auth)
			console.log("readFile")
			let calendars = JSON.parse(data)
			mainProcess(calendars)
		})
	} catch (error) {
		console.error(error)
	}
}
