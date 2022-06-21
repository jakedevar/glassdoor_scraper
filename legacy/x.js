let promise = new Promise((resolve, reject) => [
  setTimeout(() => {
    resolve()
  }, 5000)
])

(async function lol() {
  await promise.then(console.log('it has resolved'));
})()