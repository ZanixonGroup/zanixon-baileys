module.exports = [{
	name: "facebook",
	aliases: ["facebookdl","fbdl", "fb"],
	type: "downloader",
	code: async(zxn, m, { remote, sendError, zn, alert, formatSize, text, isUrl }, { fbdl, fbdlv2 }) => {
		let url = text;
		if(url == "") return zxn.reply(m, zn.emoji("failed") + `︱Mana url nya?\n*Contoh:* .fb https://facebook.com/share/v/DTkEoRZXXkJ88Wxe`)
		if(!isUrl(url)) return zxn.reply(m, alert.invalidUrl)
		zxn.reply(m, alert.wait);
		try {
			const res = await fbdl(url);
			const data = res.data;
			if(res.status) {
				try {
					if(data.size > 100000000) return zxn.reply(m, alert.oversize);
					let media = data.video;
					let size = formatSize(data.size);
					let caption = `*Facebook Downloader:*
➭ Caption: *${data.caption}*
➭ Size: *${formatSize(data.size)}*`;
					zxn.sendMedia(remote, media, m, { caption, mimetype: "video/mp4", fileName: "fbdl-znxn.mp4" });
				} catch (e) {
					sendError(e);
					zxn.reply(m, alert.error);
				}
			} else {
				zxn.reply(m, alert.error)
			}
		} catch (e) {
			sendError(e)
			return zxn.reply(m, alert.error)
		}
	}
}]