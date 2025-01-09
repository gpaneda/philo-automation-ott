import { AdbHelper } from './adb.helper';
import * as fs from 'fs/promises';
import * as path from 'path';
import { parseStringPromise } from 'xml2js';

export class ElementIdHelper {
    private static readonly UI_DUMP_PATH = path.join('src', 'config', 'ui_dump.xml');
    private static readonly FORMATTED_UI_DUMP_PATH = path.join('src', 'config', 'ui_dump_formatted.xml');
    private static readonly SIMPLIFIED_DUMP_PATH = path.join('src', 'config', 'txt_files', 'ui_dump_simplified.txt');

    /**
     * Creates a simplified text version of the UI dump
     * Formats each element with its key attributes in an easy-to-read format
     */
    static async createSimplifiedDump(): Promise<void> {
        try {
            const content = await this.readUiDump();
            const result = await parseStringPromise(content);
            
            let simplified = '';
            const processNode = (node: any, depth = 0) => {
                const indent = '  '.repeat(depth);
                
                // Add basic element info
                simplified += `${indent}Element: ${node.$.class}\n`;
                
                // Add important attributes
                if (node.$['resource-id']) {
                    simplified += `${indent}  resource-id: ${node.$['resource-id']}\n`;
                }
                if (node.$.bounds) {
                    simplified += `${indent}  bounds: ${node.$.bounds}\n`;
                }
                if (node.$['content-desc'] && node.$['content-desc'] !== '') {
                    simplified += `${indent}  content-desc: ${node.$['content-desc']}\n`;
                }
                if (node.$.text && node.$.text !== '') {
                    simplified += `${indent}  text: ${node.$.text}\n`;
                }
                
                simplified += '\n';
                
                // Process child nodes
                if (node.node) {
                    node.node.forEach((child: any) => processNode(child, depth + 1));
                }
            };
            
            processNode(result.hierarchy);
            
            // Ensure the directory exists
            await fs.mkdir(path.dirname(this.SIMPLIFIED_DUMP_PATH), { recursive: true });
            
            // Write the simplified content
            await fs.writeFile(this.SIMPLIFIED_DUMP_PATH, simplified, 'utf-8');
            
        } catch (error) {
            console.error('Failed to create simplified dump:', error);
            throw error;
        }
    }

    /**
     * Gets all element IDs from the current UI state
     * @returns A record of element IDs mapped to their selectors
     */
    static async getAllElementIds(): Promise<Record<string, string>> {
        try {
            // Dump the current UI hierarchy
            const uiDump = await AdbHelper.dumpUiHierarchy(this.UI_DUMP_PATH);
            
            // Format the UI dump for readability
            await this.formatUiDump();
            
            // Create simplified text dump
            await this.createSimplifiedDump();
            
            // Parse the UI dump to get element selectors
            const selectors = await AdbHelper.parseUiDump(uiDump);
            
            return selectors;
        } catch (error) {
            console.error('Failed to get element IDs:', error);
            throw error;
        }
    }

    /**
     * Gets a specific element ID selector if it exists in the current UI
     * @param elementName The short name of the element to find
     * @returns The selector string if found, null otherwise
     */
    static async getElementSelector(elementName: string): Promise<string | null> {
        try {
            const selectors = await this.getAllElementIds();
            return selectors[elementName] || null;
        } catch (error) {
            console.error(`Failed to get selector for element ${elementName}:`, error);
            throw error;
        }
    }

    /**
     * Gets the path to the UI dump file
     * @returns The absolute path to the UI dump file
     */
    static getUiDumpPath(): string {
        return path.resolve(this.UI_DUMP_PATH);
    }

    /**
     * Reads the current UI dump file contents
     * @returns The contents of the UI dump file
     */
    static async readUiDump(): Promise<string> {
        try {
            return await fs.readFile(this.UI_DUMP_PATH, 'utf-8');
        } catch (error) {
            console.error('Failed to read UI dump file:', error);
            throw error;
        }
    }

    /**
     * Formats the UI dump XML for better readability
     * Creates a new formatted file alongside the original
     */
    static async formatUiDump(): Promise<void> {
        try {
            const content = await this.readUiDump();
            
            // Add newlines and indentation
            let formatted = content
                .replace(/></g, '>\n<') // Add newline between elements
                .replace(/<\/([^>]+)>/g, '\n</$1>') // Add newline before closing tags
                .replace(/<([^/][^>]+)>/g, '\n<$1>'); // Add newline before opening tags
            
            // Add proper indentation
            const lines = formatted.split('\n').filter(line => line.trim());
            let indent = 0;
            formatted = lines.map(line => {
                if (line.match(/<\//)) {
                    indent--;
                }
                const indentedLine = '  '.repeat(Math.max(0, indent)) + line;
                if (line.match(/<[^/][^>]*[^/]>$/)) {
                    indent++;
                }
                return indentedLine;
            }).join('\n');
            
            // Write the formatted content to a new file
            await fs.writeFile(this.FORMATTED_UI_DUMP_PATH, formatted, 'utf-8');
            
        } catch (error) {
            console.error('Failed to format UI dump:', error);
            throw error;
        }
    }
} 