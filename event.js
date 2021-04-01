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

	getDayEvents(date) {
		let begin = -1
		let tail = -1
		let hasBegin = false
		const length = this.getLength()
		const [dateYear, dateMonth, dateDay, dateHour, dateMinute] = splitDate(
			date
		)
		for (let i = 0; i < length; i++) {
			const start = this.starts[i]
			const [
				startYear,
				startMonth,
				startDay,
				startHour,
				startMinute,
			] = splitDate(start)
			// console.log(`date : ${date}\nstart : ${startDay}`)
			if (dateYear <= startYear) {
				if (dateMonth <= startMonth) {
					if (dateDay <= startDay) {
						if (dateHour <= startHour) {
							if (startMinute <= startMinute) {
								if (!hasBegin) {
									begin = 0
									hasBegin = true
								}
							} else if (!hasBegin) {
								begin = 0
								hasBegin = true
							}
						} else if (!hasBegin) {
							begin = 0
							hasBegin = true
						}
					} else if (!hasBegin) {
						begin = 0
						hasBegin = true
					}
				} else if (!hasBegin) {
					begin = 0
					hasBegin = true
				}
			} else {
				tail = i
			}
		}
		if (begin !== -1 || tail !== -1) {
			let [ids, starts, ends, descriptions] = this.sliceData(begin, tail)
			return [ids, starts, ends, descriptions]
		} else {
			return [false, false, false, false]
		}
	}

	getDayEventsByPeriod(start, end, sortByStart = true) {
		let dayEvents = []
		if (sortByStart) {
			//
		}
	}
}

module.exports = { Event }
