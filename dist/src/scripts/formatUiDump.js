"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs/promises"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const xml2js = __importStar(require("xml2js"));
const path = __importStar(require("path"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function ensureDirectoryExists(dirPath) {
    try {
        await fs.access(dirPath);
    }
    catch (_a) {
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
        await fs.writeFile(path.join(xmlDir, 'formatted_channels_dump.xml'), formattedXml, 'utf-8');
        console.log('UI dump has been formatted and saved to src/config/xml_files/formatted_channels_dump.xml');
        // Create a simplified version with just resource-ids and text
        const simplifiedContent = extractRelevantInfo(result);
        await fs.writeFile(path.join(txtDir, 'simplified_channels_dump.txt'), simplifiedContent, 'utf-8');
        console.log('Simplified version saved to src/config/txt_files/simplified_channels_dump.txt');
    }
    catch (error) {
        console.error('Error formatting UI dump:', error);
    }
}
function extractRelevantInfo(jsonData, depth = 0) {
    let output = '';
    const indent = '  '.repeat(depth);
    function processNode(node) {
        if (node.$) {
            const { 'resource-id': resourceId, text, 'class': className, 'bounds': bounds } = node.$;
            if (resourceId || text) {
                output += `${indent}Element: ${className}\n`;
                if (resourceId)
                    output += `${indent}  resource-id: ${resourceId}\n`;
                if (text)
                    output += `${indent}  text: ${text}\n`;
                if (bounds)
                    output += `${indent}  bounds: ${bounds}\n`;
                output += '\n';
            }
        }
        if (node.node) {
            node.node.forEach((childNode) => {
                processNode(childNode);
            });
        }
    }
    processNode(jsonData.hierarchy);
    return output;
}
formatUiDump();
