import * as fs from 'fs/promises';
import * as path from 'path';
import { ProfilePage } from '../pages/profile.page';

async function compareSelectors() {
    try {
        // Read window_dump.xml
        const xmlContent = await fs.readFile('window_dump.xml', 'utf-8');
        
        // Extract resource-ids from XML
        const resourceIdRegex = /resource-id="([^"]+)"/g;
        const xmlIds = new Set<string>();
        let match;
        
        while ((match = resourceIdRegex.exec(xmlContent)) !== null) {
            xmlIds.add(match[1]);
        }

        // Get selectors from ProfilePage
        const profileSelectors = Object.values(new ProfilePage(null as any).selectors)
            .map(selector => {
                const match = selector.match(/resourceId\("([^"]+)"\)/);
                return match ? match[1] : null;
            })
            .filter(Boolean);

        console.log('=== Comparison Results ===');
        
        // Check which selectors exist in XML
        console.log('\nSelectors in profile.page.ts that exist in window_dump.xml:');
        profileSelectors.forEach(selector => {
            if (xmlIds.has(selector!)) {
                console.log('✅', selector);
            }
        });

        console.log('\nSelectors in profile.page.ts that are missing from window_dump.xml:');
        profileSelectors.forEach(selector => {
            if (!xmlIds.has(selector!)) {
                console.log('❌', selector);
            }
        });

        console.log('\nResource IDs in window_dump.xml not used in profile.page.ts:');
        xmlIds.forEach(id => {
            if (id.includes('com.philo.philo') && !profileSelectors.includes(id)) {
                console.log('➕', id);
            }
        });

    } catch (error) {
        console.error('Failed to compare selectors:', error);
    }
}

compareSelectors(); 