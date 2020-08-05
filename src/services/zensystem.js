const Bluebird = require("bluebird");
const req = Bluebird.promisify(require("request"));

const decimals = 8;
const multiplier = Math.pow(10, decimals);

module.exports = {
    supported_address: [ "ZEN" ],

    check(addr) {
        return RegExp('^[z][ns][a-km-zA-HJ-NP-Z0-9]{26,33}$').test(addr);
    },

    symbol(addr) {
        return "ZEN";
    },

    fetch(addr) {
        const network = this.symbol(addr);

        const url = `https://explorer.zensystem.io/insight-api-zen/addr/${addr}/balance`;

        return req(url, {json: true})
        .timeout(5000)
        .cancellable()
        .spread(function(resp, json) {
            if (resp.statusCode < 200 || resp.statusCode >= 300) throw new Error(JSON.stringify(resp));
            return {
                quantity: parseFloat(json) / multiplier,
                asset: network
            };
        });
    }
};
