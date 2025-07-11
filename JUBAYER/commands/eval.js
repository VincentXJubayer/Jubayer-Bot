module.exports.config = {
  name: "eval",
  version: "1.1.0",
  credits: "Jubayer",
  hasPermssion: 2,
  usePrefix: true,
  description: "Execute dynamic JS code",
  commandCategory: "developer tools",
  usages: "[JavaScript]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const send = (text) => {
    if (typeof text === "undefined") text = "undefined";
    else if (typeof text === "object") text = JSON.stringify(text, null, 2);
    else if (text instanceof Map) {
      let m = {};
      text.forEach((v, k) => (m[k] = v));
      text = `Map(${text.size}) → ${JSON.stringify(m, null, 2)}`;
    }
    else if (typeof text === "function") text = text.toString();

    api.sendMessage(String(text), event.threadID, event.messageID);
  };

  const jsCode = `
    (async () => {
      const request = require("axios");
      try {
        ${args.join(" ")}
      } catch (error) {
        console.error("JS Runtime Error:", error);
        api.sendMessage("⚠️ " + error.message, event.threadID, event.messageID);
      }
    })()
  `;

  try {
    eval(jsCode);
  } catch (criticalError) {
    api.sendMessage("❌ Critical error occurred:\n" + criticalError.stack, event.threadID, event.messageID);
  }
};
