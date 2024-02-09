module.exports = [{
  name: "remini",
  aliases: ["tohd", "hdr", "hd"],
  type: "exclusive",
  code: async(zxn, m, { zn, quoted, isQuoted, mime, sendError, alert },{ enhance }) => {
    try {
      zxn.reply(m, alert.wait);
      if(!/image\/(webp|jpe?g|png)/.test(mime)) return zxn.reply(m, `${zn.emoji("failed")}︱Media tidak valid!`)
      if(isQuoted) {
        const media = await zxn.downloadMediaMessage(quoted);
        const enhanced = await enhance(media);
        console.log(enhanced)
        zxn.reply(m, "Berhasil meningkatkan gambar!", { image: enhanced, mimetype: "image/png" });
      } else {
        const media = await zxn.downloadMediaMessage(m);
        const enhanced = await enhance(media);
        zxn.reply(m, "Berhasil meningkatkan gambar!", { image: enhanced, mimetype: "image/png" });
      }
    } catch (e) {
      sendError(e);
      zxn.reply(m, alert.error)
    }
  }
}]