// Simple BibTeX parser for citation data
class BibtexParser {
    constructor() {
        this.entries = {};
    }

    // Strip % comments only when NOT inside a value (no braces/quotes) and not escaped
    static stripCommentsSmart(bib) {
        let out = '';
        let depth = 0;        // { .. } nesting level
        let inQuotes = false; // " .. "
        let escaped = false;

        for (let i = 0; i < bib.length; i++) {
            const ch = bib[i];

            if (escaped) { 
                out += ch; 
                escaped = false; 
                continue; 
            }
            if (ch === '\\') { 
                out += ch; 
                escaped = true; 
                continue; 
            }

            if (ch === '"' && depth === 0) { 
                inQuotes = !inQuotes; 
                out += ch; 
                continue; 
            }
            if (ch === '{') { 
                depth++; 
                out += ch; 
                continue; 
            }
            if (ch === '}') { 
                depth = Math.max(0, depth - 1); 
                out += ch; 
                continue; 
            }

            // Only strip % comments when not inside a value
            if (ch === '%' && !inQuotes && depth === 0) {
                // skip to end of line
                while (i < bib.length && bib[i] !== '\n') i++;
                out += '\n';
                continue;
            }

            out += ch;
        }
        return out;
    }

    parse(bibtexContent) {
        this.entries = {};

        // Remove comments
        const cleanContent = BibtexParser.stripCommentsSmart(bibtexContent).trim();

        // Use a simpler approach that doesn't rely on complex regex
        const entries = [];
        let currentPos = 0;
        
        while (true) {
            // Look for both @article{ and @Article{
            const articleStart = cleanContent.indexOf('@article{', currentPos);
            const ArticleStart = cleanContent.indexOf('@Article{', currentPos);
            
            let entryStart = -1;
            let keyOffset = 9; // length of '@article{'
            
            if (articleStart === -1 && ArticleStart === -1) break;
            
            if (articleStart === -1) {
                entryStart = ArticleStart;
                keyOffset = 9; // length of '@Article{'
            } else if (ArticleStart === -1) {
                entryStart = articleStart;
                keyOffset = 9;
            } else {
                entryStart = Math.min(articleStart, ArticleStart);
                keyOffset = (entryStart === articleStart) ? 9 : 9;
            }
            
            // Find the key
            const keyStart = entryStart + keyOffset;
            const keyEnd = cleanContent.indexOf(',', keyStart);
            const key = cleanContent.substring(keyStart, keyEnd).trim();
            
            // Find the end of this entry (next @article/@Article or end of content)
            const nextArticle = cleanContent.indexOf('\n@article{', entryStart + 1);
            const nextArticleCapital = cleanContent.indexOf('\n@Article{', entryStart + 1);
            
            let nextEntry = -1;
            if (nextArticle === -1 && nextArticleCapital === -1) {
                nextEntry = -1;
            } else if (nextArticle === -1) {
                nextEntry = nextArticleCapital;
            } else if (nextArticleCapital === -1) {
                nextEntry = nextArticle;
            } else {
                nextEntry = Math.min(nextArticle, nextArticleCapital);
            }
            
            const entryEnd = nextEntry === -1 ? cleanContent.length : nextEntry;
            
            // Extract the content between the key and the end
            const contentStart = keyEnd + 1; // after the comma
            const entryContent = cleanContent.substring(contentStart, entryEnd).trim();
            // Remove the final closing brace
            const cleanEntryContent = entryContent.replace(/\}\s*$/, '');
            
            entries.push({ key, content: cleanEntryContent });
            currentPos = entryEnd;
        }

        console.log(`Found ${entries.length} entries`);

        for (const { key, content } of entries) {
            console.log(`Processing entry: ${key}`);
            if (key === 'RONY2019Biomass') {
                console.log(`RONY2019Biomass content:`, content.substring(0, 200) + '...');
            }
            const entry = this.parseEntry('article', key, content);
            if (key === 'RONY2019Biomass') {
                console.log(`RONY2019Biomass parsed author:`, entry.author);
                console.log(`RONY2019Biomass all fields:`, Object.keys(entry));
            }
            this.entries[key] = entry;
        }

