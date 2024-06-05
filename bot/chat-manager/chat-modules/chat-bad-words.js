const {
  RegExpMatcher,
  TextCensor,
  englishDataset,
  englishRecommendedTransformers,
} = require("obscenity");

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});
const errorMessage = require("../error-message");

function chatBadWords(message, chatManagment) {
  const { enabled, punish, time, allowedRoles, disabledChannels } =
    chatManagment;

  console.log(allowedRoles, disabledChannels);

  if (!enabled) return;

  if (matcher.hasMatch(message.content)) {
    message.delete().catch((err) => console.error(err));

    errorMessage(
      message,
      "You are not allowed to use bad words in this server!",
      punish,
      time
    );
  }
}

module.exports = chatBadWords;
