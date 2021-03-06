// Account data model

const API = require('../api');
const Character = require('./character');

const kIsAuthorizingKey = 'IsBeingAuthorized';

class Account {

    constructor(json, player) {
        this.id = json.id;
        this.username = json.username;
        this.email = json.email;
        this.xToken = json["X-Token"];
        this.player = player;

        this.characters = json.characters.map((charJson) => {
            return new Character(charJson);
        });
    }

    static fastLogin(player, callback) {
        API.get(player, 'account', { username: player.name }, (json, error) => {
            let account = json != null ? new Account(json, player) : null;
            callback(account, error);
        });
    }

    static login(player, data, callback) {
        API.post(player, 'account', data, (json, error) => {
            let account = json != null ? new Account(json, player) : null;
            callback(account, error);
        });
    }

    static register(player, data, callback) {
        API.put(player, 'account', data, (json, error) => {
            let account = json != null ? new Account(json, player) : null;
            callback(account, error);
        }); 
    }

    json() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            "X-Token": this.xToken
        }
    }

}
module.exports = Account;

mp.events.add('account:login', (player, username, password) => {
    if (player.data[kIsAuthorizingKey] == true) { return; }
    player.data[kIsAuthorizingKey] = true;
    let data = {
        username: username,
        password: password
    };
    Account.login(player, data, (account, error) => {
        player.data[kIsAuthorizingKey] = false;
        if (error != null) {
            console.log('Error: ' + error.toString());
            player.call('loginWindow:stopLoading', [error.toString()]);
        } else {
            player.data.model = account.json();
            mp.events.call('playerLogin', player);
        }
    });
});

mp.events.add('account:register', (player, username, password, email) => {
    if (player.data[kIsAuthorizingKey] == true) { return; }
    player.data[kIsAuthorizingKey] = true;
    let data = {
        username: username,
        password: password,
        email: email
    };
    Account.register(player, data, (account, error) => {
        player.data[kIsAuthorizingKey] = false;
        if (error != null) {
            console.log('Error: ' + error.toString());
            player.call('registerWindow:stopLoading', [error.toString()]);
        } else {
            player.data.model = account.json();
            mp.events.call('playerRegister', player);
        }
    });
});