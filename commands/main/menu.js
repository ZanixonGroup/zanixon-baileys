const moment = require('moment-timezone');

module.exports = [{
    name: "menu",
    aliases: ["help","?","list"],
    type: "main",
    details: {
        desc: "Menampilkan semua command bot"
    },
    code: async(zxn, m, { fs, utils, commands, args, prefix, text, name, zn, sender, pushName, remote, toUpper, toLower, isPremium, limit, totalUserRequest, isPublic }, { readmore }) => {
    	if(args[0]) {
    		let cmdName = args[0].toLowerCase();
    		let cmd = commands.get(name) || Array.from(commands.values()).find((v) => v.aliases.includes(name));
    		if(!cmd) {
    			return zxn.reply(m, zn.emoji("alert") + "Command tidak ditemukan!");
    		} else {
    			let info = `*Command Info:*
➭ Name: *${cmd.name}*
➭ Aliases: *${cmd.aliases}*
➭ Only Premium: *${cmd.isPremium ? "🟢" : "🔴"}*
➭ Only Owner: *${cmd.isOwner ? "🟢" : "🔴"}*
➭ Only Group: *${cmd.isGroup ? "🟢" : "🔴"}*
➭ Using Limit: *${cmd.isLimit ? "🟢" : "🔴"}*
➭ Only Group Admin: *${cmd.isAdmin ? "🟢" : "🔴"}*
➭ Description: *${cmd.details.desc}*

➭ Usage: *${cmd.details.usage.replace(/%prefix/gi, prefix).replace(/%command/gi, cmd.name).replace(/%text/gi, text)}*`; 
					return zxn.reply(m, info);
    		}
    	} else {
    		let listCmd = "";
    		let cmdtype = Object.keys(commands.type.sort());
    		for(let c in cmdtype) {
    			let type = commands.type[c];
    			type = type.replace("hidden", "")
    			let listType = commands.list[type];
    			if (type && listType && Array.isArray(listType)) {
    				let filter = listType.filter(v => v.disable.status == false).map((cmd) => {
    					let prem = cmd.isPremium ? "🄿" : "";
              let lim = cmd.isLimit ? "🄻" : "";
              return `┃ ❧ ${prefix + cmd.name} ${lim + prem}`;
    				});
            let list = filter.sort();
            listCmd += `\n╭╼━「 *${toUpper(type)}* 」\n`
            listCmd += `${list.join("\n")}\n`
            listCmd += `╰╼━━━━━━━━━━━━╾・\n`
    			}
    		}
	    	let menu = `*#SAVEPALESTINE🇵🇸 - #PRAYFORPALESTINE🇵🇸*
Halo *@${sender.split("@")[0]}*!
	
    ╭╼━「 *ZanixonMD* 」
    ┃ ❧ Owner: *ZTRdiamond*
    ┃ ❧ Mode: *${isPublic ? "Public" : "Self"}*
    ┃ ❧ Jam: *${moment().tz('Asia/Jakarta').format('HH:mm:ss')} WIB*
    ┃ ❧ Tanggal: *${moment().tz('Asia/Jakarta').format('DD MMM YY')}*
    ┃ ❧ Uptime: *${utils.uptime().short}*
    ┃ ❧ Cpu: *${utils.cpu()}%*
    ┃ ❧ Ram: *${utils.formatBytes(process.memoryUsage().rss)}*
    ┃ ❧ Command: *${zn.get("commandCount")} total*
    ┃ ❧ Prefix: ${prefix[0]}
    ┃ ❧ Opsi: -use, -desc, dan -info.
    ╰╼━━━━━━━━━━━━╾・
    	
    ╭╼━「 *User Info* 」
    ┃ ❧ Name: *${pushName}*
    ┃ ❧ Premium: *${zn.get("premium", sender, null, true) ? "🟢" : "🔴"}*
    ┃ ❧ Limit: *${zn.abbreviate(limit, "0.00a")}*
    ┃ ❧ Prefix: *${zn.get("prefix", sender, null, true)}*
    ┃ ❧ Total Request: *${zn.abbreviate(totalUserRequest, "0.00a")}*
    ╰╼━━━━━━━━━━━━╾・\n` + readmore() + "\n" + listCmd + `
\`\`\`
Powered by Zanixon Group™
\`\`\``; 
				let year = moment().tz('Asia/Jakarta').format('YYYY');

	    	zxn.reply(m, menu, { quoted: m }, { renderLargerThumbnail: true, sourceUrl: "https://chat.whatsapp.com/C7WMDga4RIF21hj2BSzg1c" });
    	}
   }
}]