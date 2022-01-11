const PlayerMap = require('./playerMap.js')
const RoomMap = require('./roomMap.js')
const Room = require('./room.js')

module.exports = class Hub {
  /**
   * The player-map
   * @type {PlayerMap}
   */
  #playerMap
  /**
   * The current rooms
   * @type {RoomMap}
   */
  #rooms

  constructor (playerMap, rooms) {
    this.#playerMap = playerMap
    this.#rooms = rooms
  }

  /**
   * An empty hub
   * @type {Hub}
   */
  static empty = new Hub(PlayerMap.empty, RoomMap.empty)

  /**
   * The hubs player-map
   * @return {PlayerMap}
   */
  get playerMap () {
    return this.#playerMap
  }

  /**
   * The hubs' rooms
   * @return {RoomMap}
   */
  get rooms () {
    return this.#rooms
  }

  /**
   * Creates a new hub with a different player-map
   * @param {PlayerMap} playerMap The new player-map
   * @return {Hub} A hub with the new player-map
   */
  withPlayerMap (playerMap) {
    return new Hub(playerMap, this.rooms)
  }

  /**
   * Creates a new hub with different rooms
   * @param {RoomMap} rooms The new rooms
   * @return {Hub} A hub with the new rooms
   */
  withRooms (rooms) {
    return new Hub(this.playerMap, rooms)
  }

  /**
   * Changes the hubs player-map
   * @param {function(PlayerMap):PlayerMap} mapper A function that changes the player-map
   * @return {Hub} A new hub with the changed player-map
   */
  mapPlayerMap (mapper) {
    return this.withPlayerMap(mapper(this.playerMap))
  }

  /**
   * Changes the hubs rooms
   * @param {function(RoomMap):RoomMap} mapper A function that changes the rooms
   * @return {Hub} A new hub with the changed rooms
   */
  mapRooms (mapper) {
    return this.withRooms(mapper(this.rooms))
  }

  /**
   * Changes one of the hubs rooms
   * @param {number} id The id of the room
   * @param {function(Room):Room} mapper A function that changes a room
   * @return {Hub} A new hub with the changed room
   */
  mapRoom (id, mapper) {
    return this.mapRooms(rooms => rooms.map(id, mapper))
  }

  /**
   * Processes an event
   * @param {string} playerId The id of the player who triggered the event
   * @param {string} eventName The name of the event
   * @param {any} data The data that was sent with the event
   * @return {{emits: function[], newHub: Hub}} A new hub, with any changes the event cause, as well as an array of emits
   */
  processSocketEvent (playerId, eventName, data) {
    const noChanges = { newHub: this, emits: [] }

    const processUnknownPlayerEvent = () => {
      // The only thing unknown players can do is connect
      if (eventName === 'connect') {
        console.log(`New player (${playerId}) entered the lonely-zone.`)
        return {
          newHub:
            this.mapPlayerMap(it => it
              .addLonely(playerId)),
          emits: []
        }
      } else { return noChanges }
    }

    const processLonelyPlayerEvent = () => {
      switch (eventName) {
        case 'newRoom': {
          const newRoom = Room.openNew().addPlayer(playerId)
          return {
            newHub: this
              .mapPlayerMap(it => it
                .setPlayerName(playerId, data.playerName)
                .setPlayerRoomId(playerId, newRoom.id))
              .mapRooms(it => it
                .add(newRoom)),
            emits: [
              io => io.sockets.sockets.get(playerId).emit('joinSuccess', { roomId: newRoom.id })
            ]
          }
        }
        case 'joinRoom': {
          return {
            newHub: this
              .mapPlayerMap(it => it
                .setPlayerName(playerId, data.playerName)
                .setPlayerRoomId(playerId, data.roomId))
              .mapRoom(data.roomId, it => it
                .addPlayer(playerId)),
            emits: [
              io => io.sockets.sockets.get(playerId).emit('joinSuccess', { roomId: data.roomId })
            ]
          }
        }
        case 'disconnect':
          console.log(`Unknown player (${playerId}) disconnected from the lonely-zone.`)
          return {
            newHub: this
              .mapPlayerMap(it => it
                .remove(playerId)),
            emits: []
          }
        default:
          return noChanges
      }
    }

    const processRoomEvent = () => {
      switch (eventName) {
        case 'onRoomJoined' : {
          const player = this.#playerMap.get(playerId)
          return {
            newHub: this,
            emits: [
              io => io.sockets.sockets.get(playerId).join(player.roomId),
              io => io.to(player.roomId).emit('playersChanged', {
                playerNames:
                  this
                    .#rooms.get(player.roomId)
                    .playerIds
                    .map(id => this.#playerMap.get(id))
                    .map(p => p.name)
              })
            ]
          }
        }
        case 'disconnect': {
          const player = this.#playerMap.get(playerId)
          const newRooms = this.#rooms.map(player.roomId, room => room.removePlayer(playerId))
          return {
            newHub: this
              .mapPlayerMap(it => it
                .remove(playerId))
              .withRooms(
                newRooms),
            emits: [
              io => io.to(player.roomId).emit('playersChanged', {
                playerNames:
                  newRooms.get(player.roomId)
                    .playerIds
                    .map(id => this.#playerMap.get(id))
                    .map(p => p.name)
              })
            ]
          }
        }
      }
    }

    if (this.#playerMap.has(playerId)) { // The player is already in the player-map
      if (this.#playerMap.get(playerId).inInRoom) { // The player is already in a room
        return processRoomEvent()
      } else { // The player is not yet in a room
        return processLonelyPlayerEvent()
      }
    } else { // The player who sent the message is completely unknown
      return processUnknownPlayerEvent()
    }
  }
}
