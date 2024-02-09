module.exports = [{
  name: "tiktok",
  aliases: ["ttv","tiktokvideo", "tt", "ttimage", "tti", "tiktokimage"],
  type: "downloader",
  code: async(zxn, m, { global, remote, zn, text, alert, sendError, isUrl, formatSize, fs }, { ttdl, readmore }) => {
    try {
      if(!text) return zxn.reply(m, `${zn.emoji("failed")}︱Mana url tiktok nya?\n*Contoh:* .tiktok https://www.tiktok.com/@mythiavtuber/video/7317201792411028741`);
      if(!isUrl(text)) return zxn.reply(m, `${zn.emoji("alert")}︱Link tiktok tidak valid!`);
      
      // wait message
      zxn.reply(m, alert.wait);
      
      // download tiktok
      const result = await ttdl(text);
      if(!result.status) return zxn.reply(m, `${zn.emoji("failed")}︱Gagal mendownload konten!`);
      const data = result.data;
      if(data.type == "video") {
        const media = data.media[0];
        
        // check content size 
        if(media.size >= 100000000) return zxn.reply(m, alert.oversize);
        
        let caption = `*Tiktok Downloader:*
  ➭ Size: *${formatSize(media.size)}*
  ➭ Author: *${data.author.url}*
  ${readmore()}
  ${data.description}`;
        zxn.sendMedia(remote, media.url, m, { caption, mimetype: "video/mp4", fileName: "tiktokdl-zanixonmd.mp4" });
      } else if(data.type == "image") {
        let delayDuration = 5000;
        const mediaCount = data.media.length;
        let currentMedia = 0;
        if(mediaCount > 10) delayDuration = 15000;
        async function download() {
          try {
            if(currentMedia <= mediaCount) {
              const content = data.media[currentMedia];
              let mimetype = "image/png";
              let caption = `*Tiktok Downloader:*
➭ Delay: *${delayDuration / 1000}detik / media*
➭ Tipe: *${mimetype.split("/")[0]}*
➭ Size: *${formatSize(content.size)}*
➭ Author: *${data.author.url}*
➭ Urutan: *${currentMedia + 1}/${mediaCount}*
${readmore()}
${data.description}`;
              zxn.sendMedia(remote, content.url, m, { mimetype, caption });
              currentMedia++;
              setTimeout(download, delayDuration);
            }
          } catch (e) {
            return e;
          }
        }
        download().catch((e) => {
          sendError(e);
          return zxn.reply(m, alert.error);
        });
      }
    } catch (e) {
      sendError(e);
      return zxn.reply(m, alert.error)
    }
  }
},{
  name: "ttaudio",
  aliases: ["tiktokaudio", "tta"],
  type: "downloader",
  code: async(zxn, m, { global, remote, zn, text, alert, sendError, isUrl, formatSize, fs }, { ttdl, readmore }) => {
    try {
      if(!text) return zxn.reply(m, `${zn.emoji("failed")}︱Mana url tiktok nya?\n*Contoh:* .tiktok https://www.tiktok.com/@mythiavtuber/video/7317201792411028741`);
      if(!isUrl(text)) return zxn.reply(m, `${zn.emoji("alert")}︱Link tiktok tidak valid!`);
      
      // wait message
      zxn.reply(m, alert.wait);
      
      // download tiktok
      const result = await ttdl(text);
      const data = result.data;
      const media = data.music.playUrl;
      let caption = `*Tiktok Downloader:*
➭ Size: *${formatSize(data.music.size)}*
➭ Author: *${data.author.url}*
${readmore()}
${data.description}`;
      zxn.reply(m, caption, { quoted: m }, { thumbnailUrl: data.cover[0], renderLargerThumbnail: true })
      zxn.sendMedia(remote, media, m, { mimetype: "audio/mp4", fileName: "tiktokdl-zanixonmd.mp3" });
    } catch (e) {
      sendError(e);
      return zxn.reply(m, alert.error)
    }
  }
}]