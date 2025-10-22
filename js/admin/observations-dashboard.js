let allObservations = [];
let filteredObservations = [];

window.addEventListener('DOMContentLoaded', async () => {
    await loadObservations();
    setupRealtimeListener();
});

async function loadObservations() {
    if (!window.firebaseDB) {
        console.error('Firebase δεν είναι έτοιμο');
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

        populateFilters(teams, observers);
        updateStats();

        filteredObservations = [...allObservations];
        renderObservations();

    } catch (error) {
        console.error('Σφάλμα φόρτωσης παρατηρήσεων:', error);
        showError();
    }
}

function populateFilters(teams, observers) {
    const teamFilter = document.getElementById('teamFilter');
    const teamOptions = ['<option value="all">Όλες οι Ομάδες</option>'];
    Array.from(teams).sort().forEach(team => {
        teamOptions.push(`<option value="${team}">${team.toUpperCase()}</option>`);
    });
    teamFilter.innerHTML = teamOptions.join('');

    const observerFilter = document.getElementById('observerFilter');
    const observerOptions = ['<option value="all">Όλοι οι Παρατηρητές</option>'];
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
                <h3>Δεν βρέθηκαν παρατηρήσεις</h3>
                <p>Ξεκινήστε μια νέα παρατήρηση ή προσαρμόστε τα φίλτρα</p>
            </div>
        `;
        return;
    }

    const sorted = [...filteredObservations].sort((a, b) => {
        const dateA = new Date(a.submittedAt || a.startTime || 0);
        const dateB = new Date(b.submittedAt || b.startTime || 0);
        return dateB - dateA;
    });

    const html = sorted.map(obs => {
        const isDraft = obs.status !== 'submitted';
        const duration = obs.durationMs ? formatDuration(obs.durationMs) : 'Μ/Δ';
        const date = obs.submittedAt || obs.startTime;
        const formattedDate = date ? new Date(date).toLocaleString('el-GR') : 'Μ/Δ';
        
        // Handle both old and new formats
        const behaviorCount = obs.totalBehaviorCount || obs.behaviors ? 
            (obs.totalBehaviorCount || Object.values(obs.behaviors || {}).reduce((sum, val) => sum + val, 0)) : 0;

        return `
            <div class="observation-card ${isDraft ? 'draft' : ''}">
                <div class="observation-header">
                    <div class="observation-title">👥 ${obs.teamCode?.toUpperCase() || 'Άγνωστη Ομάδα'}</div>
                    <div class="observation-status ${isDraft ? 'status-draft' : 'status-submitted'}">
                        ${isDraft ? '📝 ΠΡΟΧΕΙΡΟ' : '✅ ΥΠΟΒΛΗΘΗΚΕ'}
                    </div>
                </div>

                <div class="observation-meta">
                    <div class="meta-item">
                        <span class="meta-label">Παρατηρητής:</span>
                        <span class="meta-value">${obs.observerId || 'Μ/Δ'}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Διάρκεια:</span>
                        <span class="meta-value">${duration}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Συμπεριφορές:</span>
                        <span class="meta-value"><strong>${behaviorCount}</strong></span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Σημειώσεις:</span>
                        <span class="meta-value">${obs.notes?.length || 0}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Ημερομηνία:</span>
                        <span class="meta-value">${formattedDate}</span>
                    </div>
                </div>

                <div class="observation-actions">
                    <button class="btn btn-primary btn-small" onclick="viewObservation('${obs.id}')">
                        👁️ ΠΡΟΒΟΛΗ
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteObservation('${obs.id}')">
                        🗑️ ΔΙΑΓΡΑΦΗ
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
    return `${minutes}λ ${seconds}δ`;
}

