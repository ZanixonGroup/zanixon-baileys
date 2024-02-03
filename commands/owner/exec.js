let { exec: execS } = require("child_process")
const util = require("util")

module.exports = [{
    name: "exec",
    aliases: ["ex","$","$>"],
    desc: "Running Code terminal via Command",
    type: "owner",
    code: async(zxn, m, { remote, text }) => {
        if (!text) return zxn.reply(remote, `No query code`)
        execS(text, async (err, stdout) => {
            if (err) return zxn.reply(remote, err)
            if (stdout) return zxn.reply(remote, stdout)
        })
    },
    isOwner: true,
    nonPrefix: true
}]