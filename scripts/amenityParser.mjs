import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const results = [];

fs.createReadStream(path.resolve('scripts/Icons.csv')) // Update the path here
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        generateMappingFile(results);
    });

function generateMappingFile(data) {
    const imports = new Set();
    const mapping = {};

    data.forEach((row) => {
        const amenity = row.Name;
        const importStatement = row.Import;

        if (!importStatement) {
            console.error(`Missing import statement for amenity: ${amenity}`);
            return;
        }

        const iconNameMatch = importStatement.match(/import { (\w+) }/);
        const libraryMatch = importStatement.match(/from 'react-icons\/(\w+)'/);

        if (!iconNameMatch || !libraryMatch) {
            console.error(`Invalid import statement: ${importStatement}`);
            return;
        }

        const iconName = iconNameMatch[1];
        const library = libraryMatch[1];

        imports.add(importStatement);
        mapping[amenity] = `${library}.${iconName}`;
    });

    const importStatements = Array.from(imports).join('\n');
    const mappingObject = JSON.stringify(mapping, null, 2);

    const output = `
${importStatements}

export const amenitiesIcons = ${mappingObject};
`;

    fs.writeFileSync(path.resolve('src/lib/amenitiesIcons.ts'), output);
}