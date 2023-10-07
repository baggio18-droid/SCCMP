const NaiveBayes = require("naivebayes");
const parsedData = require("./labeled_dataset.js");
const natural = require("natural");

// Function to split the dataset into training and testing
function splitDataset(dataset, splitRatio) {
  const categoryNames = Object.keys(dataset);
  const trainingData = {};
  const testingData = {};

  categoryNames.forEach((categoryName) => {
    const categoryData = dataset[categoryName];
    const splitIndex = Math.floor(categoryData.length * splitRatio);

    trainingData[categoryName] = categoryData.slice(0, splitIndex);
    testingData[categoryName] = categoryData.slice(splitIndex);
  });

  return { trainingData, testingData };
}

// Preprocessing function
function preprocessText(text) {
  // Lowercase conversion
  text = text.toLowerCase();

  // Removing punctuation
  const tokenizer = new natural.WordPunctTokenizer();
  const tokens = tokenizer.tokenize(text);
  const filteredTokens = tokens.filter((token) => !/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g.test(token));

  // Detecting numbers and replacing with placeholder token
  const processedTokens = filteredTokens.map((token) => {
    if (/^\d+$/.test(token)) {
      return "<NUM>";
    }
    return token;
  });

  // Detecting dates in the format "Month dayth" and replacing with placeholder token
  const dateRegex = /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(st|nd|rd|th)/i;
  const processedTokensWithDates = processedTokens.map((token) => {
    if (dateRegex.test(token)) {
      return "<DATE>";
    }
    return token;
  });

  // Removing stopwords
  const stopwords = new Set(natural.stopwords);
  const processedTokensWithoutStopwords = processedTokensWithDates.filter(
    (token) => !stopwords.has(token)
  );

  // Joining the processed tokens back into text
  const processedText = processedTokensWithoutStopwords.join(" ");

  return processedText;
}

const { trainingData, testingData } = splitDataset(parsedData, 0.8);

// Create a new NaiveBayes classifier
const classifier = new NaiveBayes({
  tokenizer: (text) => text.split(/\s+/),
});

// Training
for (const [category, docs] of Object.entries(testingData)) {
  for (const doc of docs) {
    const processedText = preprocessText(doc);
    classifier.learn(processedText, category);
  }
}

module.exports = { classifier, preprocessText };