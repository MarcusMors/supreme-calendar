function futureDay(days = 14, withTime = false) {
	const today = new Date()
	if (withTime) {
		const futureDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + days,
			today.getHours(),
			today.getMinutes()
		).toISOString()
		return futureDay
	}
	const futureDay = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() + days
	).toISOString()
	return futureDay
}

function arrayIncludes(arr, wanted) {
	for (i = 0; i < arr.length; i++) {
		if (arr[i] === wanted) {
			return i
		}
	}
	return -1
}

function splitDate(date) {
	const year = date.slice(0, 4)
	const month = date.slice(5, 7)
	const day = date.slice(8, 10)
	const hour = date.slice(11, 13)
	const minute = date.slice(14, 16)
	return [year, month, day, hour, minute]
}

module.exports = { futureDay, arrayIncludes, splitDate }
