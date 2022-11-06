const SetUp = require('./components/Setup')

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
