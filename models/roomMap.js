const Room = require('./room.js')
const { Map } = require('immutable')

/**
 * Represents all rooms
 */
class RoomMap {
  /**
   * The current rooms
   */
  #rooms

  constructor (rooms) {
    this.#rooms = rooms
  }

  static empty = new RoomMap(Map())

  /**
   * Gets a room by its id
   * @param {number} id The id of the room
   * @return {Room|undefined} The room or undefined if not found
   */
  get (id) {
    return this.#rooms.get(id)
  }

  /**
   * Maps a room
   * @param {number} id The id of the room
   * @param {function(Room):Room} mapper A function that changes the room
   * @return {RoomMap} A new room-map with the room changed
   */
  map (id, mapper) {
    return new RoomMap(this.#rooms.update(id, mapper))
  }

  /**
   * Adds a room to the room-map
   * @param {Room} room The room to add
   * @return {RoomMap} A new room-map with the room added
   */
  add (room) {
    return new RoomMap(this.#rooms.set(room.id, room))
  }
}

module.exports = RoomMap
