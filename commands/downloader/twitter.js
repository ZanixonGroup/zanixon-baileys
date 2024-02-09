module.exports = [{
  name: "twitter",
  aliases: ["tw", "twdl"],
  type: "downloader",
  code: async(zxn, m, { global, remote, zn, text, alert, sendError, isUrl, formatSize, fs }, { twdl, readmore }) => {
    try {
      if(!text) return zxn.reply(m, `${zn.emoji("failed")}︱Mana url video twitter nya?\n*Contoh:* .twitter https://twitter.com/tiebanonini/status/1706146039957459057`);
      if(!isUrl(text)) return zxn.reply(m, `${zn.emoji("alert")}︱Link video twitter tidak valid!`);
      
      // wait message 
      zxn.reply(m, alert.wait);
      
      // download content 
      const result = await twdl(text);
      if(!result.status) return zxn.reply(m, `${zn.emoji("failed")}︱Gagal mendownload konten!`);
      const data = result.data;
      
      // check content size 
      if(data.size >= 100000000) return zxn.reply(m, alert.oversize);
      
      let caption = `*Twitter Downloader:*
➭ Size: *${formatSize(data.size)}*
${readmore()}
${data.caption}`;
      zxn.sendMedia(remote, data.media, m, { caption, mimetype: "video/mp4", fileName: "twitterdl-zanixonmd.mp4" });
    } catch (e) {
      sendError(e);
      return zxn.reply(m, alert.error)
    }
  }
}]