function viewObservation(obsId) {
    const obs = allObservations.find(o => o.id === obsId);
    if (!obs) return;

    const isDraft = obs.status !== 'submitted';
    const duration = obs.durationMs ? formatDuration(obs.durationMs) : 'Μ/Δ';

    let html = `
        <div style="padding: 20px;">
            <div style="background: ${isDraft ? '#fff3cd' : '#d4edda'}; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-bottom: 10px;">📋 Βασικές Πληροφορίες</h3>
                <div style="display: grid; gap: 10px;">
                    <div><strong>Ομάδα:</strong> ${obs.teamCode?.toUpperCase() || 'Μ/Δ'}</div>
                    <div><strong>Παρατηρητής:</strong> ${obs.observerId || 'Μ/Δ'}</div>
                    <div><strong>Διάρκεια:</strong> ${duration}</div>
                    <div><strong>Κατάσταση:</strong> ${isDraft ? '📝 ΠΡΟΧΕΙΡΟ' : '✅ ΥΠΟΒΛΗΘΗΚΕ'}</div>
                    <div><strong>Ημερομηνία:</strong> ${new Date(obs.submittedAt || obs.startTime).toLocaleString('el-GR')}</div>
                </div>
            </div>
    `;

    // Timestamped Notes
    if (obs.notes && obs.notes.length > 0) {
        html += `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="margin-bottom: 15px;">📝 ΣΗΜΕΙΩΣΕΙΣ (${obs.notes.length})</h3>
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

    // Behavior Data or Form Data
    if (obs.behaviors) {
        html += `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <h3 style="margin-bottom: 15px;">📊 ΣΥΧΝΟΤΗΤΕΣ ΣΥΜΠΕΡΙΦΟΡΩΝ</h3>
                ${renderBehaviorData(obs.behaviors)}
            </div>
        `;
    } else if (obs.formData) {
        html += `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <h3 style="margin-bottom: 15px;">📊 Δεδομένα Παρατήρησης</h3>
                ${renderFormData(obs.formData)}
            </div>
        `;
    }

    html += '</div>';

    document.getElementById('viewModalContent').innerHTML = html;
    document.getElementById('viewModal').classList.add('active');
}

function renderBehaviorData(behaviors) {
    const behaviorLabels = {
        ai_queries: 'Συχνότητα ερωτημάτων AI',
        prompt_quality: 'Ποιότητα προτροπών',
        ai_verification: 'Επαλήθευση απαντήσεων AI',
        active_discussion: 'Ενεργή συζήτηση',
        info_sharing: 'Ανταλλαγή πληροφοριών',
        task_division: 'Καταμερισμός καθηκόντων',
        systematic_analysis: 'Συστηματική ανάλυση',
        cross_referencing: 'Διασταύρωση στοιχείων',
        critical_thinking: 'Κριτική σκέψη',
        enthusiasm: 'Ενθουσιασμός',
        persistence: 'Επιμονή',
        focus: 'Εστίαση'
    };

    const categories = {
        'AI Usage Patterns': ['ai_queries', 'prompt_quality', 'ai_verification'],
        'Team Collaboration': ['active_discussion', 'info_sharing', 'task_division'],
        'Problem-Solving Approach': ['systematic_analysis', 'cross_referencing', 'critical_thinking'],
        'Engagement & Motivation': ['enthusiasm', 'persistence', 'focus']
    };

    let html = '';

    Object.keys(categories).forEach(category => {
        html += `<div style="margin-bottom: 20px;">`;
        html += `<h4 style="color: #0f3460; margin-bottom: 10px; border-bottom: 2px solid #ddd; padding-bottom: 5px;">${category}</h4>`;
        html += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">`;

        categories[category].forEach(key => {
            const value = behaviors[key] || 0;
            const label = behaviorLabels[key] || key;
            
            html += `
                <div style="background: white; padding: 12px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 600; color: #333;">${label}</span>
                    <span style="font-weight: 700; color: #ff6b00; font-size: 20px;">${value}</span>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    return html;
}

function renderFormData(formData) {
    let html = '<div style="display: grid; gap: 15px;">';

    Object.keys(formData).forEach(key => {
        const value = formData[key];
        const label = formatLabel(key);
        
        let displayValue;
        if (Array.isArray(value)) {
            displayValue = value.length > 0 ? value.join(', ') : 'Κανένα';
        } else {
            displayValue = value || 'Μ/Δ';
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
    if (!confirm('Διαγραφή αυτής της παρατήρησης; Αυτό δεν μπορεί να αναιρεθεί.')) return;

    try {
        await window.firebaseDeleteDoc(window.firebaseDoc(window.firebaseDB, 'observations', obsId));
        alert('✅ Η παρατήρηση διαγράφηκε!');
        await loadObservations();
    } catch (error) {
        console.error('Σφάλμα διαγραφής:', error);
        alert('❌ Αποτυχία διαγραφής!');
    }
}

async function exportObservationsToExcel() {
    if (filteredObservations.length === 0) {
        alert('Δεν υπάρχουν παρατηρήσεις για εξαγωγή!');
        return;
    }

    try {
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; text-align: center;';
        statusDiv.innerHTML = '<div style="font-size: 48px; margin-bottom: 20px;">👁️</div><h3>Εξαγωγή...</h3>';
        document.body.appendChild(statusDiv);

        const processedData = filteredObservations.map(obs => {
            const flatData = {
                'ID_Εγγράφου': obs.id,
                'Παρατηρητής': obs.observerId,
                'Κωδικός_Ομάδας': obs.teamCode,
                'Κατάσταση': obs.status,
                'Ώρα_Έναρξης': obs.startTime,
                'Ώρα_Λήξης': obs.endTime,
                'Διάρκεια_Λεπτά': obs.durationMs ? Math.round(obs.durationMs / 60000) : 0,
                'Υποβλήθηκε_Στις': obs.submittedAt,
                'Αριθμός_Σημειώσεων': obs.notes?.length || 0,
                'Σύνολο_Συμπεριφορών': obs.totalBehaviorCount || 0
            };

            // Add behavior frequencies if available
            if (obs.behaviors) {
                Object.keys(obs.behaviors).forEach(key => {
                    flatData[key] = obs.behaviors[key];
                });
            }

            // Add notes
            if (obs.notes) {
                obs.notes.forEach((note, idx) => {
                    flatData[`Σημείωση_${idx + 1}_Χρόνος`] = note.timestamp;
                    flatData[`Σημείωση_${idx + 1}_Περιεχόμενο`] = note.content;
                });
            }

            // Add old format form data if available
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
        XLSX.utils.book_append_sheet(wb, ws, 'Παρατηρήσεις');

        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `Παρατηρήσεις_Game_Master_${timestamp}.xlsx`;
        XLSX.writeFile(wb, filename);

        document.body.removeChild(statusDiv);
        alert(`✅ Εξαγωγή ολοκληρώθηκε: ${filename}`);

    } catch (error) {
        console.error('Σφάλμα εξαγωγής:', error);
        alert('❌ Αποτυχία εξαγωγής!');
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
            <h3>Σφάλμα Φόρτωσης Παρατηρήσεων</h3>
            <p>Παρακαλώ ανανεώστε τη σελίδα</p>
        </div>
    `;
}

window.onclick = function(event) {
    const modal = document.getElementById('viewModal');
    if (event.target === modal) {
        closeViewModal();
    }
}
