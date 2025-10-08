// Dynamic publication renderer
class PublicationRenderer {
    constructor() {
        if (typeof BibtexParser === 'undefined') {
            throw new Error('BibtexParser is not available. Make sure bibtex-parser.js is loaded before publication-renderer.js');
        }
        this.parser = new BibtexParser();
        this.config = null;
        this.entries = {};
    }

    async initialize() {
        try {
            // Load all required files
            const [bibtexResponse, configResponse] = await Promise.all([
                fetch('assets/publications.bib'),
                fetch('assets/publications-config.json')
            ]);

            if (!bibtexResponse.ok || !configResponse.ok) {
                throw new Error('Failed to load publication files');
            }

            const bibtexContent = await bibtexResponse.text();
            this.config = await configResponse.json();

            // Parse BibTeX content
            this.entries = this.parser.parse(bibtexContent);

            console.log(`Loaded ${Object.keys(this.entries).length} publications`);
            return true;
        } catch (error) {
            console.error('Error loading publications:', error);
            return false;
        }
    }

    renderPublications() {
        const container = document.getElementById('publications-container');
        if (!container) return;

        // Clear loading message
        container.innerHTML = '';

        // Categorize publications
        const { mainPublications, olderPublications } = this.categorizePublications();

        let citationCounter = 1;

        // Render main publications
        mainPublications.forEach(([key, entry]) => {
            const publicationHtml = this.createPublicationHTML(key, entry, citationCounter);
            container.appendChild(publicationHtml);
            citationCounter++;
        });

        // Add "Show More" section if there are older publications
        if (olderPublications.length > 0) {
            const showMoreSection = this.createShowMoreSection(olderPublications, citationCounter);
            container.appendChild(showMoreSection);
        }

        // Initialize event listeners after rendering
        this.initializeEventListeners();
    }

    categorizePublications() {
        const allEntries = Object.entries(this.entries)
            .sort((a, b) => {
                const yearA = parseInt(a[1].year) || 0;
                const yearB = parseInt(b[1].year) || 0;
                return yearB - yearA; // Newest first
            });

        const mainPublications = [];
        const olderPublications = [];

        allEntries.forEach(([key, entry]) => {
            const year = parseInt(entry.year) || 0;
            const isFirstAuthor = this.isFirstAuthor(entry.author);

            console.log(`Publication ${key}: year=${year}, isFirstAuthor=${isFirstAuthor}, author="${entry.author}"`);

            // Main publications: 2020 or later, OR first author regardless of year
            if (year >= 2020 || isFirstAuthor) {
                mainPublications.push([key, entry]);
                console.log(`  -> Added to main publications`);
            } else {
                // Older publications where not first author
                olderPublications.push([key, entry]);
                console.log(`  -> Added to older publications`);
            }
        });

        console.log(`Main publications: ${mainPublications.length}, Older publications: ${olderPublications.length}`);
        console.log('Main publication keys:', mainPublications.map(([key]) => key));
        console.log('Older publication keys:', olderPublications.map(([key]) => key));

        return { mainPublications, olderPublications };
    }

    isFirstAuthor(authorString) {
        if (!authorString) return false;

        // Check if "Kong, Lingli" or "Lingli Kong" appears first
        const authors = authorString.split(' and ').map(author => author.trim());
        const firstAuthor = authors[0].toLowerCase();

        console.log(`Checking first author: "${firstAuthor}" from "${authorString}"`);
        const isFirst = firstAuthor.includes('kong') && firstAuthor.includes('lingli');
        console.log(`Is first author: ${isFirst}`);

        return isFirst;
    }

