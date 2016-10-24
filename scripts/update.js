const got = require('got');
const queue = require('async/queue');
const retry = require('async/retry');

const API = 'http://127.0.0.1:8080/api/v1/';

const SIMULTANEOUS_WORKERS = 4;
const RATE = 1; // requests per second
const RETRY_ATTEMPTS = 5;

const update = () => {
  console.log('Starting full update at ' + new Date().toISOString() + '...');

  console.log('Pulling players...');

  got(API + 'player', { 'json': true })
    .then(response => {
      console.log('Pulled players...');
      q.push(response.body.data, err => { if (err) console.log(err) });
    })
    .catch(err => console.log('Error fetching players ' + err));
};

const updatePlayerFactory = player => (callback, result) => {
  setTimeout( () => {
    console.log('Starting update for player: ' + player.attributes.name);
    let id = player.attributes.platform == 2 ? player.attributes.name : player.id; // xone doesn't work with numeric id

    console.log(API + 'player/' + player.attributes.platform + '/' + id + '/update');
    got(API + 'player/' + player.attributes.platform + '/' + id + '/update')
      .then(res => {
        callback(null, 'Updated player: ' + player.attributes.name);
      })
      .catch(err => {
        console.log('Error updating player ' + player.attributes.name + '\n' + err.response.body);
        console.log('Trying again');
        callback('Fatal error updating player ' + player.attributes.name + '\n' + err.response.body, null);
      });
  }, (Math.random() * (1200 - 800) + 800) / (RATE / SIMULTANEOUS_WORKERS));
};

let q = queue((player, callback) => {
  retry(RETRY_ATTEMPTS, updatePlayerFactory(player), (err, result) => {
      if (err) {
        callback(err);
      } else {
        console.log(result);
        callback();
      }
  });
}, SIMULTANEOUS_WORKERS);

q.drain = update;

update();
