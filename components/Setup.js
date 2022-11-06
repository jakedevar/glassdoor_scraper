const puppeteer = require('puppeteer');
const PageNavigation = require('./PageNavigation')

class SetUp {
	constructor() {
		return this
	}

	async initializePage() {
		this.browser = await puppeteer.launch({headless:false, devtools:false, args: ['--no-sandbox', '--disable-setuid-sandbox']});
		this.page = await this.browser.newPage()
		await this.page.goto('https://www.glassdoor.com/Job/software-engineer-jobs-SRCH_KO0,17.htm?context=Jobs&clickSource=searchBox')
		await this.login()	
	}	

	pause(time = 1000) {
		return new Promise(resolve => {
			setTimeout(() => {resolve()}, time)
		})
	}

	async randomClick(time) {
		setTimeout(async () => {
			await this.page.waitForSelector(".react-job-listing, .css-bkasv9, .eigr9kq0").then(x => x.click()).catch(() => console.log('its not happenin'))
		}, time)
	}

	async login() {
		try {
			await this.randomClick(2000)
			await this.pause(3000)
			await this.page.waitForSelector('.jaCreateAccountEmailSignUpButton').then(x => x.click()).catch(() => console.log('click email for typing unsuccessfull'))
			await this.pause(2000)
			await this.page.waitForSelector('.css-w3qhip, .eb2o9h0').then(x => x.click()).catch(() => console.log('click email for typing unsuccessfull'))
			await this.pause()
			await this.page.type('.css-1kmcde, .e1h5k8h92', 'zakquerygotem@gmail.com').then(() => true).catch(() => console.log('typing email unsuccessfull'))
			await this.pause()
			await this.page.keyboard.press('Enter', {delay: 500}).then(() => true).catch(() => console.log('enter unsuccessfull'))
			await this.pause(2000)
			await this.page.$('.css-w3qhip, .eb2o9h0').then(x => x.click()).catch(() => console.log('click unsuccessfull'))
			await this.pause()
			await this.page.type('.css-1kmcde, .e1h5k8h92', '10FoldJones').then(() => true).catch(x => console.log('password type unsuccessfull'))
			await this.pause()
			await this.page.keyboard.press('Enter', {delay: 1000}).then(() => true).catch(() => console.log('enter unsuccessfull'))
			await this.pause()
			await this.page.waitForSelector('.jaCreateAccountModalWrapper').then(_ => this.randomClick(1000)).catch(() => console.log('click email for typing unsuccessfull'))
		} catch(e) {
			console.log("Error in login: " + e)
      this.login()
			return e
		}
	}

	async startSetup() {
		await this.initializePage()
		setTimeout(() => {
			new PageNavigation(this.browser, this.page)
		}, 2000)
	}
}

module.exports = SetUp
