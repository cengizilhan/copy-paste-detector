const fs = require('fs');
const path = require('path');
const acorn = require('acorn');
const walk = require('acorn-walk');

function getJsFiles(directory) {
    let jsFiles = [];
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.lstatSync(fullPath);

        if (stat.isDirectory()) {
            jsFiles = jsFiles.concat(getJsFiles(fullPath));
        } else if (path.extname(fullPath) === '.js') {
            jsFiles.push(fullPath);
        }
    });

    return jsFiles;
}

function parseFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const ast = acorn.parse(content, {
            locations: true,
            ecmaVersion: 'latest',
            sourceType: 'module'
        });
        const identifiers = [];

        walk.simple(ast, {
            VariableDeclarator(node) {
                if (node.id && node.id.name && node.id.name.length > 3) {
                    identifiers.push({ name: node.id.name, type: 'variable', line: node.loc.start.line, filePath });
                }
            },
            FunctionDeclaration(node) {
                if (node.id && node.id.name && node.id.name.length > 3) {
                    identifiers.push({ name: node.id.name, type: 'function', line: node.loc.start.line, filePath });
                }
            },
            ArrowFunctionExpression(node) {
                if (node.id && node.id.name && node.id.name.length > 3) {
                    identifiers.push({ name: node.id.name, type: 'function', line: node.loc.start.line, filePath });
                } else if (!node.id && 'anonymous'.length > 3) {
                    identifiers.push({ name: 'anonymous', type: 'function', line: node.loc.start.line, filePath });
                }
            }
        });

        return identifiers;
    } catch (error) {
        console.error(`Error parsing file ${filePath}:`, error);
        return [];
    }
}

async function main() {
    const scriptsPath = process.argv[2] || "scripts";
    const directory = path.resolve(__dirname, scriptsPath);
    const files = getJsFiles(directory);

    let allIdentifiers = [];

    files.forEach(file => {
        const identifiers = parseFile(file);
        allIdentifiers = allIdentifiers.concat(identifiers);
    });

    const groupedByIdentifier = allIdentifiers.reduce((acc, identifier) => {
        if (!acc[identifier.name] && identifier.name.length > 3) {
            acc[identifier.name] = {
                occurrences: [],
                count: 0,
                type: identifier.type
            };
        }
        if (acc[identifier.name] && acc[identifier.name].occurrences) {
            acc[identifier.name].occurrences.push({ line: identifier.line, filePath: identifier.filePath });
        }
        acc[identifier.name].count++;
        return acc;
    }, {});

    const result = Object.keys(groupedByIdentifier)
        .map(name => ({
            name,
            count: groupedByIdentifier[name].count,
            type: groupedByIdentifier[name].type,
            occurrences: groupedByIdentifier[name].occurrences
        }))
        .filter(item => item.count > 1 && item.name.length > 3);

    result.sort((a, b) => b.count - a.count);

    if (result.length > 0) {
        const outputPath = path.join(__dirname, 'copy-paste-detector-results.json');
        fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
        console.log(`Duplicated functions and variables written to ${outputPath}`);
    } else {
        console.log('No identifiers with more than one occurrence and more than three characters found.');
    }
}

main().catch(console.error);
