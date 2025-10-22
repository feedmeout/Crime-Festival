let allObservations = [];
let filteredObservations = [];

window.addEventListener('DOMContentLoaded', async () => {
    await loadObservations();
    setupRealtimeListener();
});

async function loadObservations() {
    if (!window.firebaseDB) {
        console.error('Firebase not ready');
        return;
    }

    try {
        const observationsRef = window.firebaseCollection(window.firebaseDB, 'observations');
        const snapshot = await window.firebaseGetDocs(observationsRef);

        allObservations = [];
        const teams = new Set();
        const observers = new Set();

        snapshot.forEach(doc => {
            const data = { id: doc.id, ...doc.data() };
            allObservations.push(data);
            
            if (data.teamCode) teams.add(data.teamCode);
            if (data.observerId) observers.add(data.observerId);
        });

        // Populate filters
        populateFilters(teams, observers);

        // Calculate stats
        updateStats();

        // Display observations
        filteredObservations = [...allObservations];
        renderObservations();

    } catch (error) {
        console.error('Error loading observations:', error);
        showError();
    }
}

function populateFilters(teams, observers) {
    // Team filter
    const teamFilter = document.getElementById('teamFilter');
    const teamOptions = ['<option value="all">All Teams</option>'];
    Array.from(teams).sort().forEach(team => {
        teamOptions.push(`<option value="${team}">${team.toUpperCase()}</option>`);
    });
    teamFilter.innerHTML = teamOptions.join('');

    // Observer filter
    const observerFilter = document.getElementById('observerFilter');
    const observerOptions = ['<option value="all">All Observers</option>'];
    Array.from(observers).sort().forEach(observer => {
        observerOptions.push(`<option value="${observer}">${observer}</option>`);
    });
    observerFilter.innerHTML = observerOptions.join('');
}

function updateStats() {
    const submitted = allObservations.filter(o => o.status === 'submitted').length;
    const drafts = allObservations.filter(o => o.status !== 'submitted').length;
    const teams = new Set(allObservations.map(o => o.teamCode)).size;

    document.getElementById('totalObservations').textContent = allObservations.length;
    document.getElementById('submittedCount').textContent = submitted;
    document.getElementById('draftsCount').textContent = drafts;
    document.getElementById('teamsObserved').textContent = teams;
}

function filterObservations() {
    const statusFilter = document.getElementById('statusFilter').value;
    const teamFilter = document.getElementById('teamFilter').value;
    const observerFilter = document.getElementById('observerFilter').value;

    filteredObservations = allObservations.filter(obs => {
        if (statusFilter !== 'all') {
            if (statusFilter === 'submitted' && obs.status !== 'submitted') return false;
            if (statusFilter === 'draft' && obs.status === 'submitted') return false;
        }

        if (teamFilter !== 'all' && obs.teamCode !== teamFilter) return false;
        if (observerFilter !== 'all' && obs.observerId !== observerFilter) return false;

        return true;
    });

    renderObservations();
}

