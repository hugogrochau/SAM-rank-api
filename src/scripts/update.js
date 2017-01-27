import fetch from 'isomorphic-fetch'
import queue from 'async/queue'
import values from 'lodash/values'

import rlrankapi, { TRACKER } from '../lib/rocket-league-rank-api'

/* eslint-disable no-console */

if (!process.env.ROCKETLEAGUE_TRACKER_NETWORK_API_KEY || !process.env.RLTRACKER_PRO_API_KEY) {
  console.log('Please set the ROCKETLEAGUE_TRACKER_NETWORK_API_KEY and RLTRACKER_PRO_API_KEY env')
  process.exit(-1)
}

// Settings

const PRIORITY_UNIT = 15 // minutes difference between priorities

const PULL_DELAY = 60 // seconds to wait before pulling players after a full update is done

const LOCAL_API = 'http://127.0.0.1:8080/api/v1'

const TRACKER_NAME = []
TRACKER_NAME[TRACKER.RLTRACKER_PRO] = 'rltracker.pro'
TRACKER_NAME[TRACKER.ROCKETLEAGUE_TRACKER_NETWORK] = 'Rocket League Tracker Network'

const RATE = []
RATE[TRACKER.RLTRACKER_PRO] = 9.8
RATE[TRACKER.ROCKETLEAGUE_TRACKER_NETWORK] = 1.8

const lastRequest = []
lastRequest[TRACKER.RLTRACKER_PRO] = 0
lastRequest[TRACKER.ROCKETLEAGUE_TRACKER_NETWORK] = 0

let isUp = []
isUp[TRACKER.RLTRACKER_PRO] = true
isUp[TRACKER.ROCKETLEAGUE_TRACKER_NETWORK] = true

const API_KEY = []
API_KEY[TRACKER.RLTRACKER_PRO] = process.env.RLTRACKER_PRO_API_KEY
API_KEY[TRACKER.ROCKETLEAGUE_TRACKER_NETWORK] = process.env.ROCKETLEAGUE_TRACKER_NETWORK_API_KEY


// Helper functions

// Get time increased based on player priority
const getAdjustedTime = (time, priority) =>
  time + (priority * PRIORITY_UNIT * 60 * 1000)

const shouldUpdate = (player) => {
  // Time between now and last update in ms
  const timeDelta = Date.now() - (new Date(player.last_update)).getTime()
  // Time between updates based on player priority
  const timeBetweenUpdates = getAdjustedTime(0, player.priority)
  const justCreated = player.last_update === player.created_at
  // Return true if it's time to update or if it's a new player
  return (timeDelta > timeBetweenUpdates && player.priority > 0) || justCreated
}

// Time to wait before next request to tracker
const timeToWaitBeforeNextRequest = (rate, lastRequestTime) => {
  //           rate in ms              ms passed since last request
  const time = ((60 * 1000) / rate) - (Date.now() - lastRequestTime)
  return time < 0 ? 0 : time
}

// function to be called at the start and when the queue depletes
const pullPlayers = () => {
  console.log(`Starting full update at ${new Date().toISOString()}...`)

  console.log('Pulling players...')

  // set trackers as up
  isUp = isUp.map(() => true)

  fetch(`${LOCAL_API}/player`)
    .then((response) => response.json())
    .catch((err) => console.log(`Error fetching players ${err}`))
    .then((jsonData) => {
      console.log('Pulled players')
      const playersToUpdate = jsonData.data.players.filter(shouldUpdate)

      // sort by update time
      playersToUpdate.sort((a, b) =>
        getAdjustedTime((new Date(a.last_update).getTime()), a.priority) -
        getAdjustedTime((new Date(b.last_update)).getTime(), b.priority))

      console.log('Players to update:')
      console.log(playersToUpdate.map((p) => p.name))

      q.push(playersToUpdate, (err) => { if (err) console.log(err) })
    })
    .catch((err) => console.log(`Error fetching players ${err}`))
}

// pulls player info from tracker and updates through the api
const updatePlayer = (player, tracker) =>
  rlrankapi.getPlayerInformation(player.platform, player.id, API_KEY[tracker], tracker)
    .then((stats) =>
      fetch(`${LOCAL_API}/player/${player.platform}/${player.id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats),
      })
    )
    .catch((err) => {
      throw new Error(`Error updating ${player.name} with external api: ${err}`)
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      }
      throw new Error(`Error status from local api: ${res.status}`)
    })
    .catch((err) => {
      throw new Error(`Error updating ${player.name} with local api: ${err}`)
    })
    .then((jsonData) => {
      if (jsonData.data.updated) {
        return `Updated player: ${player.name}`
      }
      return `No updated needed for player: ${player.name}`
    })

// queue definition
let q = queue((player, callback) => {
  const filteredTrackers = values(TRACKER).filter((t) =>
    isUp[t] && API_KEY[t] && // remove if tracker is marked as down or if we don't have the key
    (player.platform !== 2 || (player.platform === 2 && t !== TRACKER.RLTRACKER_PRO)) // RL Tracker can't handle xbox
  )

  if (filteredTrackers.length === 0) {
    callback(`No trackers to use for updating ${player.name}`)
    return
  }

  const timesToWait = filteredTrackers.map((trackerId) => ({
    trackerId,
    timeToWait: timeToWaitBeforeNextRequest(RATE[trackerId], lastRequest[trackerId]),
  }))

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
        console.log(`Marking ${trackerName} as down`)
        isUp[trackerId] = false
        callback(err)
      })
  }, trackerTimeToWait)
}, 1)

// pullPlayers again when queue finishes
q.drain = () => {
  console.log(`Finished full update. Pulling players again in ${PULL_DELAY} seconds`)
  setTimeout(pullPlayers, PULL_DELAY * 1000)
}

// pullPlayers on script start
pullPlayers()