        console.log('All parsed entries:', Object.keys(this.entries));
        console.log('RONY2019Biomass in entries:', 'RONY2019Biomass' in this.entries);
        if ('RONY2019Biomass' in this.entries) {
            console.log('RONY2019Biomass entry:', this.entries['RONY2019Biomass']);
        }
        return this.entries;
    }

    // Read balanced value (handles braces, quotes, barewords)
    static _readBalancedValue(str, i) {
        const n = str.length;
        while (i < n && /\s|,/.test(str[i])) i++;   // skip spaces/commas before value
        if (i >= n) return { value: "", end: i };

        const ch = str[i];

        // { ... } with nested braces - handle backslashes properly
        if (ch === "{") {
            let depth = 0;
            let j = i;
            while (j < n) {
                const c = str[j];
                
                // Handle backslash escapes - treat next character as literal
                if (c === "\\" && j + 1 < n) {
                    j += 2; // skip both the backslash and the escaped character
                    continue;
                }
                
                if (c === "{") depth++;
                else if (c === "}") {
                    depth--;
                    if (depth === 0) {
                        j++; // include the closing brace
                        break;
                    }
                }
                j++;
            }
            const extractedValue = str.slice(i + 1, j - 1);
            console.log(`Extracted brace value (length ${extractedValue.length}):`, extractedValue.substring(0, 50) + '...');
            return { value: extractedValue, end: j };
        }

        // " ... " with escapes
        if (ch === '"') {
            let j = i + 1, out = "";
            while (j < n) {
                const c = str[j++];
                if (c === '"' && str[j - 2] !== "\\") break; // unescaped quote ends
                out += c;
            }
            return { value: out, end: j };
        }

        // bareword (e.g., month = apr)
        let j = i;
        while (j < n && /[^\s,}]/.test(str[j])) j++;
        return { value: str.slice(i, j), end: j };
    }

    parseEntry(type, key, content) {
        const entry = { type, key };
        let i = 0;
        const n = content.length;

        while (i < n) {
            // skip spaces/commas/newlines
            while (i < n && /[\s,]/.test(content[i])) i++;
            if (i >= n) break;

            // read field name
            const nameStart = i;
            while (i < n && /\w/.test(content[i])) i++;
            if (i === nameStart) { 
                i++; 
                continue; 
            } // skip junk
            const fieldName = content.slice(nameStart, i).toLowerCase();

            // skip spaces and '='
            while (i < n && /\s/.test(content[i])) i++;
            if (content[i] !== "=") {
                // malformed; skip to next comma/line
                while (i < n && content[i] !== "," && content[i] !== "\n") i++;
                if (content[i] === ",") i++;
                continue;
            }
            i++; // past '='

            // read value (balanced braces, quotes, or bareword)
            const { value, end } = BibtexParser._readBalancedValue(content, i);
            i = end;

            const cleanValue = this.cleanLatexText(value.trim());
            entry[fieldName] = cleanValue;
            
            // Debug for RONY2019Biomass
            if (key === 'RONY2019Biomass' && fieldName === 'author') {
                console.log(`RONY2019Biomass author field: "${cleanValue}"`);
            }

            // skip trailing spaces and optional comma
            while (i < n && /\s/.test(content[i])) i++;
            if (content[i] === ",") i++;
        }

        return entry;
    }

    // Clean LaTeX formatting from text
    cleanLatexText(text) {
        if (!text) return text;
        
        return text
            // Convert LaTeX escape sequences to regular characters
            .replace(/\\%/g, '%')           // \% -> %
            .replace(/\\\$/g, '$')          // \$ -> $
            .replace(/\\&/g, '&')           // \& -> &
            .replace(/\\#/g, '#')           // \# -> #
            .replace(/\\_/g, '_')           // \_ -> _
            .replace(/\\\^/g, '^')          // \^ -> ^
            .replace(/\\\\/g, '\\')         // \\ -> \
            .replace(/\\~/g, '~')           // \~ -> ~
            .replace(/\\\{/g, '{')          // \{ -> {
            .replace(/\\\}/g, '}')          // \} -> }
            
            // Handle LaTeX commands
            .replace(/\\textbf\{([^}]+)\}/g, '$1')      // \textbf{text} -> text
            .replace(/\\textit\{([^}]+)\}/g, '$1')      // \textit{text} -> text
            .replace(/\\emph\{([^}]+)\}/g, '$1')        // \emph{text} -> text
            .replace(/\\url\{([^}]+)\}/g, '$1')         // \url{text} -> text
            
            // Handle special characters and spacing
            .replace(/\\~\{\}/g, '~')       // \~{} -> ~
            .replace(/\\\s+/g, ' ')         // backslash followed by spaces -> single space
            
            // Clean up extra spaces
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Get entry by key
    getEntry(key) {
        return this.entries[key];
    }

    // Get abstract for an entry
    getAbstract(key) {
        const entry = this.entries[key];
        return entry ? entry.abstract || 'No abstract available.' : 'Entry not found.';
    }

    // Get title for an entry
    getTitle(key) {
        const entry = this.entries[key];
        return entry ? entry.title || 'No title available.' : 'Entry not found.';
    }

    // Get publication URL (DOI or URL)
    getPublicationUrl(key) {
        const entry = this.entries[key];
        if (!entry) return null;

        if (entry.doi) {
            return `https://doi.org/${entry.doi}`;
        } else if (entry.url) {
            return entry.url;
        }

        return null;
    }

    // Convert entry to BibTeX format
    toBibtex(key) {
        const entry = this.entries[key];
        if (!entry) return '';

        let bibtex = `@${entry.type}{${entry.key},\n`;

        const fieldOrder = ['title', 'author', 'journal', 'booktitle', 'year', 'volume', 'number', 'pages', 'publisher', 'doi', 'url'];

        fieldOrder.forEach(field => {
            if (entry[field]) {
                bibtex += `  ${field}={${entry[field]}},\n`;
            }
        });

        // Add any remaining fields
        Object.keys(entry).forEach(field => {
            if (!fieldOrder.includes(field) && field !== 'type' && field !== 'key') {
                bibtex += `  ${field}={${entry[field]}},\n`;
            }
        });

        bibtex = bibtex.replace(/,\n$/, '\n'); // Remove trailing comma
        bibtex += '}';

        return bibtex;
    }

    // Convert entry to APA format
    toAPA(key) {
        const entry = this.entries[key];
        if (!entry) return '';

        let apa = '';

        // Authors
        if (entry.author) {
            const authors = this.formatAuthorsAPA(entry.author);
            apa += authors;
        }

        // Year
        if (entry.year) {
            apa += ` (${entry.year}).`;
        }

        // Title
        if (entry.title) {
            apa += ` ${entry.title}.`;
        }

        // Journal/Conference
        if (entry.journal) {
            apa += ` *${entry.journal}*`;
        } else if (entry.booktitle) {
            apa += ` *${entry.booktitle}*`;
        }

        // Volume and number
        if (entry.volume) {
            apa += `, ${entry.volume}`;
            if (entry.number) {
                apa += `(${entry.number})`;
            }
        }

        // Pages
        if (entry.pages) {
            apa += `, ${entry.pages}`;
        }

        // DOI or URL
        if (entry.doi) {
            apa += `. https://doi.org/${entry.doi}`;
        } else if (entry.url) {
            apa += `. ${entry.url}`;
        }

        return apa;
    }

    // Format authors for APA style
    formatAuthorsAPA(authorString) {
        const authors = authorString.split(' and ').map(author => author.trim());

        if (authors.length === 1) {
            return this.formatSingleAuthorAPA(authors[0]);
        } else if (authors.length === 2) {
            return `${this.formatSingleAuthorAPA(authors[0])}, & ${this.formatSingleAuthorAPA(authors[1])}`;
        } else {
            const formattedAuthors = authors.slice(0, -1).map(author => this.formatSingleAuthorAPA(author));
            const lastAuthor = this.formatSingleAuthorAPA(authors[authors.length - 1]);
            return `${formattedAuthors.join(', ')}, & ${lastAuthor}`;
        }
    }

    // Format single author for APA (Last, F. M.)
    formatSingleAuthorAPA(author) {
        const parts = author.split(',').map(part => part.trim());
        if (parts.length >= 2) {
            // Already in "Last, First" format
            const lastName = parts[0];
            const firstName = parts[1];
            const initials = firstName.split(' ').map(name => name.charAt(0).toUpperCase()).join('. ');
            return `${lastName}, ${initials}.`;
        } else {
            // "First Last" format
            const nameParts = author.split(' ').filter(part => part.length > 0);
            if (nameParts.length >= 2) {
                const lastName = nameParts[nameParts.length - 1];
                const firstNames = nameParts.slice(0, -1);
                const initials = firstNames.map(name => name.charAt(0).toUpperCase()).join('. ');
                return `${lastName}, ${initials}.`;
            }
            return author; // Return as-is if can't parse
        }
    }
}

// Export for use in other scripts
window.BibtexParser = BibtexParser;