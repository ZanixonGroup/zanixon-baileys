let { exec: execS } = require("child_process")
const util = require("util")

module.exports = [{
    name: "exec",
    aliases: ["ex","$","$>"],
    desc: "Running Code terminal via Command",
    type: "owner",
    code: async(zxn, m, { remote, text }) => {
        if (!text) return zxn.reply(m, `No query code`)
        execS(text, async (err, stdout) => {
            if (err) return zxn.reply(m, err)
            if (stdout) return zxn.reply(m, stdout)
        })
    },
    isOwner: true,
    nonPrefix: true
}]