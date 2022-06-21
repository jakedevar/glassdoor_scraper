let puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless:false, devtools:false});
  const page = await browser.newPage()
  await page.goto('https://www.glassdoor.com/Job/houston-tx-software-engineer-ii-jobs-SRCH_IL.0,10_IC1140171_KO11,31.htm?src=GD_JOB_AD&srs=ALL_RESULTS&jl=1007857807052&ao=1110586&s=345&guid=00000180c560623eb6bebca9213e780a&pos=101&t=SR-JOBS-HR&vt=w&uido=DC945D7F0168AB9ED3C10FB3E6BD5DBE&cs=1_98c14c69&cb=1652578869983&jobListingId=1007857807052&cpc=6FC5BA77C9A4CD78&jrtk=3-0-1g32m0oj6m6qh801-1g32m0ojrr1af800-2a9ff4005e2de021--6NYlbfkN0CiRNM7CVr8YueLFKlzwbFWI0o7IjV438l4sVrvKZ0flpURU_mqoI8E-VxPfg2eTCHdbZCEoTpTBhmUd3U9mkRwojzKEhGTCObDmP-Zjd0MJBeTx2ZqgAHHoTp47Ky2RPmWUA9hafRqEwo7M4uPXPJH0wL-J0pjBuPgT-sFc2Rxa40P_Y21mOX84QlCRoWyIYIfLtqF2dEUaM84sWFFRFp3JpWml4iJXiv26zIuKrvRUsH9eYHuzqeX-4YgibAQY-XveU37Gvi7A76k-U2sIVBSiuVNZ9-ZfKdgFnWS8JZBahckKNvFLOL01wY6x9VexfwK8I6KLDNWDp5Fx8bpliXY0ZAjwpnJQsDirswTviL-n7e6yVwniYCMCxRu1Pb8Mc5PYeNOkIg2FkZiSQKDb9prUpmnvBY7ZLIxijmi1502JNK2F8dmcSXglQvTHSnZSpyz_RHqjemcpMtaZocXfqQMgGya3F1ugHeZhGGp3qlfkCf67tODGttVzAxXV4JqsIJexpld5m-IgcbsQj03A8x317YLNi8aKPM%3D')
  try {
    await page.on('domcontentloaded')
    await page.$$(".react-job-listing, .css-bkasv9, .eigr9kq0").then(x => x[0].click()).catch(x => console.log('nah there was an error bruh'))
    await page.waitForSelector('.jaCreateAccountEmailSignUpButton').then(x => x.click());
    await page.waitForSelector('.css-w3qhip, .eb2o9h0').then(x => x.click());
    await page.type('.css-1kmcde, .e1h5k8h92', 'devarennesjacob@gmail.com')
    await page.keyboard.press('Enter')
    await setTimeout(() => {page.evaluate(() => document.querySelector('.css-w3qhip, .eb2o9h0').click())}, 800)

    await setTimeout(() => {page.type('.css-1kmcde, .e1h5k8h92', '1Backdoor$')}, 900)

    await setTimeout(() => {page.keyboard.press('Enter')}, 1500)
    await setTimeout(() => {page.keyboard.press('Enter')}, 5000)
    await setTimeout(() => {
      page.evaluate(() => {
        let a = document.querySelector('.modal_main, .jaCreateAccountModalWrapper, .gdGrid')
        let x = a.querySelectorAll('.gd-ui-button, .css-14xfqow, .evpplnh0')
        x = x[x.length - 1]
        x.click()
      })
    }, 5000)
    let text;
    await setTimeout(async () => {
      try {
        text = await page.$$('.react-job-listing').then(x => x).catch(e => console.log('array was not returned'));
      } catch {
        console.log('i failed 1')
      }
    }, 7000)
    let ids = 31
    await setTimeout(async () => {
      try {
        try {
          await setInterval(async () => {
            ids -= 1;
            await text[ids].click();
            (await page.$('.e856ufb2')).click()
          }, 4000)
        } catch {
          console.log('i failed 3')
        }
      } catch {
        console.log('i failed 2')
      }
      
    }, 8000)
    let children;
    let terms = ['javascript', 'elm', 'typescript', 'scala', 'python', ' go ', 'ruby', 'swift', 'java', ' c ', 'rust', 'html', 'css', 'sql', 'nosql', 'postrgress', 'c\#',  'perl', ' r ', 'node\.js', 'git', 'vue', 'angular', 'django', 'ruby on rails', 'laravel', 'asp\.net', 'express', 'spring', 'ember', 'react', 'meteor', 'agile'];
    function objMaker() {
      let res = {};
        res.id = ids
        let len = words.length;
        let jlen = terms.length;
  
        for (let i = 0; i < len; i++) {
          for (let j = 0; j < jlen; j++) {
            let lang = new RegExp(terms[j]);
            let word = words[i];
            if (/.+\d\d+,\d\d\d.+/.test(word)) {
              res.salarey = word
            }
            if (lang.test(word)) {
              res[terms[j]] = res[terms[j]] || 0;
              res[terms[j]] += 1;
            }
          }
        }
        console.log(res, text.length)
    }
    await setTimeout(async () => {
      await setInterval(async () => {
        try {
          children = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".jobDescriptionContent")).map(x => x.textContent)
          }).then(x => x).catch('why the fu is this not wokring')
          let words = await children[0].toLowerCase().split(' ');
          await objMaker()
        } catch {
          console.log('i failed 4')
        }
        
      }, 4000)
    }, 8400)

    // ok now i need to set an interval that pops an element from the stack of lists before it pops i need to log the length
    // and set the id of the object to the length

    let overall = [];
    // await setTimeout(async () => {
    //   await setInterval(async () => {
        
    //   }, 4000)
    // }, 8890)
    // Array.from(text).forEach(x => x.click())

    // clearInterval(id)
    // await page.waitForSelector('.SVGInline, .modal_closeIcon').then(x => x.click())
    // let lists = await page.waitForSelector('.hover, .p-0, .job-search-key-kgm6qi, .exy0tjh1').then(x => console.log(x.tagName))
    // let len = 1
    // for (let i = 0; i < len; i++) {
    //   console.log(lists.tagName)
      // setTimeout(e => {lists[i].click()}, i * 1000)
    // } 
  } catch(e) {
    console.log(e)
    // browser.close()

  }
  // await browser.close()
})().then(e => console.log('yes')).catch(e => console.log('no'))