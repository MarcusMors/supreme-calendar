const fs = require("fs")
const readline = require("readline")
const { google } = require("googleapis")
let lowestPriority = -1
let totalCalendars = 0
let calendarsId = []
let wasLastEventOutside
let headingHome
// If modifying these scopes, delete token.json.
const SCOPES = [
	"https://www.googleapis.com/auth/calendar.addons.current.event.write",
]
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json"

// Load client secrets from a local file.
fs.readFile("credentials.json", (err, content) => {
	if (err) return console.log("Error loading client secret file:", err)
	// Authorize a client with credentials, then call the Google Calendar API.
	authorize(JSON.parse(content), listCalendars)
	authorize(JSON.parse(content), listEvents)
})

/**
 * given callback function
	*               function(err) { console.error("Execute error", err); )

	* @param {Object} credentials The authorization client credentials.
	* @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	const { client_secret, client_id, redirect_uris } = credentials.installed
	const oAuth2Client = new google.auth.OAuth2(
		client_id,
		client_secret,
		redirect_uris[0]
	)

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getAccessToken(oAuth2Client, callback)
		oAuth2Client.setCredentials(JSON.parse(token))
		callback(oAuth2Client)
	})
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
	})
	console.log("Authorize this app by visiting this url:", authUrl)
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})
	rl.question("Enter the code from that page here: ", (code) => {
		rl.close()
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error("Error retrieving access token", err)
			oAuth2Client.setCredentials(token)
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err)
				console.log("Token stored to", TOKEN_PATH)
			})
			callback(oAuth2Client)
		})
	})
}
/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

function listCalendars(auth) {
	console.log("listEventsOriginal...")
	const calendar = google.calendar({ version: "v3", auth })
	calendar.calendarList.list({}).then(
		function (response) {
			let itemIndexHolder = []

			console.log("Data:\n", response.data)
			console.log(`Data length : ${response.data.items.length}`)

			for (let i = 0; i < response.data.items.length; i++) {
				const element = response.data.items[i].summary.slice(-1)
				if (element > -1 && element < 10) {
					itemIndexHolder[totalCalendars] = i
					totalCalendars++
					if (element > lowestPriority) {
						lowestPriority = element
					}
				}
			}
			for (let i = 0; i < lowestPriority + 1; i++) {
				calendarsId[i] = []
			}
			console.log(`totalCalendars : ${totalCalendars}`)
			console.log(`lowestPriority : ${lowestPriority}`)
			for (let i = 0; i < totalCalendars; i++) {
				const indexHolder = itemIndexHolder[i]
				for (let j = 0; j < +lowestPriority + 1; j++) {
					if (
						+response.data.items[indexHolder].summary.slice(-1) ===
						j
					) {
						calendarsId[j].push(response.data.items[indexHolder].id)
					}
				}
			}

			console.log(`calendarsId`)

			for (let i = 0; i < +lowestPriority + 1; i++) {
				console.log(`[${i}]:`)
				for (let j = 0; j < calendarsId[i].length; j++) {
					console.log(
						`calendarsId[${i}][${j}] : ${calendarsId[i][j]}`
					)
				}
			}
			console.log(`\ncheck #9 events \n`)
			if (+lowestPriority === 9) {
				for (let i = 0; i < calendarsId[9].length; i++) {
					const originalCalendarId = calendarsId[9][i]
					calendar.events.list(
						{
							calendarId: calendarsId[9][i],
							timeMin: new Date().toISOString(),
							// timeMax: new Date().toISOString(),
							maxResults: 16,
							singleEvents: true,
							orderBy: "startTime",
						},
						(err, res) => {
							if (err)
								return console.log(
									"The API returned an error: " + err
								)
							const events = res.data.items
							if (events.length) {
								console.log("Upcoming 10 events:")
								events.map((event, i) => {
									const start =
										event.start.dateTime || event.start.date
									const end =
										event.end.dateTime || event.end.date
									console.log(
										`#9\t${start} - ${end} | ${event.summary}\n${event.id}`
									)
								})
							} else {
								console.log("No upcoming events found.")
							}
						}
					)
					//!
					calendar.events
						.import({
							calendarId: "jose.vilca.campana@ucsp.edu.pe",
							conferenceDataVersion: 1,
							supportsAttachments: true,
							resource: {
								end: {
									dateTime: "2021-03-18T19:00:00-05:00",
								},
								iCalUID:
									"7271icgsli9agf9pvh3a2sd4io_20210318T214500Z",
								start: {
									dateTime: "2021-03-18T16:45:00-05:00",
								},
								summary: "this is a summary example",
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
					// }
					// gapi.load("client:auth2", function() {
					//   gapi.auth2.init({client_id: "YOUR_CLIENT_ID"});
					// });
					//!
				}
			}
			console.log(`check all events`)
			for (let i = 0; i < +lowestPriority + 1; i++) {
				for (let j = 0; j < calendarsId[i].length; j++) {
					console.log(
						`calendarsId[${i}][${j}] : ${calendarsId[i][j]}`
					)
					calendar.events.list(
						{
							calendarId: calendarsId[i][j],
							timeMin: new Date().toISOString(),
							maxResults: 10,
							singleEvents: true,
							orderBy: "startTime",
						},
						(err, res) => {
							if (err)
								return console.log(
									"The API returned an error: " + err
								)
							const events = res.data.items
							if (events.length) {
								console.log("Upcoming 10 events:")
								events.map((event, i) => {
									const start =
										event.start.dateTime || event.start.date
									const end =
										event.end.dateTime || event.end.date
									console.log(
										`${start} - ${end} | ${event.summary}\n${event.id}`
									)
								})
							} else {
								console.log("No upcoming events found.")
							}
						}
					)
				}
				console.log(`\t\t<--No more events in ${i} priority-->`)
			}
		},
		function (err) {
			console.error("Execute error", err)
		}
	)
}

function listEvents(auth) {
	console.log("listEvents...")
	const calendar = google.calendar({ version: "v3", auth })
	calendar.events.list(
		{
			calendarId: "primary",
			timeMin: new Date().toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: "startTime",
		},
		(err, res) => {
			if (err) return console.log("The API returned an error: " + err)
			const events = res.data.items
			if (events.length) {
				console.log("Upcoming 10 events:")
				events.map((event, i) => {
					const start = event.start.dateTime || event.start.date
					console.log(`${start} - ${event.summary}`)
				})
			} else {
				console.log("No upcoming events found.")
			}
		}
	)
}
