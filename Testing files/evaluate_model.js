// Import required modules
const parsedData = require("./labeled_dataset.js");
const { classifier, preprocessText } = require("./model_training.js");

// Function to evaluate the model
function evaluateModel(testData) {
  let correctPredictions = 0;
  let totalPredictions = 0;
  const confusionMatrix = {};

  for (const [category, docs] of Object.entries(testData)) {
    confusionMatrix[category] = { truePositive: 0, falsePositive: 0, trueNegative: 0, falseNegative: 0 };

    for (const doc of docs) {
      const processedText = preprocessText(doc);
      const predictedCategory = classifier.categorize(processedText);

      if (predictedCategory === category) {
        correctPredictions++;
        confusionMatrix[category].truePositive++;
      } else {
        confusionMatrix[category].falseNegative++;
        confusionMatrix[predictedCategory].falsePositive++;
      }
      totalPredictions++;
    }
  }

  const accuracy = correctPredictions / totalPredictions;
  const evaluationMetrics = {};

  for (const category in confusionMatrix) {
    const { truePositive, falsePositive, falseNegative } = confusionMatrix[category];

    const precision = truePositive / (truePositive + falsePositive);
    const recall = truePositive / (truePositive + falseNegative);
    const f1 = (2 * precision * recall) / (precision + recall);

    evaluationMetrics[category] = { precision, recall, f1 };
  }

  return { accuracy, confusionMatrix, evaluationMetrics };
}

const categories = Object.keys(evaluationResult.evaluationMetrics);
let overallPrecision = 0;
let overallRecall = 0;
let overallF1 = 0;

let correctPredictions = 0;
let totalPredictions = 0;

for (const category of categories) {
  overallPrecision += evaluationResult.evaluationMetrics[category].precision;
  overallRecall += evaluationResult.evaluationMetrics[category].recall;
  overallF1 += evaluationResult.evaluationMetrics[category].f1;

  correctPredictions += evaluationResult.confusionMatrix[category].truePositive;
  correctPredictions += evaluationResult.confusionMatrix[category].trueNegative;

  totalPredictions +=
    evaluationResult.confusionMatrix[category].truePositive +
    evaluationResult.confusionMatrix[category].falsePositive +
    evaluationResult.confusionMatrix[category].falseNegative +
    evaluationResult.confusionMatrix[category].trueNegative;
}

overallPrecision /= categories.length;
overallRecall /= categories.length;
overallF1 /= categories.length;
const overallAccuracy = correctPredictions / totalPredictions;

console.log("\nOverall Model Performance:");
console.log(`Overall Accuracy: ${overallAccuracy.toFixed(2)}`);
console.log(`Average Precision: ${overallPrecision.toFixed(4)}`);
console.log(`Average Recall: ${overallRecall.toFixed(4)}`);
console.log(`Average F1-score: ${overallF1.toFixed(4)}`);
