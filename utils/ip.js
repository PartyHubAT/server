// Function that returns gateway ip on en0 from current device
function getGatewayIp(){
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    let key = Object.keys(results)
    return results[key[0]][0];
}

const gatewayIp = getGatewayIp();

module.exports = {getGatewayIp,gatewayIp};