const Helpers = require('../utils/helpers');
const axios = require('axios');
const os = require('os');

module.exports = {
    async ping(sock, m) {
        const from = m.key.remoteJid;
        const start = Date.now();
        const sent = await sock.sendMessage(from, { text: '🏓 Pinging...' }, { quoted: m });
        const latency = Date.now() - start;
        
        await sock.sendMessage(from, { 
            text: `🏓 *PONG!*\n⚡ Latency: ${latency}ms\n💻 Runtime: ${Helpers.getRuntime()}\n🧠 RAM: ${Helpers.getRAM()}` 
        }, { quoted: m });
    },

    async pctc(sock, m, args) {
        const from = m.key.remoteJid;
        const target = args[0];
        if (!target) return sock.sendMessage(from, { text: 'Kasih nomornya!' }, { quoted: m });

        try {
            await sock.sendMessage(from, { text: `🔍 Cek kontak: ${target}...` }, { quoted: m });
            const [result] = await sock.onWhatsApp(target + '@s.whatsapp.net');
            if (result) {
                await sock.sendMessage(from, { text: `✅ Terdaftar di WhatsApp!\n📱 JID: ${result.jid}` }, { quoted: m });
            } else {
                await sock.sendMessage(from, { text: '❌ Gak terdaftar di WhatsApp!' }, { quoted: m });
            }
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ Error cek nomor!' }, { quoted: m });
        }
    },

    async qr(sock, m, args) {
        const from = m.key.remoteJid;
        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: 'Kasih textnya!' }, { quoted: m });

        try {
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;
            await sock.sendMessage(from, {
                image: { url },
                caption: `✅ QR Code untuk: ${text}`
            }, { quoted: m });
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ Error bikin QR!' }, { quoted: m });
        }
    }
};
