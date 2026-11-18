export default {
  async email(message, env, ctx) {
    // This list is used to block email addresses that match those on the list.
    const blackList = [
      "devnull@niugnep.idv.tw"
    ]

    // This list is used to block email addresses that begin with any of the entries listed.
    const startsWith = [
      "careless",
      "market"
    ]

    // This list is used to block email addresses that end with any of the entries listed.
    const endsWith = [
      "mcpcnserver.com"
    ]

    // Conditional Logic
    const isSpam =
      blackList.includes(message.from) ||  
      startsWith.some(prefix => message.from.startsWith(prefix)) ||
      endsWith.some(prefix => message.from.endsWith(prefix));
      
    // If this email address contains one of the items mentioned above, they will receive this error message:
    if (isSpam) {
      message.setReject("Still sending spam mails? Pathetic...");
      return;
    }
    // If not, the email will be forwarded directly.
    await message.forward(env.FORWARD_EMAIL);
  }
}
