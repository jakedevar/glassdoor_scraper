
const puppeteer = require('puppeteer');
const fs = require('fs')

let browser;
let page;
let listings;

async function setUp() {

	browser = await puppeteer.launch({headless:false, devtools:false});
	page = await browser.newPage()

	await page.goto('https://www.glassdoor.com/Job/software-engineer-jobs-SRCH_KO0,17.htm?context=Jobs&clickSource=searchBox')

	await page.$(".react-job-listing, .css-bkasv9, .eigr9kq0").then(x => x.click()).catch(x => console.log('nah there was an error bruh'))
	page.waitForSelector('.jaCreateAccountEmailSignUpButton').then(x => x.click()).catch(() => console.log('fuuuuuck'))
	await page.waitForSelector('.css-w3qhip, .eb2o9h0').then(x => x.click()).catch(() => console.log('fuuuuuck'))

	await page.type('.css-1kmcde, .e1h5k8h92', 'devarennesjacob@gmail.com').then(() => null).catch(() => console.log('email not logged'))
	await page.keyboard.press('Enter', {delay: 500}).then(() => null).catch(() => console.log('enter unsuccessfull'))
	await page.$('.css-w3qhip, .eb2o9h0').then(x => x.click()).catch(() => console.log('click unsuccessfull'))
	await page.type('.css-1kmcde, .e1h5k8h92', '1Backdoor$').then(() => null).catch(x => console.log('type unsuccessfull'))
	await page.keyboard.press('Enter', {delay: 500}).then(() => null).catch(() => console.log('enter unsuccessfull'))
	let prom = new Promise((resolve, reject) => {
		page.on('load', () => {
			page.$$('.evpplnh1').then(x => x[8].click()).catch(() => console.log('its not happenin'))
			resolve()
		})
	})
	await prom.then(() => null).catch(() => console.log('promise not wokring'))

}
const jobs = [];
let counter = 0;
let jobPage = 0;
let terms = ['javascript', 'elm', 'typescript', 'scala', 'python', ' go ', 'ruby', 
'swift', 'java', ' c ', 'rust', 'html', 'css', 'sql', 'nosql', 'postgres', 'c\#',  'perl', ' r ', 'node\.js', 'git', 
'vue', 'angular', 'django', 'ruby on rails', 'laravel', 'asp\.net', 'express', 'spring', 'ember', 'react', 'meteor', 'agile', 'kotlin', 'php',
'apache', 'mysql', 'linux', '\.net', 'graphql', 'cassandra', 'hadoop', 'flutter', 'iis', 'sql server', ]
;

async function objectMaker(listings) {
	let job = {};
	job.id = counter + 1;
	job.jobPage = jobPage
	let jobText = await listings[counter].getProperty('textContent').then(x => x.jsonValue()).catch(() => console.log('not working this one is'))
	let sals = jobText.match(/\$\d+.*\$\d+/)
	if (sals) {
		sals = sals[0].split(' - ')
		minSal = sals[0];
		maxSal = sals[1];
		job.minSal = minSal;
		job.maxSal = maxSal;
	}
	await page.waitForSelector(".jobDescriptionContent").then(() => null).catch(() => console.log('nope'))
	let text = await page.$eval('.jobDescriptionContent', (jobDesc) => {
		return jobDesc.textContent;
	}).then((jobDesc) => jobDesc).catch(() => console.log('job desc not working'))
	text = text.toLowerCase()
	terms.forEach(term => {
		if (text.match(term)) {
			job[term] = text.match(term).length
		}
	})
	// console.log(job)
	jobs.push(job);
}
// css-1buaf54 pr-xxsm //money div

function mainObj() {
	let main = {};
	jobs.forEach(listing => {
		let keys = Object.keys(listing);
		keys.forEach(key => {
			main[key] = main[key] || 0;
			main[key] += 1;
		})
	})
	return main;
}


async function objectGet() {
	listings = await page.$$(".react-job-listing, .css-bkasv9, .eigr9kq0").then(x => x).catch(x => console.log('nah there was an error bruh'));
	let int = setInterval(async () => {
		await listings[counter].click();
		await objectMaker(listings)
		counter += 1;
		console.log(jobPage)
		if (counter === listings.length) {
			clearInterval(int);
			counter = 0;
			jobPage += 1
			if (jobPage > 29) {
				const jobsData = {};
				jobsData.termCounts = mainObj()
				jobsData.jobsCollection = jobs
				let date = new Date()
				let string = await `glassdoor_${date.getMonth()}_${date.getDate()}_${date.getFullYear()}.json`
			  await fs.writeFile(`data/${string}`, JSON.stringify(jobsData, null, 2), (error) => error ? console.log('file created successfully') : console.log(error));
				break;
			}
			await next();
			setTimeout(async () => {
				await page.on('load')
				await objectGet();
			}, 3000)
		}
	}, 3000)  
}




async function next() {
	await page.$$('.css-g9i05x-svg, .e13qs2073-svg').then(x => x[1].click())
}

async function app() {
	await setUp().then(() => console.log('its happenin')).catch(() => console.log('whole thing not working'));
	await objectGet().then(() => console.log('its also working')).catch(x => console.log('its also not working'));
}


app().then(() => console.log('its def happenin')).catch(() => console.log('whole thing def not working'))
