module.exports.config = {
  name: "balance",
  version: "1.2",
  hasPermssion: 0,
  credits: "Jubayer",
  description: "View your money or the money of the tagged person",
  commandCategory: "economy",
  usages: [
    "[no args]: View your money",
    "[@tag]: View the money of the tagged person"
  ],
  cooldowns: 5
};

module.exports.languages = {
  vi: {
    money: "Bạn đang có %1$",
    moneyOf: "%1 đang có %2$"
  },
  en: {
    money: "You have %1$",
    moneyOf: "%1 has %2$"
  }
};

module.exports.run = async function({ api, event, Users, getText }) {
  const formatBoldSerif = (text) => {
    const boldSerifMap = {
      a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡", i: "𝐢", j: "𝐣",
      k: "𝐤", l: "𝐥", m: "𝐦", n: "𝐧", o: "𝐨", p: "𝐩", q: "𝐪", r: "𝐫", s: "𝐬", t: "𝐭",
      u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱", y: "𝐲", z: "𝐳",
      A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇", I: "𝐈", J: "𝐉",
      K: "𝐊", L: "𝐋", M: "𝐌", N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑", S: "𝐒", T: "𝐓",
      U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙",
      "0": "𝟎", "1": "𝟏", "2": "𝟐", "3": "𝟑", "4": "𝟒", "5": "𝟓", "6": "𝟔", "7": "𝟕", "8": "𝟖", "9": "𝟗",
      "$": "$", ".": ".", ",": ",", ":": ":", "-": "-", " ": " "
    };
    return text.split("").map(char => boldSerifMap[char] || char).join("");
  };

  if (Object.keys(event.mentions).length > 0) {
    const uids = Object.keys(event.mentions);
    let msg = "";
    for (const uid of uids) {
      const userData = await Users.getData(uid);
      const userMoney = userData.money || 0;
      const name = event.mentions[uid].replace("@", "");
      msg += formatBoldSerif(getText("moneyOf", name, userMoney)) + "\n";
    }
    return api.sendMessage(msg.trim(), event.threadID, event.messageID);
  }

  const userData = await Users.getData(event.senderID);
  const userMoney = userData.money || 0;
  return api.sendMessage(formatBoldSerif(getText("money", userMoney)), event.threadID, event.messageID);
};
