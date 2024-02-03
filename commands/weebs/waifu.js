module.exports = [{
  name: "waifu",
  type: "weebs",
  code: async(zxn, m, { remote, zn, text, sendError, alert }, { waifu }) => {
    try {
      const data = await waifu(text);
      let caption = `*Ini waifu nya kak!*`;
      zxn.sendMedia(remote, data.url, m, { caption, mimetype: "image/png" });
    } catch (e) {
      sendError(e);
      return zxn.reply(remote, alert.error);
    }
  }
}]