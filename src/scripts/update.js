import fetch from 'isomorphic-fetch'
import queue from 'async/queue'
import values from 'lodash/values'

import rlrankapi, { TRACKER } from '../lib/rocket-league-rank-api'

/* eslint-disable no-console */

if (!process.env.ROCKETLEAGUE_TRACKER_NETWORK_API_KEY || !process.env.RLTRACKER_PRO_API_KEY) {
  console.log('Please set the ROCKETLEAGUE_TRACKER_NETWORK_API_KEY and RLTRACKER_PRO_API_KEY env')
  process.exit(-1)
}

const PRIORITY_UNIT = 15 // minutes difference between priorities

const LOCAL_API = 'http://192.241.250.100:8080/api/v1'

const TRACKER_NAME = []
TRACKER_NAME[TRACKER.RLTRACKER_PRO] = 'rltracker.pro'
TRACKER_NAME[TRACKER.ROCKETLEAGUE_TRACKER_NETWORK] = 'Rocket League Tracker Network'

const RATE = []
RATE[TRACKER.RLTRACKER_PRO] = 9.8
RATE[TRACKER.ROCKETLEAGUE_TRACKER_NETWORK] = 1.8

const lastRequest = []
lastRequest[TRACKER.RLTRACKER_PRO] = 0
lastRequest[TRACKER.ROCKETLEAGUE_TRACKER_NETWORK] = 0

const isUp = []
isUp[TRACKER.RLTRACKER_PRO] = true
isUp[TRACKER.ROCKETLEAGUE_TRACKER_NETWORK] = true

const API_KEY = []
API_KEY[TRACKER.RLTRACKER_PRO] = process.env.RLTRACKER_PRO_API_KEY
API_KEY[TRACKER.ROCKETLEAGUE_TRACKER_NETWORK] = process.env.ROCKETLEAGUE_TRACKER_NETWORK_API_KEY


const getAdjustedTime = (time, priority) =>
  time + (priority * PRIORITY_UNIT * 60 * 1000)

// should update every PRIORITY * 60 min
const shouldUpdate = (player) => {
  const timeDelta = Date.now() - (new Date(player.last_update)).getTime()
  const minTimeToUpdate = getAdjustedTime(0, player.priority)
  const justCreated = player.last_update === player.created_at
  return (timeDelta > minTimeToUpdate && player.priority > 0) || justCreated
}

const timeToWaitBeforeNextRequest = (rate, lastRequestTime) => {
  const time = ((60 * 1000) / rate) - (Date.now() - lastRequestTime)
  return time < 0 ? 0 : time
}

const update = () => {
  console.log(`Starting full update at ${new Date().toISOString()}...`)

  console.log('Pulling players...')

  // set trackers as up
  isUp.map(() => true)

  fetch(`${LOCAL_API}/player`)
    .then((response) => {
      response.json()
        .then((jsonData) => {
          console.log('Pulled players')

          const playersToUpdate = jsonData.data.filter((p) => shouldUpdate(p))

          // sort by update time
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

const updatePlayer = (player, tracker) => new Promise((resolve, reject) => {
  rlrankapi.getPlayerInformation(player.platform, player.id, API_KEY[tracker], tracker)
      .then((stats) => {
        console.log(`${LOCAL_API}/player/${player.platform}/${player.id}/update`)

        fetch(`${LOCAL_API}/player/${player.platform}/${player.id}/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(stats),
        })
          .then((res) => {
            if (res.status === 200) {
              resolve(`Updated player: ${player.name}`)
            }
            reject(`Error status from local api: ${res.status}`)
          })
          .catch((err) =>
            reject(`Error updating ${player.name} with local api: ${err}`)
          )
      })
      .catch((err) =>
        reject(`Error updating ${player.name} with external api: ${err}`)
      )
})

let q = queue((player, callback) => {
  let timesToWait = values(TRACKER).map((trackerId) => ({
    trackerId,
    timeToWait: timeToWaitBeforeNextRequest(RATE[trackerId], lastRequest[trackerId]),
  }))

  // rltracker doesn't support xbox
  if (player.platform === 2) {
    timesToWait = timesToWait.filter((t) => t.trackerId !== TRACKER.RLTRACKER_PRO)
  }

  // sort by timeToWaitBeforeNextRequest
  timesToWait.sort((a, b) => a.timeToWait - b.timeToWait)

  const trackerId = timesToWait[0].trackerId
  const trackerTimeToWait = timesToWait[0].timeToWait
  const trackerName = TRACKER_NAME[trackerId]

  console.log(`Waiting ${trackerTimeToWait} ms for next request using ${trackerName}...`)
  setTimeout(() => {
    lastRequest[trackerId] = Date.now()
    console.log(`Starting update for player: ${player.name} using ${trackerName}`)
    updatePlayer(player, trackerId, trackerTimeToWait)
      .then((result) => {
        console.log(result)
        callback()
      })
      .catch((err) => {
        isUp[trackerId] = false
        console.log(err)
        callback(err)
      })
  }, trackerTimeToWait)
}, 2)

q.drain = () => setTimeout(update, 60 * 1000)

update()
