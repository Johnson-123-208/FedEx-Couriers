// Scraper utility functions

import { Page } from 'playwright';

/**
 * Wait for element with retry
 */
export async function waitForSelector(
    page: Page,
    selector: string,
    timeout: number = 10000
): Promise<boolean> {
    try {
        await page.waitForSelector(selector, { timeout, state: 'visible' });
        return true;
    } catch {
        return false;
    }
}

/**
 * Extract text from element
 */
export async function extractText(
    page: Page,
    selector: string,
    defaultValue: string = ''
): Promise<string> {
    try {
        const element = await page.$(selector);
        if (!element) return defaultValue;

        const text = await element.textContent();
        return text?.trim() || defaultValue;
    } catch {
        return defaultValue;
    }
}

/**
 * Extract multiple texts from elements
 */
export async function extractTexts(
    page: Page,
    selector: string
): Promise<string[]> {
    try {
        const elements = await page.$$(selector);
        const texts = await Promise.all(
            elements.map(async (el) => {
                const text = await el.textContent();
                return text?.trim() || '';
            })
        );
        return texts.filter(Boolean);
    } catch {
        return [];
    }
}

/**
 * Fill form input
 */
export async function fillInput(
    page: Page,
    selector: string,
    value: string
): Promise<void> {
    await page.fill(selector, value);
}

/**
 * Click element with retry
 */
export async function clickElement(
    page: Page,
    selector: string,
    timeout: number = 5000
): Promise<void> {
    await page.click(selector, { timeout });
}

/**
 * Submit form and wait for response
 */
export async function submitForm(
    page: Page,
    formSelector: string,
    submitSelector: string
): Promise<void> {
    await clickElement(page, submitSelector);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
}

/**
 * Extract table data
 */
export async function extractTable(
    page: Page,
    tableSelector: string
): Promise<Array<Record<string, string>>> {
    try {
        const rows = await page.$$(`${tableSelector} tr`);
        const data: Array<Record<string, string>> = [];

        for (const row of rows) {
            const cells = await row.$$('td, th');
            const rowData: Record<string, string> = {};

            for (let i = 0; i < cells.length; i++) {
                const text = await cells[i].textContent();
                rowData[`col${i}`] = text?.trim() || '';
            }

            if (Object.keys(rowData).length > 0) {
                data.push(rowData);
            }
        }

        return data;
    } catch {
        return [];
    }
}

/**
 * Take screenshot for debugging
 */
export async function takeScreenshot(
    page: Page,
    path: string
): Promise<void> {
    await page.screenshot({ path, fullPage: true });
}

/**
 * Parse date string to ISO format
 */
export function parseDate(dateStr: string): string | null {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        return date.toISOString();
    } catch {
        return null;
    }
}

/**
 * Clean and normalize text
 */
export function cleanText(text: string): string {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .trim();
}
