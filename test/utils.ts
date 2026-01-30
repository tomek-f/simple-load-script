/**
 * Clear any existing scripts and content from the document
 */
export function clearTestEnvironment(): void {
    window.document.head.innerHTML = '';
    window.document.body.innerHTML = '';
}
