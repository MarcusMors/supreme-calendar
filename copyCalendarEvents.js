const { google } = require("googleapis")
const { futureDay } = require("./functions.js")

let externalCalendarsId = []
let externalCalendarsSummary = []
let externalCalendarsCounter = 0
let externalCalendarEventsId = []
let externalCalendarEventsSummary = []
let externalCalendarEventsStart = []
let externalCalendarEventsEnd = []
let importedEventsId = []
let copyCalendarsId = []
let copyCalendarsSummary = []

const doCopyCalendarEvents = async (auth) => {
	try {
		const calendar = google.calendar({ version: "v3", auth })
		/*********************************************
		 * Import the events of the external calendars
		 *********************************************/
		console.log(`\tSearching External Calendars...`)
		const calendarListResponse = await calendar.calendarList.list({})
		for (let i = 0; i < calendarListResponse.data.items.length; i++) {
			const calendarItem = calendarListResponse.data.items[i]
			const endLetter = calendarItem.summary.slice(-1)
			console.log(`\t\tendLetter : ${endLetter}`)
			if (+endLetter === 9) {
				const summaryLength = calendarItem.summary.length
				console.log(`\t\t#9 calendar found`)
				externalCalendarsId[externalCalendarsCounter] = calendarItem.id
				externalCalendarsSummary.push(
					calendarItem.summary.slice(0, +summaryLength - 2)
				)
				externalCalendarsCounter++
			} else {
				const isTheCopy = calendarItem.summary.includes("copy")
				if (isTheCopy) {
					const summaryLength = calendarItem.summary.length
					copyCalendarsId.push(calendarItem.id)
					copyCalendarsSummary.push(
						calendarItem.summary.slice(0, +summaryLength - 2)
					)
				}
			}
		}
		console.log(
			`\t\texternalCalendarsCounter : ${externalCalendarsCounter}`
		)
		for (let i = 0; i < externalCalendarsCounter; i++) {
			console.log(
				`\t\texternalCalendarsId[${i}] : ${externalCalendarsId[i]}`
			)
			externalCalendarEventsId[i] = []
			externalCalendarEventsSummary[i] = []
			externalCalendarEventsStart[i] = []
			externalCalendarEventsEnd[i] = []
			importedEventsId[i] = []
		}
		console.log(`\tListing external calendar events...`)
		console.log(
			`\t\texternalCalendarsCounter : ${externalCalendarsCounter}`
		)
		for (let i = 0; i < externalCalendarsCounter; i++) {
			const externalCalendarId = externalCalendarsId[i]

			const externalCalendarEventsResponse = await calendar.events.list({
				calendarId: externalCalendarId,
				timeMin: new Date().toISOString(),
				timeMax: futureDay(),
				maxResults: 2,
				singleEvents: true,
				orderBy: "startTime",
			})
			/*********************************************
			 * Import the events of the external calendars
			 *********************************************/
			if (externalCalendarEventsResponse) {
				const events = externalCalendarEventsResponse.data.items
				if (events.length) {
					console.log("\t\tUpcoming 6 events:")
					events.map((event, j) => {
						const start = event.start.dateTime || event.start.date
						const end = event.end.dateTime || event.end.date
						const id = event.id
						const summary = event.summary
						console.log(`\t\t${start} - ${end} | ${event.summary}`)
						if (start.length > 10) {
							/**	//TODO:
							 * Filter the events that long more than a day and start or ends in a specific hour
							 */
							externalCalendarEventsId[i].push(id)
							console.log(
								`\t\t\texternalCalendarEventsId[${i}][${j}] : ${externalCalendarEventsId[i][j]}`
							)
							externalCalendarEventsSummary[i].push(summary)
							console.log(
								`\t\t\texternalCalendarEventsSummary[${i}][${j}] : ${externalCalendarEventsSummary[i]}`
							)
							externalCalendarEventsStart[i].push(start)
							console.log(
								`\t\t\texternalCalendarEventsSummary[${i}][${j}] : ${externalCalendarEventsSummary[i]}`
							)
							externalCalendarEventsEnd[i].push(end)
							console.log(
								`\t\t\texternalCalendarEventsSummary[${i}][${j}] : ${externalCalendarEventsSummary[i]}`
							)
						} else {
							console.log(
								`This event longs more the whole day or more`
							)
						}
					})
					console.log(`\tChecking the arrays`)
					for (
						let j = 0;
						j < externalCalendarEventsId[i].length;
						j++
					) {
						console.log(
							`\t\texternalCalendarEventsId[${i}][${j}] : ${externalCalendarEventsId[i][j]}\n\t\texternalCalendarEventsSummary[${i}][${j}] : ${externalCalendarEventsSummary[i][j]}\n\t\texternalCalendarEventsStart[${i}][${j}] : ${externalCalendarEventsStart[i][j]}\n\t\texternalCalendarEventsEnd[${i}][${j}] : ${externalCalendarEventsEnd[i][j]}\n`
						)
					}
				} else {
					console.log(`No events Found`)
				}
			} else {
				console.log(
					`There was an error while listing that calendar events`
				)
			}
		}
		console.log(
			`\t\texternalCalendarEventsId[0].length : ${externalCalendarEventsId[0].length}`
		)
		console.log(`\tImporting events`)
		/*********************************************
		 * Import the events of the external calendars
		 *********************************************/
		for (let i = 0; i < externalCalendarsCounter; i++) {
			console.log(
				`\t\texternalCalendarsId[${i}] : ${externalCalendarsId[i]}`
			)
			console.log(
				`\t\texternalCalendarEventsId[${i}].length : ${externalCalendarEventsId[i].length}\n`
			)
			for (let j = 0; j < externalCalendarEventsId[i].length; j++) {
				console.log(
					`\t\texternalCalendarEventsSummary[${i}][${j}] : ${externalCalendarEventsSummary[i][j]}\n\t\texternalCalendarEventsStart[${i}][${j}] : ${externalCalendarEventsStart[i][j]}\n\t\texternalCalendarEventsEnd[${i}][${j}] : ${externalCalendarEventsEnd[i][j]}\n\t\texternalCalendarEventsId[${i}][${j}] : ${externalCalendarEventsId[i][j]}`
				)
				console.log(
					`\n{\n\tcalendarId: ${externalCalendarsId[i]},\n\tconferenceDataVersion: 1,\n\tsupportsAttachments: true,\n\tresource: {\n\t\tend: {\n\t\t\tdateTime: ${externalCalendarEventsEnd[i][j]},\n\t\t},\n\t\tiCalUID: ${externalCalendarEventsId[i][j]},\n\t\tstart: {\n\t\t\tdateTime: ${externalCalendarEventsStart[i][j]},\n\t\t},\n\t\tsummary: ${externalCalendarEventsSummary[i][j]},\n}\n,`
				)
				const calendarEventImportResponse = await calendar.events.import(
					{
						calendarId: `${externalCalendarsId[i]}`,
						conferenceDataVersion: 1,
						supportsAttachments: true,
						resource: {
							end: {
								dateTime: `${externalCalendarEventsEnd[i][j]}`,
							},
							iCalUID: `${externalCalendarEventsId[i][j]}`,
							start: {
								dateTime: `${externalCalendarEventsStart[i][j]}`,
							},
							summary: `${externalCalendarEventsSummary[i][j]}`,
						},
					}
				)
				importedEventsId[i].push(calendarEventImportResponse.data.id)
			}
		}
		/*********************************************
		 * Move the new events to the copy calendar
		 *********************************************/
		let copyCalendarId
		for (let i = 0; i < externalCalendarsCounter; i++) {
			for (let k = 0; k < copyCalendarsId.length; k++) {
				const isTheCopy = copyCalendarsSummary[k].includes(
					externalCalendarsSummary[i]
				)
				if (isTheCopy) {
					copyCalendarId = copyCalendarsId[k]
					console.log(
						`${copyCalendarsSummary[k]} includes ${externalCalendarsSummary[i]}\ncopyCalendarId:${copyCalendarId}`
					)
					break
				}
			}
			for (let j = 0; j < importedEventsId[i].length; j++) {
				const moveExternalCalendarToCopy = await calendar.events.move({
					calendarId: `${externalCalendarsId[i]}`,
					eventId: `${importedEventsId[i][j]}`,
					destination: `${copyCalendarId}`,
				})
				if (moveExternalCalendarToCopy) {
					console.log("Response", moveExternalCalendarToCopy)
				} else {
					console.error("Move error")
				}
			}
		}
	} catch (error) {
		console.error(error)
	}
}

module.exports = {
	doCopyCalendarEvents,
}
