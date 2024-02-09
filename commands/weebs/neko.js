module.exports = [{
  name: "neko",
  type: "weebs",
  code: async(zxn, m, { remote, zn, text, sendError, alert }, { neko }) => {
    try {
      const data = await neko(text);
      let caption = `*Ini neko nya kak!*`;
      zxn.sendMedia(remote, data.url, m, { caption, mimetype: "image/png" });
    } catch (e) {
      sendError(e);
      return zxn.reply(m, alert.error);
    }
  }
}]