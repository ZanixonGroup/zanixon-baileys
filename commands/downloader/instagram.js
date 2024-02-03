module.exports = [{
  name: "instagram",
  aliases: ["ig", "igdl", "instagramdl"],
  type: "downloader",
  code: async(zxn, m, { axios, remote, zn, alert, text, sendError, formatSize, isUrl }, { igdl }) => {
    try {
      // check input and url
      if(!text) return zxn.reply(remote, `${zn.emoji("failed")}︱Mana url post instagram nya?\n*Contoh:* .ig https://instagram.com/p/C2opvtpBwyC`);
      if(!isUrl(text)) return zxn.reply(remote, `Link instagram tidak valid!`);
      
      // wait msg 
      zxn.reply(remote, alert.wait);
      
      // download content 
      const result = await igdl(text);
      if(!result.status) return zxn.reply(remote, `${zn.emoji("failed")}︱Gagal mendownload konten!`);
      const data = result.data;
      let delayDuration = 5000;
      let mediaCount = data.length;
      let currentMedia = 0;
      if(mediaCount > 10) delayDuration = 15000;
      async function download() {
        try {
          if(currentMedia <= mediaCount) {
            let content = data[currentMedia];
            let mimetype = await axios.get(content.url).then(res => res.headers.get("content-type"));
            let caption = `*Instagram Downloader:*
➭ Delay: *${delayDuration / 1000}detik / media*
➭ Tipe: *${mimetype.split("/")[0]}*
➭ Urutan: *${currentMedia + 1}/${mediaCount}*`;
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
        zxn.reply(remote, alert.error);
      })
    } catch (e) {
      sendError(e);
      zxn.reply(remote, alert.error);
    }
  }
}]