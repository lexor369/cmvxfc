const LIVE_ENDPOINT = 'https://raw.githubusercontent.com/doctor-8trange/zyphx8/refs/heads/main/data/fancode.json';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop';

class CmvDashboardEngine {
    constructor() {
        this.eventsCache = [];
        this.activeFilter = 'all';
        this.gridTarget = document.getElementById('cmvGridTarget');
        this.loaderEl = document.getElementById('cmvGridLoader');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.init();
    }

    async init() {
        this.bindFilters();
        await this.loadRemoteManifest();
    }

    bindFilters() {
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.activeFilter = e.target.dataset.filter;
                this.renderFeed();
            });
        });
    }

    async loadRemoteManifest() {
        try {
            const response = await fetch(LIVE_ENDPOINT);
            if (!response.ok) throw new Error(`HTTP network anomaly loop status code: ${response.status}`);
            
            const rawData = await response.json();
            // Maps and normalizes input array attributes downstream flawlessly
            this.eventsCache = (Array.isArray(rawData) ? rawData : (rawData.matches || [])).map(item => ({
                id: item.id || Math.random().toString(36).substring(2, 9),
                title: item.title || item.name || 'Tournament Event Showcase',
                competition: item.competition || item.league || 'Global Sports League',
                time: item.time || item.date || 'Schedule Confirmed',
                thumbnail: item.thumbnail || item.image || FALLBACK_IMAGE,
                language: item.language || 'English Broadcast Feed',
                status: String(item.status || 'upcoming').toLowerCase(),
                streamUrl: item.streamUrl || item.url || ''
            }));

            this.loaderEl.classList.add('hidden');
            this.gridTarget.classList.remove('hidden');
            this.renderFeed();
        } catch (error) {
            console.error('Core configuration validation fault: ', error);
            this.loaderEl.textContent = `Live Content Feed Connection Failed: ${error.message}`;
        }
    }

    renderFeed() {
        this.gridTarget.innerHTML = '';
        const itemsToDisplay = this.eventsCache.filter(e => {
            if (this.activeFilter === 'all') return true;
            return e.status === this.activeFilter;
        });

        if (itemsToDisplay.length === 0) {
            this.gridTarget.innerHTML = `<div class="loader-element" style="grid-column: 1/-1;">No matching sports streams categorized under this state.</div>`;
            return;
        }

        itemsToDisplay.forEach(match => {
            const isLive = match.status === 'live';
            const colorMarker = isLive ? 'var(--status-live)' : 'var(--status-upcoming)';
            const card = document.createElement('article');
            card.className = 'cmv-sport-card';
            
            card.innerHTML = `
                <div class="card-viewport-wrapper">
                    <img src="${match.thumbnail}" alt="${match.title}" loading="lazy" onerror="this.src='${FALLBACK_IMAGE}';">
                    <span class="card-status-badge" style="color: ${colorMarker};">
                        <div class="badge-dot" style="background-color: ${colorMarker};"></div>
                        ${match.status.toUpperCase()}
                    </span>
                </div>
                <div class="card-content-body">
                    <span class="card-league-lbl">${match.competition}</span>
                    <h3 class="card-title-txt">${match.title}</h3>
                    <div class="card-meta-row">
                        <span>📅 ${match.time}</span>
                        <span>🔊 ${match.language.toUpperCase()}</span>
                    </div>
                </div>
                <div class="card-action-footer">
                    <button class="${isLive ? 'btn-cmv-primary' : 'btn-cmv-secondary'}">
                        ${isLive ? 'Watch Live Stream' : 'View Broadcast Details'}
                    </button>
                </div>
            `;

            card.querySelector('button').addEventListener('click', () => {
                window.location.href = `details.html?id=${encodeURIComponent(match.id)}`;
            });

            this.gridTarget.appendChild(card);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new CmvDashboardEngine());

