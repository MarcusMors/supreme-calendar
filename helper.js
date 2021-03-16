function authenticate() {
	return gapi.auth2
		.getAuthInstance()
		.signIn({
			scope:
				"https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events",
		})
		.then(
			function () {
				console.log("Sign-in successful")
			},
			function (err) {
				console.error("Error signing in", err)
			}
		)
}
function loadClient() {
	gapi.client.setApiKey("YOUR_API_KEY")
	return gapi.client
		.load(
			"https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest"
		)
		.then(
			function () {
				console.log("GAPI client loaded for API")
			},
			function (err) {
				console.error("Error loading GAPI client for API", err)
			}
		)
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
	return gapi.client.calendar.events
		.import({
			calendarId: "jose.vilca.campana@ucsp.edu.pe",
			conferenceDataVersion: 1,
			supportsAttachments: true,
			resource: {
				end: {
					dateTime: "2021-03-18T19:00:00-05:00",
				},
				iCalUID: "7271icgsli9agf9pvh3a2sd4io_20210318T214500Z",
				start: {
					dateTime: "2021-03-18T16:45:00-05:00",
				},
				summary: "Clase de TC",
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
}
gapi.load("client:auth2", function () {
	gapi.auth2.init({ client_id: "YOUR_CLIENT_ID" })
})
