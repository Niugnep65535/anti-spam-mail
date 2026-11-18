export default {
  async email(message, env, ctx) {
    const blockList = [
      //"careless@mataroa.blog",
      //"careless@quailymail.com"
    ]
    const startsWith = [
      "careless",
      "market"
    ]

    const isSpam =
      blockList.includes(message.from) ||
      startsWith.some(prefix => message.from.startsWith(prefix));
    
    if (isSpam) {
      message.setReject("Still sending spam mails? Pathetic...");
      return;
    }
    await message.forward(env.FORWARD_EMAIL);
  }
}
