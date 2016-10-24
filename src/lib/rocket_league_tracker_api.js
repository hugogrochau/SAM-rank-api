import got from 'got';
import querystring from 'querystring';
import _ from 'lodash';


const API_URL = 'https://20kiyaost7.execute-api.us-west-2.amazonaws.com/prod';

const getHeader = apiKey => { return {'X-API-KEY': apiKey } };

async function getStats(platform, id, apiKey) {
  try {
    let queryStr = querystring.stringify({
      'platform': platform,
      'name': id
    });
    let response = await got(API_URL + '?' + queryStr, {
      'method': 'GET',
      'json': true,
      'headers': getHeader(apiKey),
    });
    return _.omit(response.body, 'tracking');
  } catch (err) {
    throw new Error(err.response.body);
  }
};

export { getStats };
