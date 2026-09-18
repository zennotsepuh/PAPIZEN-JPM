const fs = require('fs-extra');
const moment = require('moment-timezone');
const os = require('os');
const config = require('./config');

class Helpers {
    static loadJSON(file) {
        try {
            if (!fs.existsSync(file)) {
                fs.writeFileSync(file, JSON.stringify([]));
            }
            return JSON.parse(fs.readFileSync(file));
        } catch (e) {
            return [];
        }
    }

    static saveJSON(file, data) {
        try {
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
            return true;
        } catch (e) {
            return false;
        }
    }

    static getRuntime() {
        const uptime = process.uptime();
        const d = Math.floor(uptime / 86400);
        const h = Math.floor((uptime % 86400) / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const s = Math.floor(uptime % 60);
        return `${d}d ${h}h ${m}m ${s}s`;
    }

    static getRAM() {
        const total = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const free = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        return `${free}GB / ${total}GB`;
    }

    static getTime() {
        return moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss');
    }

    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    static cleanNumber(num) {
        return num.replace(/[^0-9]/g, '');
    }

    static isOwner(number, owners) {
        const clean = this.cleanNumber(number);
        return owners.includes(clean);
    }
}

module.exports = Helpers;
