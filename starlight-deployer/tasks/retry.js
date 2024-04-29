/**
 * @callback attemptCallback
 * @param {number} attemptNumber
 */

/**
 *
 * @param {attemptCallback} fn
 * @param {number} times
 * @return {Promise<*>}
 */
module.exports = async function retry (fn, times= 1, onError = noop) {
    let result, attempt = 1
  
    while(attempt <= times) {
      try {
        result = await fn(attempt)
        break
      } catch (e) {
        // If `onError` returns false then break the loop
        if (!onError(e)) {
          break
        }
  
        console.error(`Attempt ${attempt} failed! ${attempt + 1 <= times ? 'Giving another try...' : 'Skipping function'}`)
        console.error(e)
      }
      attempt++
    }
  
    return result
  }
  
  function noop () {
    return true
  }
  