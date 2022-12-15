# glassdoor_scraper
Scrapes glassdoor with a predefined set of key words that fall into well known tech categories. 

Some examples of the categories are ie; backend, frontend, languages, and frameworks.

The scraper uses Puppeteer, MongoDB and Node.js to navigate to glassdoor to a specific URL that searches for software engineer positions anywhere in the U.S.

Execution takes approximatley 15 minutes and searches the job description for keywords that exist within each category. 

It also tracks the minimum and maximum salarys as well as a minimum average salary and a maximum average salary.

The full title for each position is tracked and is used to handle duplicate listings.
