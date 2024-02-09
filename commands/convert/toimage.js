module.exports = [{
	name: "toimage",
	aliases: ["toimg","tovideo","tovid"],
	type: "convert",
	code: async(zxn, m, { zn, remote, quoted, mime }, { pomf }) => { 
		try {
			const { webp2mp4File, webp2pngFile } = require("../../libs/sticker.js");
			let type = quoted.type;
			let media = null;
			zxn.reply(m, zn.emoji("wait") + `︱Tunggu sebentar, permintaan sedang diproses!`)
			if(quoted.msg.isAnimated == false) {
				let raw = await zxn.downloadMediaMessage(quoted);
				media = await webp2pngFile(raw);
				zxn.sendMedia(remote, media, m, { mimetype: "image/png", fileName: "sticker-to-image.png", caption: "Sticker to image!" });
			} else {
				let raw = await zxn.downloadMediaMessage(quoted);
				media = await webp2mp4File(raw);
				zxn.sendMedia(remote, media, m, { mimetype: "video/mp4", fileName: "sticker-to-video.mp4", caption: "Sticker to video!" });
			}
		} catch(e) {
			zxn.reply(m, zn.emoji("failed") + `︱Gagal mengkonversi sticker!`);
			console.log("Error at toimage.js:", e);
		}
	}
}]