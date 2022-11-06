require('dotenv').config()
const CreateJobs = require('./CreateJobs')
const mongoose = require('mongoose')
const fs = require('fs')
const url = process.env.MONGODB

const JobDataSchema = new mongoose.Schema({
	languages: Object, 
	frameworks: Object, 
	backend: Object, 
	frontend: Object,
	sqlNoSql: Object,
	security: Object,
	testing: Object,
	cloudTerms: Object,
	softwareDevProcesses: Object,
	versionControl: Object,
	operatingSys: Object,
	other: Object,
	salaryInfo: Object,
	termCounts: Object,
	jobCollection: Object,
	date: String,
	duplicates: Number
})

const JobData = mongoose.model('JobData', JobDataSchema)

class PageNavigation {
	listings = null
	counter = 1
	jobPage = 0

	constructor(brows, page) {
		this.page = page
		this.brows = brows
		this.CreateJobs = new CreateJobs(this.brows, this.page)
		this.createInterval()
	}

	async createListings() {
		this.listings = await this.page.$$(".react-job-listing").then(x => x).catch(x => console.log('listings creation unsuccessfull'));
	}

	async next() {
		await this.page.$$('.css-g9i05x-svg, .e13qs2073-svg').then(x => x[1].click())
	}

	async createInterval() {
		// determine if to continue to next page or finish operation
		if (this.jobPage >= 29) {
			this.CreateJobs.createMainObj()
			this.CreateJobs.jobsData.jobsCollection = this.CreateJobs.jobsArray
			await this.writeFileAndMongo(this.CreateJobs.jobsData)
			this.CreateJobs.brows.close()
			return;
		}

		await this.createListings()

		const len = this.listings.length
		for (let i = this.counter; i < len; i++) {
			await this.listings[this.counter].click();
			await this.CreateJobs.createJobObj(this.listings[this.counter])
			this.counter += 1;
			console.log(this.jobPage)
		}

		if (this.counter === this.listings.length && this.jobPage < 30) {
			this.nextPageAndStart()
		} else {
		}
	}

	async writeFileAndMongo(jobsData) {
		const date = new Date()
		const string = `glassdoor_${date.getMonth() + 1}_${date.getDate()}_${date.getFullYear()}`
		jobsData.date = string
		const readyToSaveObj = JSON.stringify(jobsData, null, 2)
		fs.writeFile(`./data/${string}.json`, readyToSaveObj, (error) => console.log(error));
		await this.mongoDBSave(jobsData)
	}

	async mongoDBSave(jobData) {
		try {
			await mongoose.connect(url)
			const JobDataObj = new JobData(jobData)
			await JobDataObj.save()
			await mongoose.connection.close()
		} catch (e) {
			console.log(e)
		}
	}

	async nextPageAndStart(int) {
		this.counter = 0;
		this.jobPage += 1
		await this.next();
		setTimeout(async () => {
			await this.page.on('load')
			await this.createInterval();
		}, 3500)
	}
}

module.exports = PageNavigation
