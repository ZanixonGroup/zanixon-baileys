module.exports = [{
	name: "botstatus",
	aliases: ["status","botinfo"],
	type: "main",
	code: async(zxn, m, { remote }, { botinfo }) => {
		zxn.reply(m, await botinfo());
	}
}]