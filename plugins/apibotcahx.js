require("../config.js");
const axios = require("axios");
const baseUrl = global.api.botcahx.base;
const apikey = global.api.botcahx.key;

module.exports = [{
	name: "lk21",
	code: async(query) => {
		let route = baseUrl + "webzone/lk21search?query=" + query + "&apikey=" + apikey;
		try {
			const res = await axios.get(route);
			if(res.data.result.length <= 0) return { status: false, msg: "No result!" };
			return { status: true, data: res?.data?.result };
		} catch (e) {
			return { status: false, error: e }
		}
	}
},{
	name: "remini",
	code: async(url) => {
		let route = baseUrl + `tools/remini?url=${url}&apikey=${apikey}`;
	}
}]