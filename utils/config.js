require('dotenv').config();

module.exports = {
    ownerNumber: process.env.OWNER_NUMBER || '628xxxxxxxxxx',
    botName: process.env.BOT_NAME || 'PAPI ZEN JPM V.5',
    prefix: process.env.PREFIX || '.',
    version: process.env.VERSION || '5.0.0',
    sessionName: 'papizen-session',
    menuImage: './media/menu.jpg',
    jpmDelay: 5000, // 5 detik delay antar pesan
    autoJpmInterval: 60000, // 1 menit
    dataPath: './database/'
};