    createShowMoreSection(olderPublications, startingCitationNumber) {
        const section = document.createElement('div');
        section.className = 'show-more-section';

        // Show More button
        const showMoreBtn = document.createElement('button');
        showMoreBtn.className = 'show-more-btn';
        showMoreBtn.innerHTML = `
            <i class="fas fa-chevron-down"></i> 
            Show ${olderPublications.length} Earlier Publications
        `;

        // Hidden publications container
        const hiddenContainer = document.createElement('div');
        hiddenContainer.className = 'hidden-publications';
        hiddenContainer.style.display = 'none';

        let citationCounter = startingCitationNumber;
        olderPublications.forEach(([key, entry]) => {
            const publicationHtml = this.createPublicationHTML(key, entry, citationCounter);
            hiddenContainer.appendChild(publicationHtml);
            citationCounter++;
        });

        // Toggle functionality
        showMoreBtn.addEventListener('click', () => {
            const isHidden = hiddenContainer.style.display === 'none';

            if (isHidden) {
                hiddenContainer.style.display = 'block';
                showMoreBtn.innerHTML = `
                    <i class="fas fa-chevron-up"></i> 
                    Hide Earlier Publications
                `;
                showMoreBtn.classList.add('expanded');
            } else {
                hiddenContainer.style.display = 'none';
                showMoreBtn.innerHTML = `
                    <i class="fas fa-chevron-down"></i> 
                    Show ${olderPublications.length} Earlier Publications
                `;
                showMoreBtn.classList.remove('expanded');
            }
        });

        section.appendChild(showMoreBtn);
        section.appendChild(hiddenContainer);

        return section;
    }

    createPublicationHTML(bibtexKey, entry, citationNumber) {
        const config = this.config.featuredPublications.find(p => p.bibtexKey === bibtexKey);
        const isFeatured = !!config;
        const hasGraphical = isFeatured && config.hasGraphicalAbstract;

        const div = document.createElement('div');
        div.className = isFeatured ? 'publication-item' : 'publication-item publication-simple';
        div.setAttribute('data-bibtex-key', bibtexKey);

        const year = entry.year || 'Unknown';
        const title = entry.title || 'Untitled';
        const authors = this.formatAuthors(entry.author || 'Unknown authors');
        const venue = entry.journal || entry.booktitle || 'Unknown venue';

        if (isFeatured && hasGraphical) {
            // Featured publication with graphical abstract
            div.innerHTML = `
                <div class="publication-year">${year}</div>
                <div class="publication-main">
                    <div class="publication-content">
                        <h3 class="publication-title">${title}</h3>
                        <p class="publication-authors">${authors}</p>
                        <p class="publication-venue"><em>${venue}</em></p>
                        <div class="publication-links">
                            <a href="#" class="pub-link"><i class="fas fa-file-pdf"></i> PDF</a>
                            <button class="cite-btn" data-target="citation-${citationNumber}"><i class="fas fa-quote-left"></i> Cite</button>
                            ${config.hasCode ? '<a href="#" class="pub-link"><i class="fab fa-github"></i> Code</a>' : ''}
                            <button class="abstract-toggle" data-target="abstract-${citationNumber}">
                                <i class="fas fa-chevron-down"></i> Abstract
                            </button>
                        </div>
                    </div>
                    <div class="publication-graphic">
                        ${this.createGraphicalAbstract(config)}
                    </div>
                </div>
                <div class="publication-abstract" id="abstract-${citationNumber}">
                    <p>${entry.abstract || 'No abstract available.'}</p>
                </div>
            `;
        } else {
            // Simple publication without graphical abstract - same layout as featured
            div.innerHTML = `
                <div class="publication-year">${year}</div>
                <div class="publication-main">
                    <div class="publication-content">
                        <h3 class="publication-title">${title}</h3>
                        <p class="publication-authors">${authors}</p>
                        <p class="publication-venue"><em>${venue}</em></p>
                        <div class="publication-links">
                            <a href="#" class="pub-link"><i class="fas fa-file-pdf"></i> PDF</a>
                            <button class="cite-btn" data-target="citation-${citationNumber}"><i class="fas fa-quote-left"></i> Cite</button>
                            <button class="abstract-toggle" data-target="abstract-${citationNumber}">
                                <i class="fas fa-chevron-down"></i> Abstract
                            </button>
                        </div>
                    </div>
                    <div class="publication-graphic">
                        <!-- Empty graphic space for consistent layout -->
                    </div>
                </div>
                <div class="publication-abstract" id="abstract-${citationNumber}">
                    <p>${entry.abstract || 'No abstract available.'}</p>
                </div>
            `;
        }

        return div;
    }

    createGraphicalAbstract(config) {
        if (config.graphicalAbstractType === 'video') {
            const videoSources = config.videoSources.map(source =>
                `<source src="${source.src}" type="${source.type}">`
            ).join('');

            return `
                <video class="graphical-abstract-video" controls poster="${config.posterImage}">
                    ${videoSources}
                    Your browser does not support the video tag.
                </video>
            `;
        } else if (config.graphicalAbstractType === 'image') {
            return `<img src="${config.imageSrc}" alt="Graphical Abstract" class="graphical-abstract">`;
        }
        return '';
    }

