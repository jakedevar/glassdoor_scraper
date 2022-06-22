const puppeteer = require('puppeteer');
const fs = require('fs')
// this var below was slapdash but closes the browser at the end
let brows = null

// this operates the whole thing in reality, this opens the page, logs in, and then begins the process for the navigation class 
class SetUp {
	constructor() {
		return this
	}

	async initializePage() {
		this.browser = await puppeteer.launch({headless:false, devtools:false});
		brows = this.browser
		this.page = await this.browser.newPage()
		await this.page.goto('https://www.glassdoor.com/Job/software-engineer-jobs-SRCH_KO0,17.htm?context=Jobs&clickSource=searchBox')
		await this.login()	
	}	

	async randomClick(time) {
		setTimeout(async () => {
			await this.page.waitForSelector(".react-job-listing, .css-bkasv9, .eigr9kq0").then(x => x.click()).catch(() => console.log('its not happenin'))
		}, time)
	}

	// this operates the login sequence, its clunky but it should work MOST of the time (sometimes you have to restart it)
	async login() {
		await this.randomClick(2000)
		setTimeout(async () => {
			await this.page.waitForSelector('.jaCreateAccountEmailSignUpButton').then(x => x.click()).catch(() => console.log('click email for typing unsuccessfull'))
		}, 3000)
		await this.page.waitForSelector('.css-w3qhip, .eb2o9h0').then(x => x.click()).catch(() => console.log('click email for typing unsuccessfull'))
		await this.page.type('.css-1kmcde, .e1h5k8h92', 'zakquerygotem@gmail.com').then(() => true).catch(() => console.log('typing email unsuccessfull'))
		await this.page.keyboard.press('Enter', {delay: 500}).then(() => true).catch(() => console.log('enter unsuccessfull'))
		await this.page.$('.css-w3qhip, .eb2o9h0').then(x => x.click()).catch(() => console.log('click unsuccessfull'))
		await this.page.type('.css-1kmcde, .e1h5k8h92', '10FoldJones').then(() => true).catch(x => console.log('password type unsuccessfull'))
		await this.page.keyboard.press('Enter', {delay: 1000}).then(() => true).catch(() => console.log('enter unsuccessfull'))
		await this.randomClick(2000)
	}

	async startSetup() {
		await this.initializePage()
		setTimeout(() => {
			new pageNavigation(this.page)
		}, 2000)
	}
}