function renderObservations() {
    const grid = document.getElementById('observationsGrid');

    if (filteredObservations.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>No observations found</h3>
                <p>Start a new observation or adjust your filters</p>
            </div>
        `;
        return;
    }

    // Sort by date (newest first)
    const sorted = [...filteredObservations].sort((a, b) => {
        const dateA = new Date(a.submittedAt || a.startTime || 0);
        const dateB = new Date(b.submittedAt || b.startTime || 0);
        return dateB - dateA;
    });

    const html = sorted.map(obs => {
        const isDraft = obs.status !== 'submitted';
        const duration = obs.durationMs ? formatDuration(obs.durationMs) : 'N/A';
        const date = obs.submittedAt || obs.startTime;
        const formattedDate = date ? new Date(date).toLocaleString('el-GR') : 'N/A';

        return `
            <div class="observation-card ${isDraft ? 'draft' : ''}">
                <div class="observation-header">
                    <div class="observation-title">👥 ${obs.teamCode?.toUpperCase() || 'Unknown Team'}</div>
                    <div class="observation-status ${isDraft ? 'status-draft' : 'status-submitted'}">
                        ${isDraft ? '📝 DRAFT' : '✅ SUBMITTED'}
                    </div>
                </div>

                <div class="observation-meta">
                    <div class="meta-item">
                        <span class="meta-label">Observer:</span>
                        <span class="meta-value">${obs.observerId || 'N/A'}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Duration:</span>
                        <span class="meta-value">${duration}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Notes:</span>
                        <span class="meta-value">${obs.notes?.length || 0} timestamped</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Date:</span>
                        <span class="meta-value">${formattedDate}</span>
                    </div>
                </div>

                <div class="observation-actions">
                    <button class="btn btn-primary btn-small" onclick="viewObservation('${obs.id}')">
                        👁️ VIEW
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteObservation('${obs.id}')">
                        🗑️ DELETE
                    </button>
                </div>
            </div>
        `;
    }).join('');

    grid.innerHTML = html;
}

function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
}

function viewObservation(obsId) {
    const obs = allObservations.find(o => o.id === obsId);
    if (!obs) return;

    const isDraft = obs.status !== 'submitted';
    const duration = obs.durationMs ? formatDuration(obs.durationMs) : 'N/A';

    let html = `
        <div style="padding: 20px;">
            <div style="background: ${isDraft ? '#fff3cd' : '#d4edda'}; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-bottom: 10px;">📋 Basic Information</h3>
                <div style="display: grid; gap: 10px;">
                    <div><strong>Team:</strong> ${obs.teamCode?.toUpperCase() || 'N/A'}</div>
                    <div><strong>Observer:</strong> ${obs.observerId || 'N/A'}</div>
                    <div><strong>Duration:</strong> ${duration}</div>
                    <div><strong>Status:</strong> ${isDraft ? '📝 DRAFT' : '✅ SUBMITTED'}</div>
                    <div><strong>Date:</strong> ${new Date(obs.submittedAt || obs.startTime).toLocaleString('el-GR')}</div>
                </div>
            </div>
    `;

    // Timestamped Notes
    if (obs.notes && obs.notes.length > 0) {
        html += `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-bottom: 15px;">📝 Timestamped Notes (${obs.notes.length})</h3>
                ${obs.notes.map((note, idx) => `
                    <div style="background: white; padding: 12px; margin-bottom: 10px; border-radius: 5px; border-left: 4px solid #2563eb;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                            <strong>⏱️ ${formatDuration(note.elapsed)}</strong> - ${new Date(note.timestamp).toLocaleTimeString('el-GR')}
                        </div>
                        <div>${escapeHtml(note.content)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Form Responses
    if (obs.formData) {
        html += `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <h3 style="margin-bottom: 15px;">📊 Observation Data</h3>
                ${renderFormData(obs.formData)}
            </div>
        `;
    }

    html += '</div>';

    document.getElementById('viewModalContent').innerHTML = html;
    document.getElementById('viewModal').classList.add('active');
}

function renderFormData(formData) {
    let html = '<div style="display: grid; gap: 15px;">';

    Object.keys(formData).forEach(key => {
        const value = formData[key];
        const label = formatLabel(key);
        
        let displayValue;
        if (Array.isArray(value)) {
            displayValue = value.length > 0 ? value.join(', ') : 'None';
        } else {
            displayValue = value || 'N/A';
        }

        html += `
            <div style="background: white; padding: 12px; border-radius: 5px;">
                <div style="font-weight: 700; color: #0f3460; margin-bottom: 5px;">${label}</div>
                <div style="color: #333;">${escapeHtml(String(displayValue))}</div>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

function formatLabel(key) {
    return key
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('active');
}

async function deleteObservation(obsId) {
    if (!confirm('Delete this observation? This cannot be undone.')) return;

    try {
        await window.firebaseDeleteDoc(window.firebaseDoc(window.firebaseDB, 'observations', obsId));
        alert('✅ Observation deleted!');
        await loadObservations();
    } catch (error) {
        console.error('Error deleting:', error);
        alert('❌ Delete failed!');
    }
}

async function exportObservationsToExcel() {
    if (filteredObservations.length === 0) {
        alert('No observations to export!');
        return;
    }

    try {
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; text-align: center;';
        statusDiv.innerHTML = '<div style="font-size: 48px; margin-bottom: 20px;">👁️</div><h3>Exporting...</h3>';
        document.body.appendChild(statusDiv);

        const processedData = filteredObservations.map(obs => {
            const flatData = {
                'Document_ID': obs.id,
                'Observer_ID': obs.observerId,
                'Team_Code': obs.teamCode,
                'Status': obs.status,
                'Start_Time': obs.startTime,
                'End_Time': obs.endTime,
                'Duration_Minutes': obs.durationMs ? Math.round(obs.durationMs / 60000) : 0,
                'Submitted_At': obs.submittedAt,
                'Number_of_Notes': obs.notes?.length || 0
            };

            // Add notes
            if (obs.notes) {
                obs.notes.forEach((note, idx) => {
                    flatData[`Note_${idx + 1}_Time`] = note.timestamp;
                    flatData[`Note_${idx + 1}_Content`] = note.content;
                });
            }

            // Add form data
            if (obs.formData) {
                Object.keys(obs.formData).forEach(key => {
                    const value = obs.formData[key];
                    flatData[key] = Array.isArray(value) ? value.join('; ') : value;
                });
            }

            return flatData;
        });

        const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs');
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(processedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Observations');

        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `Game_Master_Observations_${timestamp}.xlsx`;
        XLSX.writeFile(wb, filename);

        document.body.removeChild(statusDiv);
        alert(`✅ Exported: ${filename}`);

    } catch (error) {
        console.error('Export error:', error);
        alert('❌ Export failed!');
    }
}

function setupRealtimeListener() {
    if (!window.firebaseDB) return;

    const observationsRef = window.firebaseCollection(window.firebaseDB, 'observations');
    window.firebaseOnSnapshot(observationsRef, () => {
        loadObservations();
    });
}

function showError() {
    document.getElementById('observationsGrid').innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">❌</div>
            <h3>Error Loading Observations</h3>
            <p>Please refresh the page</p>
        </div>
    `;
}

window.onclick = function(event) {
    const modal = document.getElementById('viewModal');
    if (event.target === modal) {
        closeViewModal();
    }
}