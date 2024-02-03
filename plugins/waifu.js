const axios = require("axios");

module.exports = [{
	name: "waifu",
	details: {
		desc: "Generate random waifu",
		usage: "await waifu()"
	},
	code: async(mode) => {
		mode = mode ? mode : "sfw";
		try {
			let url;
            if(mode == "sfw") {
                url = `https://api.waifu.pics/sfw/waifu`;
            } else if(mode == "nsfw") {
                url = `https://api.waifu.pics/nsfw/waifu`
            } else {
                url = `https://api.waifu.pics/sfw/waifu`;
            }
			const res = await axios.get(url);
			let data = res.data;
			data.api = url;
			return data;
		} catch (e) {
			console.log("Error at waifu.js plugin:", e);
			return {};
		}
	}
}]