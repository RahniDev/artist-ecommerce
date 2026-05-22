export const LOCALES = ['de', 'es', 'fr', 'it'] as const;

export async function translateToAll(text: string): Promise<Record<string, string>> {
    const results: Record<string, string> = {};

    for (const locale of LOCALES) {
        const res = await fetch('https://api-free.deepl.com/v2/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_KEY}`
            },
            body: JSON.stringify({ text: [text], target_lang: locale.toUpperCase() })
        });
        const data = await res.json();
        results[locale] = data.translations[0].text;
    }

    return results;
}