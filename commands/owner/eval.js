const util = require("util")

module.exports = [{
    name: "eval",
    aliases: ["ev", ">", ">>", "=>"],
    desc: "Running JavaScript Code via Command",
    type: "owner",
    code: async(zxn, m, {
    		name,
    		store,
				zn,
				fs,
				fromMe,
				util,
				os,
				moment,
				utils,
				axios,
				listen,
				
				// message 
				alert,
				args,
				text,
				type,
				body,
				mime,
				mentions,
				
				// user 
				from,
				sender, 
				remote,
				quoted,
				pushName,
				
				// groups 
				isGroup,
				metadata,
				participants,
				participantIds,
				memberCount,
				groupAdmins,
				superAdmin,
				isAdmin,
				isSuperAdmin,
				isBotAdmin,
				isNsfw,
				
				// command
				prefix,
				command,
				cmd,
				commands,
				details,
				
				// checker 
				isBot,
				isOwner,
				isCmd,
				isQuoted,
				isMedia,
				isUrl, 
				
				// components 
				resizeImage, 
				getFile, 
				escapeRegExp, 
				parseFileSize, 
				formatSize, 
				fetchText, 
				fetchJson, 
				fetchBuffer,
				plugins,
				toUpper,
				toLower
    }) => {
				let evaled
        try {
            if (/await/.test(m.text)) {
                evaled = await eval(`(async () => { ${text} })`)
                return zxn.reply(remote, evaled)
            }
            evaled = await eval(text)
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled)
            await zxn.reply(remote, evaled)
        } catch (e) {
            zxn.reply(remote, util.format(e))
        }
    },
    isOwner: true,
    nonPrefix: true
}]