import * as fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as xml2js from 'xml2js';
import * as path from 'path';

const execAsync = promisify(exec);

async function ensureDirectoryExists(dirPath: string) {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

async function formatUiDump() {
    try {
        // Ensure directories exist
        const configDir = './src/config';
        const xmlDir = path.join(configDir, 'xml_files');
        const txtDir = path.join(configDir, 'txt_files');
        
        await ensureDirectoryExists(xmlDir);
        await ensureDirectoryExists(txtDir);

        // First, get a fresh dump
        await execAsync('adb shell uiautomator dump /sdcard/channels_dump.xml');
        await execAsync(`adb pull /sdcard/channels_dump.xml ${path.join(xmlDir, 'channels_dump.xml')}`);

        // Read the XML file
        const xmlContent = await fs.readFile(path.join(xmlDir, 'channels_dump.xml'), 'utf-8');

        // Parse XML to JSON
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlContent);

        // Convert back to formatted XML
        const builder = new xml2js.Builder({
            renderOpts: {
                pretty: true,
                indent: '    ',
                newline: '\n'
            }
        });
        const formattedXml = builder.buildObject(result);

        // Write the formatted XML
        await fs.writeFile(
            path.join(xmlDir, 'formatted_channels_dump.xml'),
            formattedXml,
            'utf-8'
        );

        console.log('UI dump has been formatted and saved to src/config/xml_files/formatted_channels_dump.xml');

        // Create a simplified version with just resource-ids and text
        const simplifiedContent = extractRelevantInfo(result);
        await fs.writeFile(
            path.join(txtDir, 'simplified_channels_dump.txt'),
            simplifiedContent,
            'utf-8'
        );

        console.log('Simplified version saved to src/config/txt_files/simplified_channels_dump.txt');

    } catch (error) {
        console.error('Error formatting UI dump:', error);
    }
}

function extractRelevantInfo(jsonData: any, depth = 0): string {
    let output = '';
    const indent = '  '.repeat(depth);

    function processNode(node: any) {
        if (node.$) {
            const { 'resource-id': resourceId, text, 'class': className, 'bounds': bounds } = node.$;
            if (resourceId || text) {
                output += `${indent}Element: ${className}\n`;
                if (resourceId) output += `${indent}  resource-id: ${resourceId}\n`;
                if (text) output += `${indent}  text: ${text}\n`;
                if (bounds) output += `${indent}  bounds: ${bounds}\n`;
                output += '\n';
            }
        }

        if (node.node) {
            node.node.forEach((childNode: any) => {
                processNode(childNode);
            });
        }
    }

    processNode(jsonData.hierarchy);
    return output;
}

formatUiDump(); 