const fs = require('fs');
const path = require('path');

const datasetPath = path.join(__dirname,  'labeled_dataset.txt');

// Read the labeled dataset from the file
const labeledDataset = fs.readFileSync(datasetPath, 'utf8');
// Split the dataset into categories based on the '---' separator
const categories = labeledDataset.split('---');

// Define an object to store the parsed data
const parsedData = {};

// Parse each category
categories.forEach((category) => {
  // Split the category into lines
  const lines = category.trim().split('\n');
  
  // Extract the category name (e.g., 'Product Quality:')
  const categoryName = lines[0].replace(':', '');
  
  // Remove the category name from the lines
  const dataLines = lines.slice(1);
  
  // Store the parsed data for the category
  parsedData[categoryName] = dataLines.map((line) => line.trim());
});
module.exports = parsedData;


// Print the parsed data
//console.log(parsedData);
//console.log(typeof parsedData.slice === 'function');
