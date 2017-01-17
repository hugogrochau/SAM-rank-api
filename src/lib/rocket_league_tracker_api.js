import got from 'got'
import querystring from 'querystring'
import _ from 'lodash'

const API_URL = 'https://20kiyaost7.execute-api.us-west-2.amazonaws.com/prod'

function getStats(platform, id, apiKey) {
  return new Promise((resolve, reject) => {
    let queryStr = querystring.stringify({
      'platform': platform,
      'name': id
    })
    got(API_URL + '?' + queryStr, {
      'method': 'GET',
      'json': true,
      'headers': { 'X-API-KEY': apiKey },
    })
      .then(response => {
        resolve( _.omit(response.body, 'tracking'))
      })
      .catch(err => reject(err))
  })
}

export { getStats }
