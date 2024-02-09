module.exports = [{
	name: "layarkaca21",
	aliases: ["lk21"],
	type: "searcher",
	code: async(zxn, m, { alert, zn, text, sendError, utils, toLower }, { lk21 }) => {
		if(text == "") return zxn.reply(m, zn.emoji("failed") + `︱Kamu mau cari film apa?\n*Contoh:* .lk21 the town 2010`);
		try {
			const res = await lk21(text);
			let data = res.data;
			if(!res.status) return zxn.reply(m, alert.notfound);
			let list = "";
			let c = 1;
		  data.forEach((v) => {
		  	v.duration = v.duration.replace(" min", "")
		  	list += `*${c++}* - *${v.title}*
➭ Rating: *${v.rating} / ${v.bestRating} (${v.review})*
➭ Genre: *${v.genre}*
➭ Durasi: *${utils.parseUnix(Math.floor(Date.now() + utils.parseTime(v.duration.toLowerCase())))}*
➭ Created: *${v.dateCreated}*
➭ Nonton: *${v.url}*\n\n`
		  });
		  zxn.reply(m, `*✅︱Ditemukan ${data.length} hasil pencarian: ${text}*

${list}`)
		} catch (e) {
			sendError(e)
			return zxn.reply(m, alert.error);
		}
	}
}]