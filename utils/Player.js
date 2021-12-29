class Player{
    constructor (socketId, name, role) {
        this.socketId = socketId;
        this.name = name;
        this.role = role;
    }
}

module.exports = {Player};
