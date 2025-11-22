document.addEventListener('DOMContentLoaded', () => {
    const logList = document.getElementById('log-list');
    const loader = document.getElementById('loader');

    async function probe(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (e) { return false; }
    }
    
    async function extractTitle(url) {
        try {
            const response = await fetch(url);
            const htmlText = await response.text();
            const titleMatch = htmlText.match(/<title>([\s\S]*?)<\/title>/i);
            return titleMatch ? titleMatch[1].trim() : "UNTITLED_LOG";
        } catch (e) { return "ACCESS_DENIED"; }
    }

    async function startScan() {
        let i = 1, filesFound = 0;
        const maxProbes = 100;

        for (i = 1; i <= maxProbes; i++) {
            const filename = `./blog${i}.html`;
            loader.textContent = `Pinging ${filename}...`;
            const exists = await probe(filename);

            if (exists) {
                filesFound++;
                loader.textContent = `Target locked: ${filename}. Extracting metadata...`;
                const title = await extractTitle(filename);

                // CSSの .link-list スタイルに適合させる！
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.href = filename;
                link.textContent = title;
                listItem.appendChild(link);
                
                logList.prepend(listItem); // 新しいものほど上
            } else {
                loader.textContent = `Scan complete. No response from blog${i}.html.`;
                break;
            }
        }
        
        setTimeout(() => {
            loader.textContent = filesFound > 0 ? `Operation finished. ${filesFound} log(s) found. Standing by.` : `Operation finished. No logs found. Standing by.`;
        }, 1000);
    }

    startScan();
});