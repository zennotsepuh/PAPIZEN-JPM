const Helpers = require('../utils/helpers');
const config = require('../utils/config');

// State global buat JPM
let jpmState = {
    active: false,
    interval: null,
    target: '',
    message: '',
    autoJpmGroups: []
};

module.exports = {
    // JPM ke semua chat
    async jpm(sock, m, args, db) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const cleanSender = Helpers.cleanNumber(sender);

        if (!Helpers.isOwner(cleanSender, db.getOwners())) {
            return sock.sendMessage(from, { text: '❌ Lu bukan owner, asu!' }, { quoted: m });
        }

        const text = args.join(' ');
        if (!text) {
            return sock.sendMessage(from, { text: `Contoh: ${config.prefix}jpm Halo semua!` }, { quoted: m });
        }

        await sock.sendMessage(from, { text: '🚀 Memulai JPM ke semua chat...' }, { quoted: m });

        try {
            const chats = await sock.groupFetchAllParticipating();
            const groups = Object.values(chats);
            let count = 0;

            for (const group of groups) {
                try {
                    await sock.sendMessage(group.id, { text });
                    count++;
                    await Helpers.delay(config.jpmDelay);
                } catch (e) {
                    console.log(`Gagal kirim ke ${group.id}`);
                }
            }

            await sock.sendMessage(from, { 
                text: `✅ JPM selesai!\n📊 Terkirim: ${count}/${groups.length}` 
            }, { quoted: m });
        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { text: '❌ Error saat JPM!' }, { quoted: m });
        }
    },

    // JPM dengan hidetag
    async jpmht(sock, m, args, db) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const cleanSender = Helpers.cleanNumber(sender);

        if (!Helpers.isOwner(cleanSender, db.getOwners())) {
            return sock.sendMessage(from, { text: '❌ Lu bukan owner!' }, { quoted: m });
        }

        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: 'Kasih pesannya bang!' }, { quoted: m });

        await sock.sendMessage(from, { text: '🚀 JPM HiddeTag dimulai...' }, { quoted: m });

        try {
            const chats = await sock.groupFetchAllParticipating();
            const groups = Object.values(chats);
            let count = 0;

            for (const group of groups) {
                try {
                    const meta = await sock.groupMetadata(group.id);
                    const mentions = meta.participants.map(p => p.id);
                    
                    await sock.sendMessage(group.id, {
                        text: `@${group.id.split('@')[0]}\n\n${text}`,
                        mentions
                    });
                    
                    count++;
                    await Helpers.delay(config.jpmDelay);
                } catch (e) {}
            }

            await sock.sendMessage(from, { 
                text: `✅ JPM HT selesai!\n📊 Terkirim: ${count}/${groups.length}` 
            }, { quoted: m });
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ Error JPM HT!' }, { quoted: m });
        }
    },

    // JPM ke grup tertentu
    async jpmswgc(sock, m, args, db) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const cleanSender = Helpers.cleanNumber(sender);

        if (!Helpers.isOwner(cleanSender, db.getOwners())) {
            return sock.sendMessage(from, { text: '❌ Owner only!' }, { quoted: m });
        }

        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: 'Kasih pesannya!' }, { quoted: m });

        await sock.sendMessage(from, { text: '🚀 JPM SW Group dimulai...' }, { quoted: m });
        // Logic kirim ke grup yang di-target
    },

    // JPM ke semua channel
    async jpmch(sock, m, args, db) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const cleanSender = Helpers.cleanNumber(sender);

        if (!Helpers.isOwner(cleanSender, db.getOwners())) {
            return sock.sendMessage(from, { text: '❌ Owner only!' }, { quoted: m });
        }

        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: 'Kasih pesannya!' }, { quoted: m });

        await sock.sendMessage(from, { text: '🚀 JPM Channel dimulai...' }, { quoted: m });
        // Logic kirim ke semua channel
    },

    // Auto JPM
    async autojpm(sock, m, args, db) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const cleanSender = Helpers.cleanNumber(sender);

        if (!Helpers.isOwner(cleanSender, db.getOwners())) {
            return sock.sendMessage(from, { text: '❌ Owner only!' }, { quoted: m });
        }

        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: 'Kasih pesannya!' }, { quoted: m });

        if (jpmState.interval) {
            clearInterval(jpmState.interval);
        }

        jpmState.message = text;
        jpmState.active = true;

        jpmState.interval = setInterval(async () => {
            try {
                const chats = await sock.groupFetchAllParticipating();
                const groups = Object.values(chats);
                
                for (const group of groups) {
                    try {
                        await sock.sendMessage(group.id, { text });
                        await Helpers.delay(config.jpmDelay);
                    } catch (e) {}
                }
            } catch (e) {}
        }, config.autoJpmInterval);

        await sock.sendMessage(from, { 
            text: `✅ Auto JPM aktif!\n📝 Pesan: ${text}\n⏰ Interval: 1 menit` 
        }, { quoted: m });
    },

    // Stop JPM
    async stopjpm(sock, m, db) {
        const from = m.key.remoteJid;
        const sender = m.key.participant || m.key.remoteJid;
        const cleanSender = Helpers.cleanNumber(sender);

        if (!Helpers.isOwner(cleanSender, db.getOwners())) {
            return sock.sendMessage(from, { text: '❌ Owner only!' }, { quoted: m });
        }

        if (jpmState.interval) {
            clearInterval(jpmState.interval);
            jpmState.interval = null;
            jpmState.active = false;
            await sock.sendMessage(from, { text: '✅ Auto JPM dihentikan!' }, { quoted: m });
        } else {
            await sock.sendMessage(from, { text: '⚠️ Gak ada JPM yang jalan!' }, { quoted: m });
        }
    }
};
