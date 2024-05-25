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

const censor = new TextCensor();

function textCensor(text) {
  const matches = matcher.getAllMatches(text);
  const censored = censor.applyTo(text, matches);

  return censored;
}

module.exports = textCensor;
