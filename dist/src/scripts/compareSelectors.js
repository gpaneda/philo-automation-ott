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
const profile_page_1 = require("../pages/profile.page");
async function compareSelectors() {
    try {
        // Read window_dump.xml
        const xmlContent = await fs.readFile('window_dump.xml', 'utf-8');
        // Extract resource-ids from XML
        const resourceIdRegex = /resource-id="([^"]+)"/g;
        const xmlIds = new Set();
        let match;
        while ((match = resourceIdRegex.exec(xmlContent)) !== null) {
            xmlIds.add(match[1]);
        }
        // Get selectors from ProfilePage
        const profileSelectors = Object.values(new profile_page_1.ProfilePage(null).selectors)
            .map(selector => {
            const match = selector.match(/resourceId\("([^"]+)"\)/);
            return match ? match[1] : null;
        })
            .filter(Boolean);
        console.log('=== Comparison Results ===');
        // Check which selectors exist in XML
        console.log('\nSelectors in profile.page.ts that exist in window_dump.xml:');
        profileSelectors.forEach(selector => {
            if (xmlIds.has(selector)) {
                console.log('✅', selector);
            }
        });
        console.log('\nSelectors in profile.page.ts that are missing from window_dump.xml:');
        profileSelectors.forEach(selector => {
            if (!xmlIds.has(selector)) {
                console.log('❌', selector);
            }
        });
        console.log('\nResource IDs in window_dump.xml not used in profile.page.ts:');
        xmlIds.forEach(id => {
            if (id.includes('com.philo.philo') && !profileSelectors.includes(id)) {
                console.log('➕', id);
            }
        });
    }
    catch (error) {
        console.error('Failed to compare selectors:', error);
    }
}
compareSelectors();
