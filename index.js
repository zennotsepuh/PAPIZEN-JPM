const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const fs = require('fs-extra');

const config = require('./utils/config');
const Helpers = require('./utils/helpers');
const Database = require('./utils/database');

// Commands
const menuCmd = require('./commands/menu');
const jpmCmd = require('./commands/jpm');
const ownerCmd = require('./commands/owner');
const groupCmd = require('./commands/group');
const toolsCmd = require('./commands/tools');

const db = new Database();

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['PAPI ZEN JPM', 'Chrome', '5.0.0']
    });

    // QR Code
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log(chalk.yellow('\n📱 SCAN QR CODE INI:\n'));
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(chalk.red('❌ Koneksi terputus!'), shouldReconnect ? 'Reconnecting...' : 'Logged out!');
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log(chalk.green(`
╭━━━━━━━━━━━━━━━━━━━━━━━╮
┃   𖤓  𝐏𝐀𝐏𝐈 𝐙𝐄𝐍 𝐉𝐏𝐌 𝐕.𝟓  𖤓
╰━━━━━━━━━━━━━━━━━━━━━━━╯

✅ BOT CONNECTED!
👑 Owner: ${db.getOwners()[0]}
🤖 Bot: ${config.botName}
⚡ Prefix: ${config.prefix}
📦 Version: ${config.version}
🟢 Status: ONLINE
`));
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // Handle Messages
    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0];
            if (!m.message) return;
            if (m.key.fromMe) return;

            const from = m.key.remoteJid;
            const sender = m.key.participant || m.key.remoteJid;
            const messageType = Object.keys(m.message)[0];
            
            let text = '';
            if (messageType === 'conversation') {
                text = m.message.conversation;
            } else if (messageType === 'extendedTextMessage') {
                text = m.message.extendedTextMessage.text;
            } else if (messageType === 'imageMessage') {
                text = m.message.imageMessage.caption || '';
            }

            if (!text) return;
            if (!text.startsWith(config.prefix)) return;

            const args = text.slice(config.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            console.log(chalk.cyan(`📩 [${Helpers.getTime()}] ${m.pushName}: ${text}`));

            // Route commands
            switch (command) {
                case 'menu':
                case 'help':
                    await menuCmd(sock, m, db);
                    break;

                // JPM
                case 'jpm':
                    await jpmCmd.jpm(sock, m, args, db);
                    break;
                case 'jpmht':
                    await jpmCmd.jpmht(sock, m, args, db);
                    break;
                case 'jpmswgc':
                    await jpmCmd.jpmswgc(sock, m, args, db);
                    break;
                case 'jpmch':
                    await jpmCmd.jpmch(sock, m, args, db);
                    break;
                case 'autojpm':
                    await jpmCmd.autojpm(sock, m, args, db);
                    break;
                case 'stopjpm':
                    await jpmCmd.stopjpm(sock, m, db);
                    break;

                // Owner
                case 'listgc':
                    await ownerCmd.listgc(sock, m, db);
                    break;
                case 'addwlgc':
                case 'addwl':
                    await ownerCmd.addWL(sock, m, args, db);
                    break;
                case 'delwlgc':
                case 'delwl':
                    await ownerCmd.delWL(sock, m, args, db);
                    break;
                case 'cekwl':
                    await ownerCmd.cekWL(sock, m, db);
                    break;

                // Group
                case 'joinall':
                    await groupCmd.joinall(sock, m, args, db);
                    break;
                case 'swgc':
                    await groupCmd.swgc(sock, m, args, db);
                    break;

                // Tools
                case 'ping':
                    await toolsCmd.ping(sock, m);
                    break;
                case 'pctc':
                    await toolsCmd.pctc(sock, m, args);
                    break;
                case 'qr':
                    await toolsCmd.qr(sock, m, args);
                    break;

                default:
                    break;
            }
        } catch (e) {
            console.error('Error:', e);
        }
    });
}

// Start
console.log(chalk.green(`
╭━━━━━━━━━━━━━━━━━━━━━━━╮
┃   𖤓  𝐏𝐀𝐏𝐈 𝐙𝐄𝐍 𝐉𝐏𝐌 𝐕.𝟓  𖤓
╰━━━━━━━━━━━━━━━━━━━━━━━╯

🚀 Starting bot...
`));

startBot().catch(e => console.error(e));

process.on('uncaughtException', (e) => console.error('Uncaught:', e));
process.on('unhandledRejection', (e) => console.error('Unhandled:', e));
