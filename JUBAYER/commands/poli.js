const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "poli",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Jubayer",
  description: "Generate image using Pollinations API",
  commandCategory: "image",
  usages: "[text]",
  cooldowns: 5
};

async function getBaseURL() {
  const res = await axios.get("https://raw.githubusercontent.com/VincentXJubayer/JUB4YE4/main/baseApiUrl.json");
  return res.data.jubayer;
}

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;
  
  if (!args[0]) {
    return api.sendMessage("🔍 Prompt koi? Deya lagbe.", threadID, messageID);
  }

  const prompt = args.join(" ").trim();
  const fileName = `poli_${Date.now()}.png`;
  const savePath = path.join(__dirname, "cache", fileName);

  try {
    const baseURL = await getBaseURL();
    const apiUrl = `${baseURL}/api/poli/generate`;

    const response = await axios.post(apiUrl, { prompt }, { responseType: "arraybuffer" });

    fs.writeFileSync(savePath, response.data);

    api.sendMessage({
      body: `🎨 Generated Image for Prompt: "${prompt}"`,
      attachment: fs.createReadStream(savePath)
    }, threadID, () => fs.unlinkSync(savePath), messageID);

  } catch (err) {
    console.error("❌ POLI Error:", err.message);
    api.sendMessage("⚠️ Couldn't generate image. API issue?", threadID, messageID);
  }
};
