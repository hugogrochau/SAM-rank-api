const got = require('got');
const queue = require('async/queue');
const retry = require('async/retry');
const querystring = require('querystring');

const API = 'http://127.0.0.1:8080/api/v1/';

const SIMULTANEOUS_WORKERS = 2;

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

let q = queue((player, callback) => {
  console.log('Starting update for player: ' + player.attributes.name);
  let id = player.attributes.platform == 2 ? player.attributes.name : player.id; // xone doesn't work with numeric id

  console.log(API + 'player/' + player.attributes.platform + '/' + id + '/update');
  got(API + 'player/' + player.attributes.platform + '/' + id + '/update')
    .then(response => {
      console.log('Updated player: ' + player.attributes.name);
      callback();
    })
    .catch(err => {
      callback('Error updating player ' + player.attributes.name + '\n' + err.response.body);
    });
}, SIMULTANEOUS_WORKERS);

q.drain = update;

update();
