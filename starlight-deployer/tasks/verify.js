const retry = require('./retry')

module.exports = async function verify (hre, address, constructorArguments = [], libraries) {
  console.log('--Starting Verify Process--')
  const verifyData = {
    address,
    constructorArguments
  }

  if (libraries) {
    verifyData.libraries = libraries
  }

  console.log('chegou ate aqui')

  const result = await retry(() => hre.run('verify:verify', verifyData), 3, error => {
    const message = error.message.match(/Reason: (.*)/m)
    if (message === null || message.length < 2) {
        console.log('message', message)
      return true
    }
    const reason = message[1]
    console.log('reason', reason)
    const isVerified = reason === 'Already Verified'
    if (isVerified) {
        console.log('isVerified', isVerified)
      console.log(error.message)
    }
    return !isVerified
  })
  console.log('result', result)
}
