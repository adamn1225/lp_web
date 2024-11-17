import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the path to the JSON file
const inputFilePath = join(__dirname, 'data.json');

// Define the path to the output file
const outputFilePath = join(__dirname, 'data.csv');

try {
    // Read the JSON data from the file
    const data = await readFile(inputFilePath, 'utf8');

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Extract the names and groups
    const namesAndGroups = jsonData.map(item => `${item.name},${item.group}`);

    // Add a header row
    namesAndGroups.unshift('Name,Group');

    // Join the names and groups into a single string with newlines
    const csvString = namesAndGroups.join('\n');

    // Write the CSV string to the output file
    await writeFile(outputFilePath, csvString, 'utf8');

    console.log('Names and groups have been written to data.csv');
} catch (err) {
    console.error('Error:', err);
}