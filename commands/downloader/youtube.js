module.exports = [{
  name: "play",
  aliases: ["ytplay", "youtubeplay"],
  type: "downloader",
  code: async(zxn, m, { remote, zn, quoted, alert, text, sendError, formatSize }, { yts, ytv }) => {
    try {
      // checking parameter
      if(!text) return zxn.reply(m, zn.emoji("failed") + `︱Mana keyword nya?\n*Contoh:* .play koiiro mosawo`);
      
      // wait message
      zxn.reply(m, alert.wait);
      
      // searching video
      const searchingResult = await yts(text);
      const searchingData = searchingResult.data[0];
      
      // downloading media
      const videoResult = await ytv(searchingData.url);
      const data = videoResult.data;
      
      if(data.mediaSize > 100000000) return zxn.reply(m, alert.oversize);
      let media = data.media.url;
      let video = data.videoInfo;
      
      // caption message
		  let caption = `*YouTube Downloader:*
➭ Title: *${video.title}*
➭ View: *${zn.abbreviate(video.viewCount, "0.00a")}*
➭ Size: *${formatSize(data.mediaSize)}*`; 
      zxn.reply(m, caption, {}, {
        renderLargerThumbnail: true,
        title: video.title,
        body: "ZanixonMD | YouTube Downloader",
        thumbnailUrl: data.thumbnails.url,
        sourceUrl: "https://trakteer.id/zanixongroup"
      })
			zxn.sendMedia(remote, media, m, { mimetype: "audio/mp4", fileName: `${video.title}.mp3`, quoted: m });
    } catch (e) {
			sendError(e)
			return zxn.reply(m, alert.error)
		}
  }
},{
	name: "ytvideo",
	aliases: ["ytv","ytmp4","youtubevideo","youtubemp4"],
	type: "downloader",
	code: async(zxn, m, { remote, zn, alert, text, sendError, formatSize, isUrl }, { ytv }) => {
		let url = text;
		// checking parameter
		if(url == "") return zxn.reply(m, zn.emoji("failed") + `︱Mana url nya?\n*Contoh:* .ytv https://youtu.be/rKsQ-3N-Bks`);
		if(!isUrl(url)) return zxn.reply(m, alert.invalidUrl);
		
		// wait message
		zxn.reply(m, alert.wait);
		try {
		  // fetch video data using ytdl-core
			const res = await ytv(url);
			const data = res.data;
			if(res.status) {
				try {
				  // check media size
					if(data.mediaSize > 100000000) return zxn.reply(m, alert.oversize);
					let media = data.media.url; // content 
					let info = data.videoInfo; // video data
					
					// caption message
					let caption = `*YouTube Downloader:*
➭ Title: *${info.title}*
➭ View: *${zn.abbreviate(info.viewCount, "0.00a")}*
➭ Size: *${formatSize(data.mediaSize)}*`; 

          // send content
					zxn.sendMedia(remote, media, m, { caption, mimetype: "video/mp4", fileName: `${info.title}.mp4` });
				} catch (e) {
					sendError(e);
					zxn.reply(m, alert.error);}
			} else {
				zxn.reply(m, alert.error);
			}
		} catch (e) {
			sendError(e)
			return zxn.reply(m, alert.error)}
	}
},{
	name: "ytaudio",
	aliases: ["yta","ytmp3","youtubeaudio","youtubemp3"],
	type: "downloader",
	code: async(zxn, m, { remote, zn, alert, text, sendError, formatSize, isUrl }, { ytv }) => {
		let url = text;
		// checking parameter 
		if(url == "") return zxn.reply(m, zn.emoji("failed") + `︱Mana url nya?\n*Contoh:* .ytv https://youtu.be/rKsQ-3N-Bks`, { quoted: m });
		if(!isUrl(url)) return zxn.reply(m, alert.invalidUrl, { quoted: m });
		
		// wait message
		zxn.reply(m, alert.wait);
		try {
		  // fetch video data using ytdl-core
			const res = await ytv(url);
			const data = res.data;
			if(res.status) {
				try {
				  // check media size
					if(data.mediaSize > 16000000) return zxn.reply(m, alert.oversize);
					let media = data.media.url; // content
					let info = data.videoInfo; // video data
					
					// caption message
					let caption = `*YouTube Downloader:*
➭ Title: *${info.title}*
➭ View: *${zn.abbreviate(info.viewCount, "0.00a")}*
➭ Size: *${formatSize(data.mediaSize)}*`;  

          // send info message
					zxn.reply(m, caption, { quoted: m,
						contextInfo: {
							externalAdReply: {
								title: info.title,
								body: `ZanixonMD | YouTube Downloader`,
								mediaType: 1,
								previewType: 0,
								renderLargerThumbnail: true,
								thumbnailUrl: data.thumbnails.url,
								sourceUrl: "https://trakteer.id/zanixongroup"
							}
						}
					})
					
					// send content
					zxn.sendMedia(remote, media, m, { mimetype: "audio/mp4", fileName: `${info.title}.mp3` });
				} catch (e) {
					sendError(e);
					zxn.reply(m, alert.error);}
			} else {
				zxn.reply(m, alert.error);
			}
		} catch (e) {
			sendError(e)
			return zxn.reply(m, alert.error)}
	}
}]