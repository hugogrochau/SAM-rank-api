import fetch from 'isomorphic-fetch'
import queue from 'async/queue'
import dotenv from 'dotenv'

import rlrankapi from '../lib/rocket-league-rank-api'

dotenv.config()

if (!process.env.TRACKER_API_KEY) {
  console.log('Please set the TRACKER_API_KEY env')
  process.exit(-1)
}

const TRACKER_API_KEY = process.env.TRACKER_API_KEY

/* eslint-disable no-console */

const API = 'http://127.0.0.1:8080/api/v1'

const RATE = 9 // requests per minute

let lastRequest = 0

const getAdjustedTime = (time, priority) =>
  time + (priority * 60 * 60 * 1000)

// should update every PRIORITY * 60 min
const shouldUpdate = (player) => {
  const timeDelta = Date.now() - (new Date(player.last_update)).getTime()
  const minTimeToUpdate = getAdjustedTime(0, player.priority)
  const justCreated = player.last_update === player.created_at
  return (timeDelta > minTimeToUpdate && player.priority > 0) || justCreated
}

const update = () => {
  console.log(`Starting full update at ${new Date().toISOString()}...`)

  console.log('Pulling players...')

  fetch(`${API}/player`)
    .then((response) => {
      response.json()
        .then((jsonData) => {
          console.log('Pulled players')

          const playersToUpdate = jsonData.data.filter((p) => shouldUpdate(p))

          playersToUpdate.sort((a, b) =>
            getAdjustedTime((new Date(a.last_update).getTime()), a.priority) -
            getAdjustedTime((new Date(b.last_update)).getTime(), b.priority))

          console.log('Players to update:')
          console.log(playersToUpdate.map((p) => p.name))

          q.push(playersToUpdate, (err) => { if (err) console.log(err) })
        })
    })
    .catch((err) => console.log(`Error fetching players ${err}`))
}

const updatePlayer = (player, callback) => {
  let timeToWait = ((60 * 1000) / RATE) - (Date.now() - lastRequest)
  if (timeToWait < 0) {
    timeToWait = 0
  }
  console.log(`Waiting ${timeToWait} ms for next request...`)

  setTimeout(() => {
    console.log(`Starting update for player: ${player.name}`)
    lastRequest = Date.now()
    rlrankapi.getPlayerInformation(player.platform, player.id, TRACKER_API_KEY)
      .then((stats) => {
        console.log(`${API}/player/${player.platform}/${player.id}/update`)

        fetch(`${API}/player/${player.platform}/${player.id}/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(stats),
        })
          .then((res) => {
            if (res.status === 200) {
              console.log(`Updated player: ${player.name}`)
              callback()
            } else {
              callback(`Error: ${res.status}`)
            }

          })
          .catch((err) => {
            callback(`Error updating player ${player.name}\n${err}`)
          })
      })
      .catch((err) => {
        callback(`Error updating player\n${err}`)
      })
  }, timeToWait)
}

let q = queue((player, callback) => {
  updatePlayer(player, callback)
}, 1)

q.drain = () => setTimeout(update, 60 * 1000)

update()
