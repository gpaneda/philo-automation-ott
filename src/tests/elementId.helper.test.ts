import { ElementIdHelper } from '../helpers/elementId.helper';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('ElementIdHelper Tests', () => {
    test('TC301 - should get all element IDs from current UI', async () => {
        // Get all element IDs
        const selectors = await ElementIdHelper.getAllElementIds();
        
        // Verify we got a non-empty object
        expect(selectors).toBeDefined();
        expect(Object.keys(selectors).length).toBeGreaterThan(0);
        
        // Verify the format of selectors
        for (const [key, value] of Object.entries(selectors)) {
            expect(typeof key).toBe('string');
            expect(value).toMatch(/^android=resourceId\("[\w./:]+"\)$/);
        }
    });

    test('TC302 - should get specific element selector', async () => {
        // First get all selectors to find a valid element name
        const allSelectors = await ElementIdHelper.getAllElementIds();
        const sampleElementName = Object.keys(allSelectors)[0];
        
        // Get a specific selector
        const selector = await ElementIdHelper.getElementSelector(sampleElementName);
        
        // Verify we got the correct selector
        expect(selector).toBeDefined();
        expect(selector).toBe(allSelectors[sampleElementName]);
    });

    test('TC303 - should return null for non-existent element', async () => {
        // Try to get a selector for a non-existent element
        const selector = await ElementIdHelper.getElementSelector('non_existent_element');
        
        // Verify we got null
        expect(selector).toBeNull();
    });

    test('TC304 - should create and read UI dump file', async () => {
        // Get the UI dump path
        const uiDumpPath = ElementIdHelper.getUiDumpPath();
        
        // Get all element IDs (this will create the dump file)
        await ElementIdHelper.getAllElementIds();
        
        // Verify the file exists
        const fileExists = await fs.access(uiDumpPath)
            .then(() => true)
            .catch(() => false);
        expect(fileExists).toBe(true);
        
        // Read the dump file
        const dumpContent = await ElementIdHelper.readUiDump();
        
        // Verify the content is XML
        expect(dumpContent).toContain('<?xml');
        expect(dumpContent).toContain('<hierarchy');
    });

    test('TC305 - should create formatted UI dump file', async () => {
        // Get all element IDs (this will create and format the dump file)
        await ElementIdHelper.getAllElementIds();
        
        // Get the formatted file path
        const formattedPath = path.join('src', 'config', 'ui_dump_formatted.xml');
        
        // Verify the formatted file exists
        const fileExists = await fs.access(formattedPath)
            .then(() => true)
            .catch(() => false);
        expect(fileExists).toBe(true);
        
        // Read the formatted content
        const formattedContent = await fs.readFile(formattedPath, 'utf-8');
        
        // Verify formatting
        expect(formattedContent).toContain('\n'); // Should have newlines
        expect(formattedContent).toContain('  '); // Should have indentation
        expect(formattedContent.split('\n').length).toBeGreaterThan(1); // Multiple lines
    });

    test('TC306 - should create simplified text dump', async () => {
        // Get all element IDs (this will create the simplified dump)
        await ElementIdHelper.getAllElementIds();
        
        // Get the simplified file path
        const simplifiedPath = path.join('src', 'config', 'txt_files', 'ui_dump_simplified.txt');
        
        // Verify the simplified file exists
        const fileExists = await fs.access(simplifiedPath)
            .then(() => true)
            .catch(() => false);
        expect(fileExists).toBe(true);
        
        // Read the simplified content
        const simplifiedContent = await fs.readFile(simplifiedPath, 'utf-8');
        
        // Verify format
        expect(simplifiedContent).toContain('Element: ');
        expect(simplifiedContent).toContain('resource-id: ');
        expect(simplifiedContent).toContain('bounds: ');
        expect(simplifiedContent.split('\n').length).toBeGreaterThan(1);
    });
}); 