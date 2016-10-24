const got = require('got');
const parallelLimit = require('async/parallelLimit');
const querystring = require('querystring');


const API = 'http://127.0.0.1:8080/api/v1/';
const INTERVAL = 15; // minutes
const SIMULTANEOUS_WORKERS = 2;


const update = () => {
  console.log('Starting full update...');

  console.log('Pulling players...');

  got(API + 'player', { 'json': true })
    .then(response => {
      console.log('Pulled players...');
      let players = response.body.data;
      let tasks = [];
      players.forEach(player => {
        tasks.push(callback => {
          console.log('Starting update for player: ' + player.attributes.name);
          got(API + 'player/' + player.attributes.platform + '/' + player.id + '/update')
            .then(response => {
              console.log('Updated player: ' + player.attributes.name);
              callback(null);
            })
            .catch(error => {
              console.log('Error updating player ' + player.attributes.name + '\n' + error.response.body)
            });
        });
      });

      parallelLimit(tasks, SIMULTANEOUS_WORKERS, () => console.log('Update finished. \nWaiting ' + INTERVAL + ' minutes until the next update...'));
    })
    .catch(error => console.log('Error getting players ' + error));
};

update();
setInterval(update, 1000 * 60 * INTERVAL);

