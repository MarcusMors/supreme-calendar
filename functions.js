function futureDay(days = 14) {
	const today = new Date()
	const futureDay = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() + days
	)
	return futureDay
}
module.exports = { futureDay }
