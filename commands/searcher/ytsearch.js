module.exports = [{
	name: "ytsearch",
	aliases: ["yts", "ys", "youtubesearch"],
	type: "searcher",
	code: async(zxn, m, { remote, sender, alert, text, zn, sendError }, { yts }) => {
		if(text == "") return zxn.reply(remote, alert.noquery + "\n*Contoh:* .yts mantra hujan kobo");
		try {
			const res = await yts(text);
			const data = res.data;
			if(!res.status) return zxn.reply(remote, alert.notfound);
			let list = "";
			let c = 1;
			let info = data[0];
			data.forEach((v) => {
				list += `*${c++}* - *${v.title}*
    ➭ Channel: *${v.author.name}*
    ➭ Channel url: *${v.author.url}*
    ➭ Tipe: *${v.type}*
    ➭ Upload: *${v.ago}*
    ➭ Views: *${zn.abbreviate(v.views, "0.00a")}*
    ➭ Video: *${v.url}*\n\n`;
			});
			let msg = await zxn.reply(remote, `*Ditemukan ${data.length} hasil dari pencarian:*\n\n${list}`, {
				contextInfo: {
					externalAdReply: {
						title: `Search: ${text}`,
						body: `ZanixonMD | YouTube Searcher`,
						mediaType: 1,
						previewType: 0,
						renderLargerThumbnail: true,
						thumbnailUrl: info.thumbnail,
						sourceUrl: "https://docs.zanixon.xyz"
					}
				}
			});
		} catch (e) {
			sendError(e)
			return zxn.reply(remote, alert.error)
		}
	}
}]