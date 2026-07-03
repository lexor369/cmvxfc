const LIVE_ENDPOINT = 'https://raw.githubusercontent.com/doctor-8trange/zyphx8/refs/heads/main/data/fancode.json';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop';

class CmvVideoTerminalEngine {
    constructor() {
        this.routingTargetId = new URLSearchParams(window.location.search).get('id');
        this.videoElement = document.getElementById('videoPlayer');
        this.shakaInstance = null;
        this.init();
    }

    async init() {
        if (!this.routingTargetId) {
            this.displayFailure('Security validation alert: Navigation contextual tracking code token missing.');
            return;
        }
        await this.syncSelectedEventProfile();
    }

    displayFailure(msg) {
        const errorCard = document.getElementById('detailError');
        errorCard.textContent = msg;
        errorCard.classList.remove('hidden');
        document.getElementById('detailContainer').classList.add('hidden');
    }

    async syncSelectedEventProfile() {
        try {
            const response = await fetch(LIVE_ENDPOINT);
            if (!response.ok) throw new Error('Remote array server interface refused configuration handshake maps.');
            
            const rawData = await response.json();
            const normalizedCollection = (Array.isArray(rawData) ? rawData : (rawData.matches || [])).map(item => ({
                id: item.id || '',
                title: item.title || item.name || 'Live Event Fixture',
                competition: item.competition || item.league || 'Tournament Series Showcase',
                time: item.time || item.date || 'TBD',
                thumbnail: item.thumbnail || item.image || FALLBACK_IMAGE,
                language: item.language || 'English Broadcast Feed',
                status: String(item.status || 'upcoming').toLowerCase(),
                streamUrl: item.streamUrl || item.url || ''
            }));

            const targetMatch = normalizedCollection.find(m => String(m.id) === String(this.routingTargetId));
            if (!targetMatch) throw new Error('The event record identifier request does not match current registered indices.');

            this.populateLayoutTree(targetMatch);

            if (targetMatch.status === 'live' && targetMatch.streamUrl) {
                this.mountShakaStreamPipeline(targetMatch.streamUrl);
            } else {
                this.deployPlaceholderMedia(targetMatch.thumbnail);
            }
        } catch (error) {
            this.displayFailure(`Operational Interruption: ${error.message}`);
        }
    }

    populateLayoutTree(match) {
        document.getElementById('detailTitle').textContent = match.title;
        document.getElementById('detailComp').textContent = match.competition;
        document.getElementById('detailTime').textContent = `Transmission Window Block: ${match.time} // Primary Language: ${match.language}`;
        
        const badgeElement = document.getElementById('detailBadge');
        badgeElement.textContent = match.status.toUpperCase();
        badgeElement.style.backgroundColor = match.status === 'live' ? 'var(--status-live)' : 'var(--bg-elevated)';
        badgeElement.style.color = '#fff';
    }

    deployPlaceholderMedia(coverUrl) {
        const viewport = document.getElementById('videoContainer');
        viewport.innerHTML = `
            <div style="width:100%; height:100%; position:relative;">
                <img src="${coverUrl}" style="width:100%; height:100%; object-fit:cover; filter:brightness(0.35);">
                <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px; text-align:center;">
                    <h3 style="font-size:22px; margin-bottom:8px;">Broadcast Transmission Offline</h3>
                    <p style="color:var(--text-muted); font-size:14px; max-width:480px;">This digital directory record event state parameters track as upcoming or concluded. Interactive streaming player opens automatically upon live match execution signals.</p>
                </div>
            </div>
        `;
    }

    async mountShakaStreamPipeline(url) {
        shaka.polyfil.installAll();
        if (!shaka.Player.isBrowserSupported()) {
            console.error('Target runtime display metrics interface lacks hardware video decoding architecture definitions for Shaka.');
            return;
        }

        try {
            this.shakaInstance = new shaka.Player(this.videoElement);
            await this.shakaInstance.load(url);
            console.log('Secure streaming architecture hooks synced cleanly. Playing live transmission channel.');
        } catch (error) {
            console.error('Shaka streaming execution core crashed during loading:', error);
            this.displayFailure('Streaming Pipeline Failure: Video stream source format unreadable or link expired.');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new var_terminal = new CmvVideoTerminalEngine());

