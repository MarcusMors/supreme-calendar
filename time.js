let today = new Date()
let dd = String(today.getDate()).padStart(2, "0")
let mm = String(today.getMonth() + 1).padStart(2, "0") //January is 0!
let yyyy = today.getFullYear()
let todayHours = today.getHours()
let todayMinutes = today.getMinutes()
// (1:01) = 1,1

function nextWeek() {
	var today = new Date()
	var nextWeek = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() + 7
	)
	return nextWeek
}
function next2Week() {
	const today = new Date()
	const next2Week = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() + 14
	)
	return next2Week
}
function next3Week() {
	const today = new Date()
	const next3Week = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() + 21
	)
	return next3Week
}

today = mm + "/" + dd + "/" + yyyy
console.log(today)
console.log(todayHours)
console.log(todayMinutes)
console.log(new Date().toISOString())
console.log(nextWeek())
console.log(next2Week())
console.log(next3Week())
// calendar.events.move()
