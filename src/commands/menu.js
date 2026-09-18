const Helpers = require('../utils/helpers');
const config = require('../utils/config');
const fs = require('fs-extra');

module.exports = async (sock, m, db) => {
    const from = m.key.remoteJid;
    const sender = m.key.participant || m.key.remoteJid;
    const pushName = m.pushName || 'User';
    const cleanSender = Helpers.cleanNumber(sender);
    const isOwner = Helpers.isOwner(cleanSender, db.getOwners());

    const menuText = `╭━━━━━━━━━━━━━━━━━━━━━━━╮
┃   𖤓    𝐏𝐀𝐏𝐈 𝐙𝐄𝐍 𝐉𝐏𝐌 𝐕.𝟓   𖤓
╰━━━━━━━━━━━━━━━━━━━━━━━╯

> 「 🤖 *BOT INFORMATION* 」

▸ 👑 Owner    : ${db.getOwners()[0]}
▸ 🤖 Bot      : ${config.botName}
▸ ⚡ Prefix   : ${config.prefix}
▸ 📦 Version  : ${config.version}
▸ 💻 Runtime  : ${Helpers.getRuntime()}
▸ 🧠 RAM      : ${Helpers.getRAM()}
▸ 🟢 Status   : Online ✅

━━━━━━━━━━━━━━━━━━━━━━

『 👑 OWNER MENU 』

❏ ${config.prefix}listgc
❏ ${config.prefix}wl on/off
❏ ${config.prefix}addwlgc
❏ ${config.prefix}delwlgc
❏ ${config.prefix}cekwl
❏ ${config.prefix}set jpm
❏ ${config.prefix}stopjpm

━━━━━━━━━━━━━━━━━━━━━━

『 🚀 JPM MENU 』

❏ ${config.prefix}jpm
❏ ${config.prefix}jpmht
❏ ${config.prefix}jpmsw (off)
❏ ${config.prefix}jpmswft (off)
❏ ${config.prefix}jpmswgc
❏ ${config.prefix}jpmch
❏ ${config.prefix}jpmchht
❏ ${config.prefix}autojpm
❏ ${config.prefix}autojpmswgc

━━━━━━━━━━━━━━━━━━━━━━

『 👥 GROUP MENU 』

❏ ${config.prefix}joinall
❏ ${config.prefix}swgc
❏ ${config.prefix}addgb

━━━━━━━━━━━━━━━━━━━━━━

『 🛠️ TOOLS 』

❏ ${config.prefix}ping
❏ ${config.prefix}pctc
❏ ${config.prefix}qr

━━━━━━━━━━━━━━━━━━━━━━

「 💎 ZEN STORE 」

⚡ WhatsApp Bot Premium

▰▰▰▰▰▰▰▰▰▰ 100%

© Powered By papizen`;

    try {
        // Cek apakah ada gambar menu
        if (fs.existsSync(config.menuImage)) {
            await sock.sendMessage(from, {
                image: fs.readFileSync(config.menuImage),
                caption: menuText
            }, { quoted: m });
        } else {
            // Kalo gambar gak ada, kirim text aja
            await sock.sendMessage(from, { text: menuText }, { quoted: m });
        }
    } catch (e) {
        console.error('Menu error:', e);
        await sock.sendMessage(from, { text: menuText }, { quoted: m });
    }
};
