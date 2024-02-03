const fs = require("fs");

function reload(file, options = {}) {
    nocache(file, module => console.log(`File "${file}" has updated`))
}

function nocache(module, callback = () => {}) {
  const modulePath = require.resolve(module);

  fs.watchFile(modulePath, async () => {
    await uncache(modulePath);
    callback(module);
  });
}

function uncache(module = '.') {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(module)];
      resolve();
    } catch (error) {
      reject(error);
    }
	});
}

module.exports = {
	reload,
	nocache,
	uncache
}