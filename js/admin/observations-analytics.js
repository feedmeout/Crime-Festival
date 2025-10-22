let allObservations = [];
let charts = {};

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

const categoryBehaviors = {
    'AI Usage Patterns': ['ai_queries', 'prompt_quality', 'ai_verification'],
    'Team Collaboration': ['active_discussion', 'info_sharing', 'task_division'],
    'Problem-Solving Approach': ['systematic_analysis', 'cross_referencing', 'critical_thinking'],
    'Engagement & Motivation': ['enthusiasm', 'persistence', 'focus']
};

window.addEventListener('DOMContentLoaded', async () => {
    await loadAndAnalyzeData();
});

async function loadAndAnalyzeData() {
    if (!window.firebaseDB) {
        alert('❌ Σφάλμα σύνδεσης Firebase');
        return;
    }

    try {
        const observationsRef = window.firebaseCollection(window.firebaseDB, 'observations');
        const q = window.firebaseQuery(observationsRef, window.firebaseWhere('status', '==', 'submitted'));
        const snapshot = await window.firebaseGetDocs(q);

        allObservations = [];
        snapshot.forEach(doc => {
            allObservations.push({ id: doc.id, ...doc.data() });
        });

        if (allObservations.length === 0) {
            showNoDataMessage();
            return;
        }

        calculateSummaryStats();
        createAllCharts();
        createDetailedStatsTable();

        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';

    } catch (error) {
        console.error('Σφάλμα φόρτωσης δεδομένων:', error);
        alert('❌ Σφάλμα φόρτωσης δεδομένων');
    }
}

function showNoDataMessage() {
    document.getElementById('loadingOverlay').innerHTML = `
        <div class="loading-content">
            <div style="font-size: 48px; margin-bottom: 20px;">📭</div>
            <h3>Δεν υπάρχουν δεδομένα</h3>
            <p>Δεν βρέθηκαν υποβληθείσες παρατηρήσεις.</p>
            <button class="btn btn-primary" onclick="window.location.href='observation.html'" style="margin-top: 20px;">
                ➕ ΝΕΑ ΠΑΡΑΤΗΡΗΣΗ
            </button>
        </div>
    `;
}

function calculateSummaryStats() {
    const totalObs = allObservations.length;
    const uniqueTeams = new Set(allObservations.map(o => o.teamCode)).size;
    
    const totalDurationMs = allObservations.reduce((sum, obs) => sum + (obs.durationMs || 0), 0);
    const avgDurationMinutes = Math.round(totalDurationMs / totalObs / 60000);
    
    const totalBehaviorCount = allObservations.reduce((sum, obs) => sum + (obs.totalBehaviorCount || 0), 0);

    document.getElementById('totalObservations').textContent = totalObs;
    document.getElementById('totalTeams').textContent = uniqueTeams;
    document.getElementById('avgDuration').textContent = avgDurationMinutes;
    document.getElementById('totalBehaviors').textContent = totalBehaviorCount;
}

function createAllCharts() {
    createCategoryChart('aiPatternsChart', 'AI Usage Patterns', '#2563eb');
    createCategoryChart('collaborationChart', 'Team Collaboration', '#059669');
    createCategoryChart('problemSolvingChart', 'Problem-Solving Approach', '#d97706');
    createCategoryChart('engagementChart', 'Engagement & Motivation', '#dc2626');
    createOverallChart();
    createTeamComparisonChart();
}

function createCategoryChart(canvasId, category, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const behaviors = categoryBehaviors[category];
    const averages = behaviors.map(behavior => calculateAverage(behavior));

    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: behaviors.map(b => behaviorLabels[b]),
            datasets: [{
                label: 'Μέσος Όρος',
                data: averages,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Μέσος Όρος: ${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Μέση Συχνότητα'
                    }
                }
            }
        }
    });
}

