import request from 'superagent'
import _ from 'lodash'

const API_URL = 'https://20kiyaost7.execute-api.us-west-2.amazonaws.com/prod'

function getStats(platform, id, apiKey) {

  return new Promise((resolve, reject) => {
    request
      .get(API_URL)
      .set({ 'X-API-KEY': apiKey })
      .query({
        'platform': platform,
        'name': id
      })
      .then(res => resolve( _.omit(res.body, 'tracking')))
      .catch(err => reject(err))
  })
}
export { getStats }
