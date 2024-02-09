const { writeExif } = require("../../libs/sticker.js");

module.exports = [{
	name: "sticker",
	aliases: ["s","stiker","setiker","wm","swm","sstickerwm","stikerwm"],
	type: "convert",
	code: async(zxn, m, { remote, alert, zn, from, quoted, msg, text, sendError }) => {
		zxn.reply(m, alert.wait);
		try {
			if(/image|video|webp/i.test(quoted.msg.mimetype)) { 
				if(quoted.msg.seconds > 9) return zxn.reply(m, `Max video 9 detik!`)
				const media = await zxn.downloadMediaMessage(quoted);
				const split = text.split("|");
				let exif = {
	      	packId: "https://ztrdiamond.vercel.app",
	      	packName: split[0] || zn.get("stickerPackname", null, "config"),
	      	packPublish: split[1] || zn.get("stickerAuthor", null, "config"),
	      	packWebsite: "https://ztrdiamond.vercel.app",
	      	emojis: [],
	      	isAvatar: 0,
	  		}
	  		let sticker = await writeExif({ mimetype: quoted.msg.mimetype, data: media }, exif) 
				zxn.sendMessage(remote, { sticker }, { quoted: m })
			} else {
				zxn.reply(m, `${zn.emoji("failed")}︱Tipe media tidak didukung!`);
			}
		} catch(e) {
			sendError(e);
			zxn.reply(m, alert.error)
		}
	}
}]