function createOverallChart() {
    const ctx = document.getElementById('overallChart');
    if (!ctx) return;

    const allBehaviorKeys = Object.keys(behaviorLabels);
    const averages = allBehaviorKeys.map(behavior => calculateAverage(behavior));
    const colors = allBehaviorKeys.map(behavior => {
        if (categoryBehaviors['AI Usage Patterns'].includes(behavior)) return '#2563eb';
        if (categoryBehaviors['Team Collaboration'].includes(behavior)) return '#059669';
        if (categoryBehaviors['Problem-Solving Approach'].includes(behavior)) return '#d97706';
        if (categoryBehaviors['Engagement & Motivation'].includes(behavior)) return '#dc2626';
        return '#6c757d';
    });

    if (charts['overallChart']) {
        charts['overallChart'].destroy();
    }

    charts['overallChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: allBehaviorKeys.map(b => behaviorLabels[b]),
            datasets: [{
                label: 'Μέσος Όρος',
                data: averages,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Μέσος Όρος: ${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Μέση Συχνότητα'
                    }
                },
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

function createTeamComparisonChart() {
    const ctx = document.getElementById('teamComparisonChart');
    if (!ctx) return;
    const teamData = {};
    allObservations.forEach(obs => {
        if (!teamData[obs.teamCode]) {
            teamData[obs.teamCode] = {
                count: 0,
                totalBehaviors: 0
            };
        }
        teamData[obs.teamCode].count++;
        teamData[obs.teamCode].totalBehaviors += (obs.totalBehaviorCount || 0);
    });

    const teams = Object.keys(teamData).sort();
    const averages = teams.map(team => 
        teamData[team].totalBehaviors / teamData[team].count
    );

    if (charts['teamComparisonChart']) {
        charts['teamComparisonChart'].destroy();
    }

    charts['teamComparisonChart'] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: teams.map(t => t.toUpperCase()),
            datasets: [{
                label: 'Μέσος Όρος Συμπεριφορών',
                data: averages,
                backgroundColor: '#ff6b00',
                borderColor: '#ff6b00',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const team = teams[context.dataIndex];
                            const count = teamData[team].count;
                            return [
                                `Μέσος Όρος: ${context.parsed.y.toFixed(2)}`,
                                `Παρατηρήσεις: ${count}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Μέση Συχνότητα Συμπεριφορών'
                    }
                }
            }
        }
    });
}

function calculateAverage(behaviorKey) {
    const values = allObservations
        .map(obs => obs.behaviors?.[behaviorKey] || 0)
        .filter(v => v !== null && v !== undefined);
    
    if (values.length === 0) return 0;
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}

function calculateStandardDeviation(behaviorKey) {
    const values = allObservations
        .map(obs => obs.behaviors?.[behaviorKey] || 0)
        .filter(v => v !== null && v !== undefined);
    
    if (values.length === 0) return 0;
    
    const mean = calculateAverage(behaviorKey);
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
    
    return Math.sqrt(avgSquaredDiff);
}

function createDetailedStatsTable() {
    const container = document.getElementById('detailedStatsTable');
    if (!container) return;

    let html = '<table class="comparison-table">';
    html += '<thead><tr>';
    html += '<th>ΣΥΜΠΕΡΙΦΟΡΑ</th>';
    html += '<th>ΚΑΤΗΓΟΡΙΑ</th>';
    html += '<th>ΜΕΣΟΣ ΟΡΟΣ</th>';
    html += '<th>ΤΥΠΙΚΗ ΑΠΟΚΛΙΣΗ</th>';
    html += '<th>MIN</th>';
    html += '<th>MAX</th>';
    html += '<th>ΣΥΝΟΛΟ</th>';
    html += '</tr></thead><tbody>';

    Object.keys(behaviorLabels).forEach(behaviorKey => {
        const category = Object.keys(categoryBehaviors).find(cat => 
            categoryBehaviors[cat].includes(behaviorKey)
        );
        
        const values = allObservations.map(obs => obs.behaviors?.[behaviorKey] || 0);
        const avg = calculateAverage(behaviorKey);
        const std = calculateStandardDeviation(behaviorKey);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const total = values.reduce((sum, v) => sum + v, 0);

        html += '<tr>';
        html += `<td class="behavior-label">${behaviorLabels[behaviorKey]}</td>`;
        html += `<td>${category}</td>`;
        html += `<td>${avg.toFixed(2)}</td>`;
        html += `<td>${std.toFixed(2)}</td>`;
        html += `<td>${min}</td>`;
        html += `<td>${max}</td>`;
        html += `<td><strong>${total}</strong></td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

async function exportToExcel() {
    try {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'loading-overlay';
        statusDiv.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner">⚙️</div>
                <h3>Δημιουργία αρχείου Excel...</h3>
            </div>
        `;
        document.body.appendChild(statusDiv);
		
        const summaryData = prepareSummaryData();
        const detailedData = prepareDetailedData();
        const teamComparisonData = prepareTeamComparisonData();
        const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs');
        const wb = XLSX.utils.book_new();
        const ws1 = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, ws1, 'Συγκεντρωτικά');
        
        const ws2 = XLSX.utils.json_to_sheet(detailedData);
        XLSX.utils.book_append_sheet(wb, ws2, 'Λεπτομερή Στατιστικά');
        
        const ws3 = XLSX.utils.json_to_sheet(teamComparisonData);
        XLSX.utils.book_append_sheet(wb, ws3, 'Σύγκριση Ομάδων');

        const rawData = allObservations.map(obs => ({
            'ID': obs.id,
            'Παρατηρητής': obs.observerId,
            'Ομάδα': obs.teamCode,
            'Ημερομηνία': new Date(obs.submittedAt).toLocaleDateString('el-GR'),
            'Διάρκεια (λεπτά)': Math.round(obs.durationMs / 60000),
            'Σύνολο Συμπεριφορών': obs.totalBehaviorCount,
            ...Object.keys(behaviorLabels).reduce((acc, key) => {
                acc[behaviorLabels[key]] = obs.behaviors?.[key] || 0;
                return acc;
            }, {})
        }));
        
        const ws4 = XLSX.utils.json_to_sheet(rawData);
        XLSX.utils.book_append_sheet(wb, ws4, 'Ακατέργαστα Δεδομένα');

        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `Αναλυτικά_Παρατηρήσεων_${timestamp}.xlsx`;
        XLSX.writeFile(wb, filename);

        document.body.removeChild(statusDiv);
        alert(`✅ Εξαγωγή ολοκληρώθηκε: ${filename}`);

    } catch (error) {
        console.error('Σφάλμα εξαγωγής:', error);
        alert('❌ Σφάλμα εξαγωγής!');
    }
}

function prepareSummaryData() {
    return [{
        'Μετρική': 'Συνολικές Παρατηρήσεις',
        'Τιμή': allObservations.length
    }, {
        'Μετρική': 'Ομάδες που Παρατηρήθηκαν',
        'Τιμή': new Set(allObservations.map(o => o.teamCode)).size
    }, {
        'Μετρική': 'Μέση Διάρκεια (λεπτά)',
        'Τιμή': Math.round(allObservations.reduce((sum, o) => sum + o.durationMs, 0) / allObservations.length / 60000)
    }, {
        'Μετρική': 'Συνολικές Καταγεγραμμένες Συμπεριφορές',
        'Τιμή': allObservations.reduce((sum, o) => sum + (o.totalBehaviorCount || 0), 0)
    }];
}

function prepareDetailedData() {
    return Object.keys(behaviorLabels).map(behaviorKey => {
        const category = Object.keys(categoryBehaviors).find(cat => 
            categoryBehaviors[cat].includes(behaviorKey)
        );
        
        const values = allObservations.map(obs => obs.behaviors?.[behaviorKey] || 0);
        const avg = calculateAverage(behaviorKey);
        const std = calculateStandardDeviation(behaviorKey);

        return {
            'Συμπεριφορά': behaviorLabels[behaviorKey],
            'Κατηγορία': category,
            'Μέσος Όρος': parseFloat(avg.toFixed(2)),
            'Τυπική Απόκλιση': parseFloat(std.toFixed(2)),
            'Ελάχιστο': Math.min(...values),
            'Μέγιστο': Math.max(...values),
            'Σύνολο': values.reduce((sum, v) => sum + v, 0)
        };
    });
}

function prepareTeamComparisonData() {
    const teamData = {};
    
    allObservations.forEach(obs => {
        if (!teamData[obs.teamCode]) {
            teamData[obs.teamCode] = {
                observations: [],
                totalBehaviors: 0
            };
        }
        teamData[obs.teamCode].observations.push(obs);
        teamData[obs.teamCode].totalBehaviors += (obs.totalBehaviorCount || 0);
    });

    return Object.keys(teamData).map(team => ({
        'Ομάδα': team.toUpperCase(),
        'Παρατηρήσεις': teamData[team].observations.length,
        'Συνολικές Συμπεριφορές': teamData[team].totalBehaviors,
        'Μέσος Όρος Συμπεριφορών': parseFloat((teamData[team].totalBehaviors / teamData[team].observations.length).toFixed(2))
    }));
}

async function exportChartsAsPDF() {
    alert('ℹ️ Η λειτουργία εξαγωγής σε PDF θα υλοποιηθεί σύντομα. Προς το παρόν, μπορείτε να χρησιμοποιήσετε τη λειτουργία εκτύπωσης του προγράμματος περιήγησης (Ctrl+P).');
}