const Lists = require('../utils/TermLists')

class CreateJobs {
	job = {}
  jobsArray = []
	jobsData = {
		languages: {}, 
		frameworks: {}, 
		backend: {}, 
		frontend: {},
		sqlNoSql: {},
		security: {},
		testing: {},
		cloudTerms: {},
		softwareDevProcesses: {},
		versionControl: {},
		operatingSys: {},
		other: {},
		termCounts: {},
	};

	terms = [Lists.languages, Lists.frameworks, Lists.sqlNoSql, Lists.cloudTerms, Lists.operatingSys, Lists.versionControl, Lists.security, Lists.frontend, Lists.backend, Lists.testing, Lists.softwareDevProcesses, Lists.other]

	constructor(brows, page) {
		this.page = page
		this.brows = brows
		return this
	}

	async createJobObj(listing) {
		const jobText = await listing.getProperty('textContent').then(x => x.jsonValue()).catch(() => console.log('jobText unsuccessfull'))
		this.createSalary(jobText)
		await this.page.waitForSelector(".jobDescriptionContent").then(() => null).catch(() => console.log('jobDescriptionContent selector did not appear'))
		const text = await this.page.$eval('.jobDescriptionContent', (jobDesc) => {
			return jobDesc.textContent;
		}).then((jobDesc) => jobDesc).catch(() => console.log('jobDescriptionContent was not returned'))
		try {
			const lowerCaseText = text.toLowerCase()
			// place terms in an array called terms and for loop through it to length and then sub arrays to length keep logic
			this.terms.forEach(termArr => {
				termArr.forEach(term => {
					if (lowerCaseText.match(term)) {
						this.job[term] = lowerCaseText.match(term).length
					}
				})
			})
		} catch(e) {
			console.log("creating job object failed " + e)
		}
		this.jobsArray.push(this.job);
		this.job = {}
	}

	createSalary(jobText) {
		const sals = jobText.match(/(?<=\$)\d+(?=K).+(?<=\$)\d+(?=K)/)
		this.job.title = jobText
		if (sals) {
			const splitSals = sals[0].split('K - $')
			const minSal = splitSals[0];
			const maxSal = splitSals[1];
			this.job.minSal = Number(minSal);
			this.job.maxSal = Number(maxSal);
		}
	}

	// this is the averages and counts for everything in the this.jobsArray 
	createMainObj() {
		const salaryInfo = {}
		const seenTitles = {}
		let max = 0
		let min = 100000000
		let maxAvg = 0 
		let minAvg = 0 
		let duplicates = 0
		let len = this.jobsArray.length
		for (let i=0; i<len; i++) {
			const listing = this.jobsArray[i]
			if (seenTitles[listing.title]) {
				duplicates++
				continue
			} else {
				seenTitles[listing.title] = true
			}
			const keys = Object.keys(listing);
			keys.forEach(key => {
				if (key === "minSal" || key === "maxSal" ) {
					if (key === "maxSal" && listing[key] > max) {
						max = listing[key]
					} else if (key === "minSal" && listing[key] < min) {
						min = listing[key]
					}
					key === "maxSal" ? maxAvg += listing[key] : minAvg += listing[key]
				} else {
					this.jobsData.termCounts[key] = this.jobsData.termCounts[key] || 0;
					this.jobsData.termCounts[key] += 1;
					this.sortIntoSubObjects(this.jobsData, key)
				}
			})
		}
		salaryInfo.max = max
		salaryInfo.min = min
		salaryInfo.maxAvg = maxAvg/(900-duplicates)
		salaryInfo.minAvg = minAvg/(900-duplicates)
		const sorted = this.sortMain(this.jobsData);
		sorted.salaryInfo = salaryInfo
		this.jobsData = sorted
		this.jobsData.duplicates = duplicates
		this.jobsData.jobsSearched = this.jobsArray.length
		return this.jobsData
	}

	sortIntoSubObjects(main, key) {
		if (Lists.languages.includes(key)) {
			main.languages[key] = main.languages[key] || 0
			main.languages[key] += 1
		}	else if (Lists.frameworks.includes(key)) {
			main.frameworks[key] = main.frameworks[key] || 0
			main.frameworks[key] += 1
		} else if (Lists.backend.includes(key)) {
			main.backend[key] = main.backend[key] || 0
			main.backend[key] += 1
		} else if (Lists.frontend.includes(key)) {
			main.frontend[key] = main.frontend[key] || 0
			main.frontend[key] += 1
		} else if (Lists.sqlNoSql.includes(key)) {
			main.sqlNoSql[key] = main.sqlNoSql[key] || 0
			main.sqlNoSql[key] += 1
		} else if (Lists.security.includes(key)) {
			main.security[key] = main.security[key] || 0
			main.security[key] += 1
		} else if (Lists.testing.includes(key)) {
			main.testing[key] = main.testing[key] || 0
			main.testing[key] += 1
		} else if (Lists.cloudTerms.includes(key)) {
			main.cloudTerms[key] = main.cloudTerms[key] || 0
			main.cloudTerms[key] += 1
		} else if (Lists.softwareDevProcesses.includes(key)) {
			main.softwareDevProcesses[key] = main.softwareDevProcesses[key] || 0
			main.softwareDevProcesses[key] += 1
		} else if (Lists.versionControl.includes(key)) {
			main.versionControl[key] = main.versionControl[key] || 0
			main.versionControl[key] += 1
		} else if (Lists.operatingSys.includes(key)) {
			main.operatingSys[key] = main.operatingSys[key] || 0
			main.operatingSys[key] += 1
		} else if (Lists.other.includes(key)) {
			main.other[key] = main.other[key] || 0
			main.other[key] += 1
		}
	}

	sortMain(main) {
		const sorted = {}
		const keys = Object.keys(main)
		const sortedKeys = keys.sort((a, b) => main[b] - main[a])
		sortedKeys.forEach(key => {
			if (typeof main[key] === 'object') {
				sorted[key] = this.sortMain(main[key])
			} else {
				sorted[key] = main[key]
			}
		})
		return sorted
	}

	exposeJobsArray() {
		return this.jobsArray
	}
}

module.exports = CreateJobs
