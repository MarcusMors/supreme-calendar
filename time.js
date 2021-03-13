let today = new Date()
let dd = String(today.getDate()).padStart(2, "0")
let mm = String(today.getMonth() + 1).padStart(2, "0") //January is 0!
let yyyy = today.getFullYear()
let todayHours = today.getHours()
let todayMinutes = today.getMinutes()
// (1:01) = 1,1
today = mm + "/" + dd + "/" + yyyy
console.log(today)
console.log(todayHours)
console.log(todayMinutes)

calendar.events
	.import({
		calendarId: originalCalendarId,
		conferenceDataVersion: 1,
		supportsAttachments: true,
		resource: {
			end: {
				dateTime: end,
			},
			iCalUID: event.id,
			start: {
				dateTime: start,
			},
			summary: event.summary,
		},
	})
	.then(
		function (response) {
			// Handle the results here (response.result has the parsed body).
			console.log("Response", response)
		},
		function (err) {
			console.error("Execute error", err)
		}
	)
// calendar.events.move()
