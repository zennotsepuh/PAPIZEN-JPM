const Helpers = require('../utils/helpers');

module.exports = {
    async joinall(sock, m, args, db) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const cleanSender = Helpers.cleanNumber(sender);

        if (!Helpers.isOwner(cleanSender, db.getOwners())) {
            return sock.sendMessage(from, { text: '❌ Owner only!' }, { quoted: m });
        }

        const link = args[0];
        if (!link) return sock.sendMessage(from, { text: 'Kasih link grupnya!' }, { quoted: m });

        try {
            const code = link.split('chat.whatsapp.com/')[1];
            if (!code) return sock.sendMessage(from, { text: '❌ Link gak valid!' }, { quoted: m });

            await sock.groupAcceptInvite(code);
            await sock.sendMessage(from, { text: '✅ Berhasil join grup!' }, { quoted: m });
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ Gagal join: ' + e.message }, { quoted: m });
        }
    },

    async swgc(sock, m, args, db) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const cleanSender = Helpers.cleanNumber(sender);

        if (!Helpers.isOwner(cleanSender, db.getOwners())) {
            return sock.sendMessage(from, { text: '❌ Owner only!' }, { quoted: m });
        }

        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: 'Kasih pesannya!' }, { quoted: m });

        // Logic SW GC
        await sock.sendMessage(from, { text: '🚀 SW GC dimulai...' }, { quoted: m });
    }
};
