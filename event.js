const { splitDate } = require("./functions")

class Event {
	constructor(summary) {
		this.summary = summary
		this.hasData = false
		this.ids = []
		this.starts = []
		this.ends = []
		this.descriptions = []
	}

	refineDescription(description) {
		description = description.replace(/<\/span>/g, "")
		description = description.replace(/<span>/g, "")
		description = description.replace(/ /g, "")
		description = description.toLowerCase()
		description = description.split("<br>")
		let descriptionObj = new Object()
		for (let i = 0; i < description.length; i++) {
			const property = description[i]
			const colon = property.indexOf(":")
			if (colon === -1) {
				descriptionObj[property] = true
			} else {
				const key = property.slice(0, colon)
				const value = property.slice(colon + 1, property.length)
				descriptionObj[key] = value
			}
		}
		return descriptionObj
	}

	getLength() {
		if (this.hasData) {
			return this.ids.length
		} else {
			return 0
		}
	}

	addData(id, start, end, description = "") {
		this.ids.push(id)
		this.starts.push(start)
		this.ends.push(end)
		this.hasData = true
		let refinedDescription = this.refineDescription(description)
		if (description) {
			this.descriptions.push(refinedDescription)
		} else {
			this.descriptions.push({})
		}
	}
	sliceData(start, end) {
		let ids = this.ids.slice(start, end)
		let starts = this.starts.slice(start, end)
		let ends = this.ends.slice(start, end)
		let descriptions = this.descriptions.slice(start, end)
		return [ids, starts, ends, descriptions]
	}

	getDayEvents(startDate, endDate) {
		let begin = -1
		let tail = -1
		const length = this.getLength()
		// const [
		// 	startDateYear,
		// 	startDateMonth,
		// 	startDateDay,
		// 	startDateHour,
		// 	startDateMinute,
		// ] = splitDate(startDate)
		// const [
		// 	endDateYear,
		// 	endDateMonth,
		// 	endDateDay,
		// 	endDateHour,
		// 	endDateMinute,
		// ] = splitDate(endDate)
		// console.log(`length: ${length}`)
		for (let i = 0; i < length; i++) {
			const eventStart = this.starts[i]
			// const [
			// 	eventYear,
			// 	eventMonth,
			// 	eventDay,
			// 	eventHour,
			// 	eventMinute,
			// ] = splitDate(eventStart)
			// console.log(eventStart)
			if (startDate < eventStart && eventStart < endDate) {
				if (begin === -1) {
					begin = i
				}
				tail = i
			}
		}
		// console.log(`begin: ${begin}`)
		// console.log(`tail: ${tail}`)
		if (begin !== -1 || tail !== -1) {
			let [ids, starts, ends, descriptions] = this.sliceData(
				begin,
				tail + 1
			)
			return [ids, starts, ends, descriptions]
		} else {
			return [false, false, false, false]
		}
	}
}

module.exports = { Event }
