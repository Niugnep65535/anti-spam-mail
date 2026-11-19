import rules from './blocklist.json';

export default {
  async email(message, env, ctx) {
    const sender = message.from.toLowerCase();

    const isSpam =
      rules.blackList.includes(sender) ||
      rules.startsWith.some(prefix => sender.startsWith(prefix)) ||
      rules.endsWith.some(suffix => sender.endsWith(suffix));

    if (isSpam) {
      message.setReject("Still sending spam mails? Pathetic...");
      return;
    }

    await message.forward(env.FORWARD_EMAIL);
  }
};