    formatAuthors(authorString) {
        if (!authorString) return 'Unknown authors';

        // Split authors by "and"
        const authors = authorString.split(' and ').map(author => author.trim());

        // Format each author
        const formattedAuthors = authors.map(author => {
            const formatted = this.formatSingleAuthor(author);

            // Bold Lingli Kong's name - check various formats
            const lowerFormatted = formatted.toLowerCase();
            if (lowerFormatted.includes('l. kong') ||
                lowerFormatted.includes('kong, l.') ||
                lowerFormatted.includes('lingli kong') ||
                lowerFormatted.includes('kong, lingli') ||
                (lowerFormatted.includes('kong') && lowerFormatted.includes('l.'))) {
                return `<strong>${formatted}</strong>`;
            }

            return formatted;
        });

        return formattedAuthors.join(', ');
    }

    formatSingleAuthor(author) {
        author = author.trim();

        // Handle "Last, First Middle" format
        if (author.includes(',')) {
            const parts = author.split(',').map(part => part.trim());
            const lastName = parts[0];
            const firstNames = parts[1] || '';

            if (firstNames) {
                const nameWords = firstNames.split(/\s+/).filter(word => word.length > 0);
                const initials = nameWords.map(name => name.charAt(0).toUpperCase() + '.').join(' ');
                return `${initials} ${lastName}`;
            }
            return lastName;
        }

        // Handle "First Middle Last" format
        const nameWords = author.split(/\s+/).filter(word => word.length > 0);
        if (nameWords.length >= 2) {
            const lastName = nameWords[nameWords.length - 1];
            const firstNames = nameWords.slice(0, -1);
            const initials = firstNames.map(name => name.charAt(0).toUpperCase() + '.').join(' ');
            return `${initials} ${lastName}`;
        }

        // Single name - return as is
        return author;
    }

    initializeEventListeners() {
        // Abstract toggle functionality
        document.querySelectorAll('.abstract-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.getAttribute('data-target');
                const abstractDiv = document.getElementById(targetId);

                if (abstractDiv.classList.contains('active')) {
                    abstractDiv.classList.remove('active');
                    toggle.classList.remove('active');
                    toggle.innerHTML = '<i class="fas fa-chevron-down"></i> Abstract';
                } else {
                    // Close other open abstracts
                    document.querySelectorAll('.publication-abstract.active').forEach(abs => {
                        abs.classList.remove('active');
                    });
                    document.querySelectorAll('.abstract-toggle.active').forEach(btn => {
                        btn.classList.remove('active');
                        btn.innerHTML = '<i class="fas fa-chevron-down"></i> Abstract';
                    });

                    // Open clicked abstract
                    abstractDiv.classList.add('active');
                    toggle.classList.add('active');
                    toggle.innerHTML = '<i class="fas fa-chevron-up"></i> Abstract';
                }
            });
        });

        // Update PDF links
        document.querySelectorAll('.publication-item').forEach(item => {
            const bibtexKey = item.getAttribute('data-bibtex-key');
            const entry = this.entries[bibtexKey];

            if (entry) {
                const pdfLink = item.querySelector('.pub-link[href="#"]');
                if (pdfLink && pdfLink.textContent.includes('PDF')) {
                    const url = this.parser.getPublicationUrl(bibtexKey);
                    if (url) {
                        pdfLink.href = url;
                        pdfLink.target = '_blank';
                        pdfLink.rel = 'noopener noreferrer';
                    }
                }
            }
        });
    }

    // Get citation for modal
    getCitation(citationId, format = 'bibtex') {
        const citationNumber = citationId.replace('citation-', '');
        const entries = Object.keys(this.entries);
        const bibtexKey = entries[citationNumber - 1]; // Convert to 0-based index

        if (!bibtexKey) return 'Citation not found.';

        if (format === 'bibtex') {
            return this.parser.toBibtex(bibtexKey);
        } else if (format === 'apa') {
            return this.parser.toAPA(bibtexKey);
        }

        return 'Unknown citation format.';
    }
}

// Export for global use
window.PublicationRenderer = PublicationRenderer;