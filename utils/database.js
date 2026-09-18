const Helpers = require('./helpers');
const config = require('./config');

class Database {
    constructor() {
        this.ownersFile = config.dataPath + 'owners.json';
        this.wlFile = config.dataPath + 'whitelist.json';
        this.jpmFile = config.dataPath + 'jpmdata.json';

        // Init default owner
        if (Helpers.loadJSON(this.ownersFile).length === 0) {
            Helpers.saveJSON(this.ownersFile, [config.ownerNumber]);
        }
    }

    // OWNERS
    getOwners() {
        return Helpers.loadJSON(this.ownersFile);
    }

    addOwner(number) {
        const owners = this.getOwners();
        const clean = Helpers.cleanNumber(number);
        if (!owners.includes(clean)) {
            owners.push(clean);
            Helpers.saveJSON(this.ownersFile, owners);
            return true;
        }
        return false;
    }

    delOwner(number) {
        const owners = this.getOwners();
        const clean = Helpers.cleanNumber(number);
        const idx = owners.indexOf(clean);
        if (idx > -1) {
            owners.splice(idx, 1);
            Helpers.saveJSON(this.ownersFile, owners);
            return true;
        }
        return false;
    }

    // WHITELIST
    getWL() {
        return Helpers.loadJSON(this.wlFile);
    }

    addWL(number) {
        const wl = this.getWL();
        const clean = Helpers.cleanNumber(number);
        if (!wl.includes(clean)) {
            wl.push(clean);
            Helpers.saveJSON(this.wlFile, wl);
            return true;
        }
        return false;
    }

    delWL(number) {
        const wl = this.getWL();
        const clean = Helpers.cleanNumber(number);
        const idx = wl.indexOf(clean);
        if (idx > -1) {
            wl.splice(idx, 1);
            Helpers.saveJSON(this.wlFile, wl);
            return true;
        }
        return false;
    }

    // JPM DATA
    getJPM() {
        return Helpers.loadJSON(this.jpmFile);
    }

    saveJPM(data) {
        Helpers.saveJSON(this.jpmFile, data);
    }
}

module.exports = Database;
