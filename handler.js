require("./config.js");
const colors = require("colors");
const fs = require('fs')
const util = require('util')
const { exec, spawn, execSync } = require("child_process")
const axios = require('axios');
const os = require('os')
const moment = require("moment-timezone");

module.exports = async (zxn, m, store, commands, plugins) => {

	try { 
		// modules 
		//if(m.isGroup == true) return;
		const zn = require("zanixon.db"); 
		const utils = require("./libs/utils.js");
		const listen = require("./libs/msgListener.js");
		const { resizeImage, getFile, escapeRegExp, parseFileSize, formatSize, isUrl, fetchText, fetchJson, fetchBuffer } = require("./libs/function.js");
		const { body, from, fromMe, isMedia, isQuoted, isOwner, isGroup, isBot, type } = m;
		const isPublic = zn.get("public", null, "config");
    let alert = {
    		noquery: `${zn.emoji("alert")}︱Kamu mau cari apa?`,
    		notfound: `${zn.emoji("failed")}︱Hasil dari permintaan anda tidak ada!`,
    		oversize: `${zn.emoji("alert")}︱Ukuran media terlalu besar dari batas yang diperbolehkan whatsapp!`,
    		invalidUrl: `${zn.emoji("alert")}︱Url tidak valid!`,
    		selfmode: `${zn.emoji("alert")}︱Bot sedang dalam mode self!`,
    		wait: `${zn.emoji("wait")}︱Tunggu sebentar, permintaan sedang diproses!`,
        owner: `${zn.emoji("alert")}︱Perintah ini hanya dapat digunakan oleh Owner!`,
        group: `${zn.emoji("alert")}︱Perintah ini hanya dapat digunakan di group!`,
        private: `${zn.emoji("alert")}︱Perintah ini hanya dapat digunakan di private chat!`,
        admin: `${zn.emoji("alert")}︱Perintah ini hanya dapat digunakan oleh admin group!`,
        botAdmin: `${zn.emoji("alert")}︱Bot bukan admin, jadi bot tidak dapat mengakses fitur tersebut`,
        bot: `${zn.emoji("warn")}︱Fitur ini hanya dapat diakses oleh Bot`,
        disable: `${zn.emoji("alert")}︱Fitur ini sedang dimatikan!`,
        media: `${zn.emoji("alert")}︱Balas media nya`,
        error: `${zn.emoji("failed")}︱Gagal saat memproses permintaan!`,
        premium: `${zn.emoji("alert")}︱Fitur ini khusus user premium!\n\nMinat jadi pengguna premium? cek keuntungan nya dengan ketik *.premium*`,
        limit: `${zn.emoji("alert")}︱Limit kamu telah habis untuk melakukan request command ini!`,
        nsfw: `${zn.emoji("alert")}︱Command *Nsfw* dalam mode *Off* di chat ini!`,
        cs: `${zn.emoji("alert")}︱Hubungi customer service kami untuk info lebih lanjut, ketik .cs atau .customerservice pada bot!`
    }
		
		// message 
    const args = m.args;
    const text = m.text;
		const quoted = m.isQuoted ? m.quoted : m;
		const mentions = quoted.mentions || m.mentions; 
		const mime = quoted.msg.mimetype || m.msg.mimetype;
    // @ type is in line 14
    // @ body is in line 14
    // @ isMedia is in line 14
    // @ isQuoted is in line 14
		
		// user 
    // @ from is in line 14
		const sender = m.key.participant || m.key.remoteJid; 
		const remote = m.key.remoteJid;
		const pushName = m.pushName;
		const limit = zn.get("limit", sender, "user");
		const isPremium = zn.get("premium", sender, "user") || false;
		const totalUserRequest = zn.get("totalRequest", null, "user") || 0;
		
		// group
		// @ isGroup is in line 14
		const metadata = m.metadata || {};
		const participants = metadata.participants || [{id: sender, admin: null}];
		const participantIds = participants.sort().map(v => v.id);
		const memberCount = participants.length || 0;
		const groupAdmins = isGroup ? participants.filter(v => v.admin == "admin" || v.admin == "superadmin").map(v => v.id) : [];
		const superAdmin = isGroup ? participants.filter(v => v.admin == "superadmin").map(v => v.id) : [];
		const isAdmin = isGroup ? groupAdmins.includes(sender) : false;
		const isSuperAdmin = isGroup ? superAdmin.includes(sender) : false;
		const isBotAdmin = isGroup ? groupAdmins.includes(zxn.user.id.replace(":3", "")) : false;
		const isNsfw = zn.get("isNsfw", remote, null, "user", false) || false;
		
		// command
		const prefix = [zn.get("prefix", sender, null, true) || zn.set("prefix", ".", sender, null, true)];
    const command = m.command;
    let cmd = commands.get(command) || Array.from(commands.values()).find((v) => v.aliases.find((x) => x.toLowerCase() == command)) || require("./zanixon/cmd.json");
    const isCmd = cmd.nonPrefix ? cmd.nonPrefix : body.startsWith(`${prefix}${command}`);
    const detraw = cmd.details || { desc: "none", usage: "%prefix%command" };
    const usage = `${detraw.usage}`.replace(/%prefix/gi, prefix).replace(/%command/gi, command).replace(/%text/gi, text);
    const desc = detraw.desc;
    const details = { desc: desc, usage: usage };
    
    // bot configs 
    if(!limit) return zn.set("limit", 100, sender, "user");
    if(cmd.name == undefined) return; 
    if(!isCmd) return;
    if(cmd.nonPrefix && fromMe) return;
    if (m) { 
      !fromMe ? console.log(`${colors.brightBlue(colors.bold(`[ PESAN ] >> Terkirim pukul ${colors.brightYellow(moment(m.timestamps).tz("Asia/Jakarta").format("HH:mm:ss"))} WIB | ${colors.brightYellow(moment(m.timestamps).tz("Asia/Jakarta").format("DD/MM/YYYY"))}`))}
>> ${colors.brightGreen(colors.bold(`Command:`)) + " " + cmd.name} 
>> ${colors.brightGreen(colors.bold(`Sender:`)) + " " + pushName + " " + sender} 
>> ${colors.brightGreen(colors.bold(`Premium:`)) + " " + false} 
>> ${colors.brightGreen(colors.bold(`From:`)) + " " + (pushName || metadata.subject) + " " + from} 
>> ${colors.brightGreen(colors.bold(`Type:`)) + " " + type} ${body.length ? "\n" + body.yellow : ""}
・------------------------------------------`) : null;
    }
    
    if(!isPublic) {
    	return m.reply(alert.selfmode);
    }
    
    if(cmd.disable.status && cmd) {
    	if(cmd.nonPrefix) return;
      m.reply(zn.emoji(cmd.disable.emoji) + cmd.disable.msg);
      return;
    }
    
    if(cmd.isOwner && !isOwner) {
    	return m.react("❌", m);
    }
    
    if(cmd.isPrivate && isGroup) {
    	return m.reply(alert.private)
    }
    
    if(cmd.isGroup && !isGroup) {
    	return m.reply(alert.group)
    }
    
    if(cmd.isAdmin && !isAdmin) {
    	return m.reply(alert.admin)
    }
    
    if(cmd.isBotAdmin && !isBotAdmin) {
    	return m.reply(alert.botAdmin)
    }
    
    if(cmd.isBot && !isBot) {
    	return m.reply(alert.bot)
    }
    
		try { 
			function sendError(err) {
				console.log(`${colors.brightYellow(`⚠️ >> Something error on file path: ${cmd.location}`)}\n${colors.brightRed(err)}`);
			}
			const commandOptions = {
				name: global.botName,
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
				isPremium,
				limit,
				totalUserRequest,
				
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
				sendError,
				toUpper: function(query) {
          return query.replace(/^\w/, c => c.toUpperCase())
        },
        toLower: function(query) {
          return query.replace(/^\w/, c => c.toLowerCase())
        }
			}
			//console.log("Command info:", cmd)
		  if(cmd.nonPrefix == true) {
		  	if(cmd.name.startsWith("auto")) {
		  		let cmdAuto = Array.from(commands.values()).filter(v => v.name.startsWith("auto_"));
		  		for(let cmd of cmdAuto) {
		  			await cmd.code(zxn, m, commandOptions, plugins)
		  		}
		  		return "ppq"
		  	} else {
					zxn.readMessages([m.key])
		  		return cmd.code(zxn, m, commandOptions, plugins)
		  	}
		  }
			zxn.readMessages([m.key])
		  cmd.code(zxn, m, commandOptions, plugins);
		} catch (e) {
			console.error("Error found at file location: " + cmd.location, e);
		}
	} catch (e) { 
		console.log("ZanixonMD:".main, "something error at handler.js \n".warn, e);
		process.exit()
		return null;
	}
}