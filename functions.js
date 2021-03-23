function futureDay(days = 14, withTime = false) {
	const today = new Date()
	if (withTime) {
		const futureDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() + days,
			today.getHours(),
			today.getMinutes()
		)
		return futureDay
	}
	const futureDay = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() + days
	)
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

module.exports = { futureDay, arrayIncludes }
