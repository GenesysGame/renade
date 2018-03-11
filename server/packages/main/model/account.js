// Account data model

const API = require('../api');
const Character = require('./character');

const kIsAuthorizingKey = 'IsBeingAuthorized';

class Account {

    constructor(json) {
        this.id = json.id;
        this.username = json.username;
        this.email = json.email;
        this.xToken = json["X-Token"];

        this.characters = json.characters.map((charJson) => {
            return new Character(charJson);
        });
    }

    static login(data, callback) {
        API.post('account', data, (json, error) => {
            let account = json != null ? new Account(json) : null;
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
    if (player.getVariable(kIsAuthorizingKey) == true) { return; }
    player.setVariable(kIsAuthorizingKey, true);
    let data = {
        username: username,
        password: password,
        email: "ggame.studio@yandex.ru"
    };
    Account.login(data, (account, error) => {
        player.setVariable(kIsAuthorizingKey, false);
        if (error != null) {
            console.log('Error: ' + error);
            player.call('loginWindow:stopLoading', [error]);
        } else {
            player.setVariable('model', account.json());
            mp.events.call('playerLogin', player);
        }
    });
});