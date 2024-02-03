module.exports = [{
	name: "tes",
	aliases: ["test"],
	type: "test",
	code: async(zanixon, m, { remote, from, text }, { waifu }) => { 
		const data = await waifu(text);
		let url = data.url;
		zanixon.sendMedia(remote, url, m, {
			caption: "Waifu generator",
			mimetype: "image/png",
			fileName: "waifu.png"
		});
	}
}]