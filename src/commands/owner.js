const Helpers = require('../utils/helpers');
const config = require('../utils/config');

module.exports = {
    async listgc(sock, m, db) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const cleanSender = Helpers.cleanNumber(sender);

        if (!Helpers.isOwner(cleanSender, db.getOwners())) {
            return sock.sendMessage(from, { text: '❌ Owner only!' }, { quoted: m });
        }

        try {
            const chats = await sock.groupFetchAllParticipating();
            const groups = Object.values(chats);
            
            let text = `📋 *LIST GROUP (${groups.length})*\n\n`;
            groups.forEach((g, i) => {
                text += `${i+1}. ${g.subject}\n`;
                text += `   ID: ${g.id}\n\n`;
            });

            await sock.sendMessage(from, { text }, { quoted: m });
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ Error ambil list GC!' }, { quoted: m });
        }
    },

    async addWL(sock, m, args, db) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const cleanSender = Helpers.cleanNumber(sender);

        if (!Helpers.isOwner(cleanSender, db.getOwners())) {
            return sock.sendMessage(from, { text: '❌ Owner only!' }, { quoted: m });
        }

        const target = args[0];
        if (!target) return sock.sendMessage(from, { text: 'Kasih nomornya!' }, { quoted: m });

        if (db.addWL(target)) {
            await sock.sendMessage(from, { text: `✅ ${target} ditambah ke whitelist!` }, { quoted: m });
        } else {
            await sock.sendMessage(from, { text: '⚠️ Udah ada di whitelist!' }, { quoted: m });
        }
    },

    async delWL(sock, m, args, db) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const cleanSender = Helpers.cleanNumber(sender);

        if (!Helpers.isOwner(cleanSender, db.getOwners())) {
            return sock.sendMessage(from, { text: '❌ Owner only!' }, { quoted: m });
        }

        const target = args[0];
        if (!target) return sock.sendMessage(from, { text: 'Kasih nomornya!' }, { quoted: m });

        if (db.delWL(target)) {
            await sock.sendMessage(from, { text: `✅ ${target} dihapus dari whitelist!` }, { quoted: m });
        } else {
            await sock.sendMessage(from, { text: '⚠️ Gak ada di whitelist!' }, { quoted: m });
        }
    },

    async cekWL(sock, m, db) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const cleanSender = Helpers.cleanNumber(sender);

        if (!Helpers.isOwner(cleanSender, db.getOwners())) {
            return sock.sendMessage(from, { text: '❌ Owner only!' }, { quoted: m });
        }

        const wl = db.getWL();
        let text = `📋 *WHITELIST (${wl.length})*\n\n`;
        wl.forEach((num, i) => {
            text += `${i+1}. ${num}\n`;
        });

        await sock.sendMessage(from, { text }, { quoted: m });
    }
};