// I tried making somethings private but I don't really know how much good it will do 
// CreateJobs makes the array for all the jobs as well as the main object 
class CreateJobs {
	#jobsArray = []
	#job = {}
	#terms = ['javascript', 'elm', 'typescript', 'scala', 'python', ' go ', 'ruby', 'swift', 'java', ' c ', 'rust', 'html', 'css', 'sql', 'nosql', 'postgres', 'c#',  'perl', ' r ', 'node\.js', 'git', 
'vue', 'angular', 'django', 'ruby on rails', 'laravel', 'asp\.net', 'express', 'spring', 'ember', 'react', 'meteor', 'agile', 'kotlin', 'php',
'apache', 'mysql', 'linux', '\.net', 'graphql', 'cassandra', 'hadoop', 'flutter', 'iis', 'sql server', 'flask', 'spring', 'sqlite', 'redis', 'mariadb', 'firebase', 'elasticsearch', 'nginx', 'amazon rds', 'rocksdb', 'beringei', 'memcached',
'tornado', 'hbase', 'objective-c', 'thrift', 'blazor', 'elixir', 'erlang', ' raspberrypi', 'cm4', 'hmi', 'windows', 'modbus', 'bacnet', 'ethernet', ' ip ', 'rs485', 'usb', 'host', 'bluetooth', 'azure', 'jquery', 'visual', 'devops', 'scss', ' ux ', ' ui ', 
'arm', ' aws ', 'oauth', 'openid', ' saml ', ' spa ', ' git ', 'xamarin', 'cosmosdb', 'rxjs', 'redux', 'sdlc', 'cloud', ' mvc ', 'vb\.net', 'bootstrap', 's3', 'ec2', ' qa ', 'soap', 'aurora', 'docker', ' qml ', ' qt5 ', 'cmake', 'mqtt', 'qtest', 'dotnetcore', 'tsql', 'nextjs', 
'ionic', ' ai ', 'machine learning', 'scrum', 'providex', 'bbx', 'j2ee', 'unix', ' foundation ', ' css3 ', ' sass ', 'github', 'bitbucket',];

	constructor(page) {
		this.page = page
		return this
	}

	async createJobObj(listing) {
		let jobText = await listing.getProperty('textContent').then(x => x.jsonValue()).catch(() => console.log('jobText unsuccessfull'))
		this.#createSalary(jobText)
		await this.page.waitForSelector(".jobDescriptionContent").then(() => null).catch(() => console.log('jobDescriptionContent selector did not appear'))
		let text = await this.page.$eval('.jobDescriptionContent', (jobDesc) => {
			return jobDesc.textContent;
		}).then((jobDesc) => jobDesc).catch(() => console.log('jobDescriptionContent was not returned'))
		text = text.toLowerCase()
		this.#terms.forEach(term => {
			if (text.match(term)) {
				this.#job[term] = text.match(term).length
			}
		})
		this.#jobsArray.push(this.#job);
	}

	async #createSalary(jobText) {
		let sals = jobText.match(/\$\d+.*\$\d+/)
		if (sals) {
			sals = sals[0].split(' - ')
			let minSal = sals[0];
			let maxSal = sals[1];
			this.#job.minSal = minSal;
			this.#job.maxSal = maxSal;
		}
	}

	// this is the averages and counts for everything in the jobsArray 
	createMainObj() {
		let main = {};
		this.#jobsArray.forEach(listing => {
			let keys = Object.keys(listing);
			keys.forEach(key => {
				main[key] = main[key] || 0;
				main[key] += 1;
			})
		})
		return main;
	}

	exposeJobsArray() {
		return this.#jobsArray
	}
}

// this navigates the page and clicks through the job listings and to the next page there should be only 30 pages traveled in total for 900 jobs
class pageNavigation {
	#listings = null
	counter = 1
	jobPage = 0
	CreateJobs = null

	constructor(page) {
		this.page = page
		this.CreateJobs = new CreateJobs(this.page)
		this.createInterval()
	}

	async #createListings() {
		this.#listings = await this.page.$$(".react-job-listing").then(x => x).catch(x => console.log('listings creation unsuccessfull'));
	}

	async next() {
		await this.page.$$('.css-g9i05x-svg, .e13qs2073-svg').then(x => x[1].click())
	}

	async createInterval() {
		// interval was the only way I knew how to get a loop going without it iterating to fast.
		await this.#createListings()
		let int = setInterval(async () => {
			await this.#listings[this.counter].click();
			await this.CreateJobs.createJobObj(this.#listings[this.counter])
			this.counter += 1;
			console.log(this.jobPage)

			// determine if to continue to next page or finish operation
			if (this.counter === this.#listings.length && this.jobPage < 30) {
				this.nextPageAndStart(int)
			} else if (this.jobPage >= 29) {
				const jobsData = {};
				jobsData.termCounts = this.CreateJobs.createMainObj()
				jobsData.jobsCollection = this.CreateJobs.exposeJobsArray()
				await this.writeFile(jobsData)
				brows.close()
				return;
			}
		}, 3000)  
	}

	async writeFile(jobsData) {
		let date = new Date()
		let string = await `glassdoor_${date.getMonth() + 1}_${date.getDate()}_${date.getFullYear()}.json`
		await fs.writeFile(`data/${string}`, JSON.stringify(jobsData, null, 2), (error) => error ? console.log('file created successfully') : console.log(error));
	}

	async nextPageAndStart(int) {
		clearInterval(int);
		this.counter = 0;
		this.jobPage += 1
		await this.next();
		setTimeout(async () => {
			await this.page.on('load')
			await this.createInterval();
		}, 3000)
	}
}

// redundant but seemed like the right way to initiate app
class App {
	constructor() {
		this.operation()
	}

	async operation() {
		let setup = new SetUp()
		setup.startSetup()
	}
}

new App()
