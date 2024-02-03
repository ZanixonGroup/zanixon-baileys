const axios = require("axios");

module.exports = [{
	name: "neko",
	details: {
		desc: "Generate random neko",
		usage: "await neko()"
	},
	code: async(mode) => {
		mode = mode ? mode : "sfw";
		try {
			let url;
            if(mode == "sfw") {
                url = `https://api.waifu.pics/sfw/neko`;
            } else if(mode == "nsfw") {
                url = `https://api.waifu.pics/nsfw/neko`
            } else {
                url = `https://api.waifu.pics/sfw/neko`;
            }
			const res = await axios.get(url);
			let data = res.data;
			data.api = url;
			return data;
		} catch (e) {
			console.log("Error at neko.js pluginsss:", e);
			return {};
		}
	}
}]