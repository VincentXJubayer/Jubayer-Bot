module.exports.config = {
  name: "pair",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Jubayer ", 
  description: "Create a bond image with mention",
  commandCategory: "fun-image",
  usages: "@tag someone",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const { downloadFile } = global.utils;

  const canvasDir = path.resolve(__dirname, "cache", "pairimg");
  const templatePath = path.join(canvasDir, "bond.png");

  if (!fs.existsSync(canvasDir)) fs.mkdirSync(canvasDir, { recursive: true });
  if (!fs.existsSync(templatePath)) await downloadFile("https://i.imgur.com/2bY5bSV.jpg", templatePath);
};

async function createBondImage(uid1, uid2) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];

  const baseDir = path.resolve(__dirname, "cache", "pairimg");
  const finalImg = path.join(baseDir, `bond_${uid1}_${uid2}.png`);
  const img1Path = path.join(baseDir, `img_${uid1}.png`);
  const img2Path = path.join(baseDir, `img_${uid2}.png`);

  const template = await jimp.read(path.join(baseDir, "bond.png"));

  const img1Buffer = (await axios.get(`https://graph.facebook.com/${uid1}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
  const img2Buffer = (await axios.get(`https://graph.facebook.com/${uid2}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;

  fs.writeFileSync(img1Path, Buffer.from(img1Buffer));
  fs.writeFileSync(img2Path, Buffer.from(img2Buffer));

  const avatar1 = await jimp.read(await cropCircle(img1Path));
  const avatar2 = await jimp.read(await cropCircle(img2Path));

  template.composite(avatar1.resize(191, 191), 93, 111);
  template.composite(avatar2.resize(190, 190), 434, 107);

  const result = await template.getBufferAsync("image/png");
  fs.writeFileSync(finalImg, result);

  fs.unlinkSync(img1Path);
  fs.unlinkSync(img2Path);

  return finalImg;
}

async function cropCircle(imagePath) {
  const jimp = require("jimp");
  const img = await jimp.read(imagePath);
  img.circle();
  return await img.getBufferAsync("image/png");
}

module.exports.run = async ({ event, api }) => {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID, mentions } = event;
  const mentionIDs = Object.keys(mentions);

  if (!mentionIDs.length) return api.sendMessage("🤨 কাউকে ট্যাগ তো কর পেয়ার বানানোর জন্য!", threadID, messageID);

  const first = senderID;
  const second = mentionIDs[0];

  try {
    const imagePath = await createBondImage(first, second);
    const msg = {
      body: "💞 𝑷𝒆𝒓𝒇𝒆𝒄𝒕 𝑷𝒂𝒊𝒓 𝑭𝒐𝒖𝒏𝒅 💞\n\n👫 Here’s your magical bond!",
      attachment: fs.createReadStream(imagePath)
    };
    api.sendMessage(msg, threadID, () => fs.unlinkSync(imagePath), messageID);
  } catch (err) {
    console.error(err);
    api.sendMessage("⚠️ কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন!", threadID, messageID);
  }
};
