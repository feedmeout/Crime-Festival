const CORRECT_SUSPECTS = ['konstantinos', 'georgios', 'eleni'];
        const SUSPECT_NAMES = {
            'maria': 'Παπαδοπούλου Μαρία',
            'konstantinos': 'Αναγνώστου Κωνσταντίνος',
            'eleni': 'Μαυρίδη Ελένη',
            'georgios': 'Πετρόπουλος Γεώργιος',
            'alexandra': 'Νικολάου Αλεξάνδρα',
            'suicide': 'Αυτοκτονία'
        };
		
        const SCORING = {
            murder_diagnosis: 25,
            cooperation: 20,
            perpetrator: 15,
            perfect_solution_bonus: 20,
            evidence_use: 5,
            prompts_1_5: 15,
            prompts_6_10: 10,
            prompts_11_15: 5,
            time_under_30: 15,
            time_30_45: 10,
            time_45_60: 5
        };

        let firestoreUnsubscribe = null;

        function showSyncStatus(message, type = 'success') {
            const status = document.getElementById('syncStatus');
            if (!status) return;
            
            status.classList.remove('syncing');
            
            if (type === 'syncing') {
                status.classList.add('syncing');
                status.style.background = '#17a2b8';
            } else if (type === 'success') {
                status.style.background = '#28a745';
            } else if (type === 'error') {
                status.style.background = '#dc3545';
            }
            
            status.innerHTML = message;
            status.style.display = 'block';
            
            if (type !== 'syncing') {
                setTimeout(() => {
                    status.style.display = 'none';
                }, 3000);
            }
        }

        function setupRealtimeListener() {
            if (!window.firebaseDB || !window.firebaseOnSnapshot) {
                console.warn('⚠️ Firebase not ready - using periodic refresh');
                startPolling();
                return;
            }

            try {
                const teamsCollection = window.firebaseCollection(window.firebaseDB, 'teams');
                
                let pollingInterval = null;
                let isFirestoreActive = false;

                function startPolling() {
                    if (pollingInterval) return;
                    console.log('📡 Starting polling mode (every 10 seconds)');
                    pollingInterval = setInterval(refreshLeaderboard, 10000);
                }

                function stopPolling() {
                    if (pollingInterval) {
                        clearInterval(pollingInterval);
                        pollingInterval = null;
                        console.log('🛑 Polling stopped');
                    }
                }

                firestoreUnsubscribe = window.firebaseOnSnapshot(teamsCollection, 
                    (snapshot) => {
                        console.log('🔥 Firebase real-time update received');
                        isFirestoreActive = true;
                        stopPolling();
                        
                        let hasChanges = false;
                        
                        snapshot.docChanges().forEach((change) => {
                            if (change.type === 'added' || change.type === 'modified') {
                                console.log(`📝 Team ${change.doc.id} was ${change.type}`);
                                hasChanges = true;
                            }
                            if (change.type === 'removed') {
                                console.log(`🗑️ Team ${change.doc.id} was removed`);
                                hasChanges = true;
                            }
                        });
                        
                        if (hasChanges) {
                            showSyncStatus('🔄 Updating...', 'syncing');
                            debouncedRefreshLeaderboard();
                        }
                    },
                    (error) => {
                        console.error('❌ Firebase listener error:', error);
                        isFirestoreActive = false;
                        showSyncStatus('⚠️ Connection lost - retrying...', 'error');
                        startPolling();
                    }
                );
                
                console.log('✅ Real-time Firebase listener active');
                showSyncStatus('🔴 Real-time sync active', 'success');
                
            } catch (error) {
                console.error('❌ Failed to setup Firebase listener:', error);
                showSyncStatus('⚠️ Using backup mode', 'error');
                setInterval(refreshLeaderboard, 10000);
            }
        }

        function calculateScore(selectedSuspects, totalTimeMs, promptCount) {
            let score = 0;
            let breakdown = [];
            
            if (selectedSuspects.length === 0) {
                return {
                    score: 0,
                    breakdown: ['Δεν επέλεξαν κανέναν ύποπτο ή αυτοκτονία'],
                    maxScore: 140,
                    correctCount: 0
                };
            }
            
            const hasSuicide = selectedSuspects.includes('suicide');
            const hasKiller = selectedSuspects.some(s => s !== 'suicide');
            
            if (hasSuicide && hasKiller) {
                const killerNames = selectedSuspects
                    .filter(s => s !== 'suicide')
                    .map(s => SUSPECT_NAMES[s])
                    .join(', ');
                
                return {
                    score: 0,
                    breakdown: [
                        'HEADER:🚫 ΛΟΓΙΚΗ ΑΝΤΙΦΑΣΗ (+0 πόντοι)',
                        'CONTRADICTION:Η υπόθεση δεν μπορεί να είναι ταυτόχρονα δολοφονία και αυτοκτονία',
                        `INFO:Επέλεξαν: ${killerNames} + Αυτοκτονία`,
                    ],
                    maxScore: 140,
                    correctCount: 0
                };
            }

            if (hasSuicide && !hasKiller) {
                return {
                    score: 0,
                    breakdown: [
                        'HEADER:❌ ΕΣΦΑΛΜΕΝΗ ΘΕΩΡΙΑ (+0 πόντοι)',
                        'ERROR:Αυτό δεν ήταν αυτοκτονία',
                        'SUBHEADER:Βασικά Στοιχεία που Αγνόησαν:',
                        'ITEM:Γάντια λάτεξ στην πόρτα',
                        'ITEM:Πλαστό email "αυτοκτονίας"',
                        'ITEM:Απενεργοποίηση κάμερων',
                        'ITEM:Κυάνιο σε μπουκάλι που δεν ήταν του θύματος',
                    ],
                    maxScore: 140,
                    correctCount: 0
                };
            }

            let basicPoints = SCORING.murder_diagnosis;
            score += basicPoints;
            breakdown.push(`HEADER:🧩 ΒΑΣΙΚΗ ΕΚΤΙΜΗΣΗ (+${basicPoints} πόντοι)`);
            breakdown.push('SUCCESS:Σωστή Διάγνωση: ΔΟΛΟΦΟΝΙΑ');
            
            let correctCount = 0;
            let wrongSuspects = [];
            let missedSuspects = [];
            
            selectedSuspects.forEach(suspect => {
                if (CORRECT_SUSPECTS.includes(suspect)) {
                    correctCount++;
                } else {
                    wrongSuspects.push(SUSPECT_NAMES[suspect] || suspect);
                }
            });
            
            CORRECT_SUSPECTS.forEach(suspect => {
                if (!selectedSuspects.includes(suspect)) {
                    missedSuspects.push(SUSPECT_NAMES[suspect] || suspect);
                }
            });

            let perpetratorPoints = 0;
            
            if (correctCount === 3 && selectedSuspects.length === 3) {
                perpetratorPoints = SCORING.perpetrator * 3 + SCORING.perfect_solution_bonus + SCORING.cooperation;
                breakdown.push(`HEADER:🎖️ ΤΕΛΕΙΑ ΑΝΑΛΥΣΗ (+${perpetratorPoints} πόντοι)`);
                breakdown.push('SUCCESS:Εντόπισαν και τους 3 συνεργούς');
            } else {
                breakdown.push(`HEADER:👥 ΤΑΥΤΟΠΟΙΗΣΗ ΔΡΑΣΤΩΝ (+${perpetratorPoints} πόντοι - προσωρινό)`);
                
                if (correctCount > 0) {
                    perpetratorPoints += correctCount * SCORING.perpetrator;
                    breakdown.push(`SUCCESS:Εντόπισαν ${correctCount}/3 Δράστες`);
                }
                
                if (correctCount >= 2) {
                    perpetratorPoints += SCORING.cooperation;
                    breakdown.push('SUCCESS:Bonus Συνεργασίας Δραστών');
                }
                
                if (correctCount >= 2 && correctCount < 3) {
                    perpetratorPoints += SCORING.evidence_use;
                }
                
                if (wrongSuspects.length === 0 && correctCount > 0 && correctCount < 3) {
                    const precisionBonus = correctCount * 15;
                    perpetratorPoints += precisionBonus;
                    breakdown.push('SUCCESS:Bonus Ακρίβειας (δεν κατηγόρησαν αθώους)');
                }
                
                const headerIndex = breakdown.findIndex(line => line.includes('👥 ΤΑΥΤΟΠΟΙΗΣΗ ΔΡΑΣΤΩΝ'));
                if (headerIndex !== -1) {
                    breakdown[headerIndex] = `HEADER:👥 ΤΑΥΤΟΠΟΙΗΣΗ ΔΡΑΣΤΩΝ (+${perpetratorPoints} πόντοι)`;
                }
            }

            score += perpetratorPoints;
            
            if (correctCount >= 2) {
                let efficiencyPoints = 0;
                let efficiencyItems = [];
                
                if (totalTimeMs) {
                    const minutes = totalTimeMs / 60000;
                    if (minutes < 30) {
                        efficiencyPoints += SCORING.time_under_30;
                        efficiencyItems.push('SUCCESS:Χρόνος: <30 λεπτά');
                    } else if (minutes < 45) {
                        efficiencyPoints += SCORING.time_30_45;
                        efficiencyItems.push('SUCCESS:Χρόνος: 30-45 λεπτά');
                    } else if (minutes < 60) {
                        efficiencyPoints += SCORING.time_45_60;
                        efficiencyItems.push('SUCCESS:Χρόνος: 45-60 λεπτά');
                    }
                }

                if (promptCount) {
                    if (promptCount <= 5) {
                        efficiencyPoints += SCORING.prompts_1_5;
                        efficiencyItems.push('SUCCESS:Prompts: ≤5');
                    } else if (promptCount <= 10) {
                        efficiencyPoints += SCORING.prompts_6_10;
                        efficiencyItems.push('SUCCESS:Prompts: 6-10');
                    } else if (promptCount <= 15) {
                        efficiencyPoints += SCORING.prompts_11_15;
                        efficiencyItems.push('SUCCESS:Prompts: 11-15');
                    }
                }
                
                if (efficiencyPoints > 0) {
                    breakdown.push(`HEADER:⚡ BONUSES ΑΠΟΔΟΤΙΚΟΤΗΤΑΣ (+${efficiencyPoints} πόντοι)`);
                    breakdown.push(...efficiencyItems);
                }
                
                score += efficiencyPoints;
            }
            
            if (wrongSuspects.length > 0) {
                const originalScore = score;
                let multiplier = 1.0;
                
                if (wrongSuspects.length === 1) {
                    multiplier = 0.5;
                } else if (wrongSuspects.length === 2) {
                    multiplier = 0.2;
                } else {
                    multiplier = 0.05;
                }
                
                score = Math.floor(score * multiplier);
                const penalty = originalScore - score;
                
                breakdown.push(`HEADER:❌ ΚΑΤΗΓΟΡΗΣΑΝ ΑΘΩΟΥΣ (-${penalty} πόντοι)`);
                wrongSuspects.forEach(name => {
                    breakdown.push(`PENALTY:${name}`);
                });
            }
                
            if (missedSuspects.length > 0) {
                const missedPenalty = missedSuspects.length * 20;
                score = Math.max(0, score - missedPenalty);
                
                breakdown.push(`HEADER:🔍 ΕΧΑΣΑΝ ΠΡΑΓΜΑΤΙΚΟΥΣ ΔΡΑΣΤΕΣ (-${missedPenalty} πόντοι)`);
                missedSuspects.forEach(name => {
                    breakdown.push(`PENALTY:${name}`);
                });
            }

            score = Math.max(0, Math.min(score, 140));
            
            return { 
                score, 
                breakdown, 
                maxScore: 140, 
                correctCount, 
                wrongCount: wrongSuspects.length 
            };
        }

        function getGrade(percentage) {
            if (percentage >= 90) return { name: 'ΑΡΧΙ-ΝΤΕΤΕΚΤΙΒΣ 🕵️', color: '#00d4ff' };
            if (percentage >= 80) return { name: 'ΑΝΩΤΕΡΟΙ ΑΝΑΚΡΙΤΕΣ 🎖️', color: '#ffd700' };
            if (percentage >= 70) return { name: 'ΝΤΕΤΕΚΤΙΒΑΣ 🔎', color: '#c0c0c0' };
            if (percentage >= 60) return { name: 'ΑΣΤΥΝΟΜΟΙ 👮', color: '#cd7f32' };
            if (percentage >= 50) return { name: 'ΕΡΕΥΝΗΤΕΣ 📋', color: '#ffcc00' };
            if (percentage >= 40) return { name: 'ΑΣΚΟΥΜΕΝΟΙ 🎓', color: '#28a745' };
            return { name: 'ΝΕΟΣΥΛΛΕΚΤΟΙ 🎯', color: '#6c757d' };
        }

        function formatTime(ms) {
            if (!ms) return 'N/A';
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            
            const h = hours;
            const m = minutes % 60;
            const s = seconds % 60;
            
            if (h > 0) {
                return `${h}ω ${m}λ ${s}δ`;
            } else if (m > 0) {
                return `${m}λ ${s}δ`;
            } else {
                return `${s}δ`;
            }
        }

        let refreshTimeout = null;

        function debouncedRefreshLeaderboard() {
            if (refreshTimeout) clearTimeout(refreshTimeout);
            
            refreshTimeout = setTimeout(() => {
                refreshLeaderboard();
                refreshTimeout = null;
            }, 500);
        }

        async function refreshLeaderboard() {
            try {
                const querySnapshot = await window.firebaseGetDocs(
                    window.firebaseCollection(window.firebaseDB, 'teams')
                );
                
                const teams = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.solution) {
                        teams.push({
                            name: doc.id,
                            ...data
                        });
                    }
                });

                teams.sort((a, b) => b.solution.score - a.solution.score);

                displayLeaderboard(teams);
                displayStats(teams);
                
                showSyncStatus('✅ Updated', 'success');

            } catch (error) {
                console.error('Error loading leaderboard:', error);
                showSyncStatus('❌ Update failed', 'error');
            }
        }

        function displayStats(teams) {
            const statsCards = document.querySelectorAll('.stat-card .value');
            
            const totalTeams = teams.length;
            const perfectScores = teams.filter(t => {
                const suspects = t.solution.suspects || [];
                return suspects.length === 3 && 
                       suspects.includes('konstantinos') && 
                       suspects.includes('georgios') && 
                       suspects.includes('eleni');
            }).length;
            
            const avgScore = totalTeams > 0 
                ? Math.round(teams.reduce((sum, t) => sum + t.solution.score, 0) / totalTeams)
                : 0;
            
            const avgTime = totalTeams > 0
                ? formatTime(teams.reduce((sum, t) => sum + (t.solution.completionTimeMs || 0), 0) / totalTeams)
                : 'N/A';

            statsCards[0].textContent = totalTeams;
            statsCards[1].textContent = perfectScores;
            statsCards[2].textContent = avgScore;
            statsCards[3].textContent = avgTime;
        }

        function displayLeaderboard(teams) {
            const tbody = document.getElementById('leaderboardBody');
            const mobileCards = document.getElementById('mobileCards');
            
            if (teams.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 40px; color: #666;">
                            ΔΕΝ ΥΠΑΡΧΟΥΝ ΥΠΟΒΟΛΕΣ ΑΚΟΜΑ
                        </td>
                    </tr>
                `;
                mobileCards.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        ΔΕΝ ΥΠΑΡΧΟΥΝ ΥΠΟΒΟΛΕΣ ΑΚΟΜΑ
                    </div>
                `;
                return;
            }
			
            tbody.innerHTML = teams.map((team, index) => {
                const rank = index + 1;
                const rankClass = rank <= 3 ? `rank-${rank}` : '';
                const solution = team.solution;
                const suspects = solution.suspects || [];
                
                const maxScore = solution.maxScore || 140;
                const percentage = Math.round((solution.score / maxScore) * 100);
                const grade = getGrade(percentage);

                return `
                    <tr>
                        <td class="rank ${rankClass}">${rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}</td>
                        <td class="team-name">${team.name.toUpperCase()}</td>
                        <td class="score">${solution.score}/${maxScore}</td>
                        <td>
                            <span class="grade-badge" style="background: ${grade.color}; color: ${percentage >= 50 ? '#000' : '#fff'};">
                                ${grade.name}
                            </span>
                        </td>
                        <td>
                            ${suspects.map(s => `
                                <span class="badge ${CORRECT_SUSPECTS.includes(s) ? 'badge-correct' : 'badge-incorrect'}">
                                    ${SUSPECT_NAMES[s] || s}
                                </span>
                            `).join('')}
                        </td>
                        <td>${formatTime(solution.completionTimeMs)}</td>
                        <td>${solution.promptCount || 0}</td>
                        <td>
                            <button class="btn btn-primary" style="padding: 8px 16px; font-size: 12px; min-height: 36px;" onclick="viewSolution('${team.name}')">
                                👁️ Προβολή
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');

            mobileCards.innerHTML = teams.map((team, index) => {
                const rank = index + 1;
                const rankClass = rank <= 3 ? `rank-${rank}` : '';
                const solution = team.solution;
                const suspects = solution.suspects || [];
                
                const maxScore = solution.maxScore || 140;
                const percentage = Math.round((solution.score / maxScore) * 100);
                const grade = getGrade(percentage);

                const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

                return `
                    <div class="team-card">
                        <div class="card-header">
                            <div class="card-rank ${rankClass}">${rankEmoji}</div>
                            <div class="card-team-name">${team.name.toUpperCase()}</div>
                            <div class="card-score">${solution.score}/${maxScore}</div>
                        </div>
                        <button class="btn btn-primary" style="width: 100%; margin-top: 15px;" onclick="viewSolution('${team.name}')">
                            👁️ Προβολή Λύσης
                        </button>
                    </div>
                `;
            }).join('');
        }

        window.viewSolution = async function(teamName) {
            try {
                const querySnapshot = await window.firebaseGetDocs(
                    window.firebaseCollection(window.firebaseDB, 'teams')
                );
                
                let teamData = null;
                querySnapshot.forEach((doc) => {
                    if (doc.id === teamName) {
                        teamData = doc.data();
                    }
                });

                if (!teamData || !teamData.solution) {
                    alert('Δεν βρέθηκαν δεδομένα για αυτή την ομάδα');
                    return;
                }

                const oldSolution = teamData.solution;
                const recalculated = calculateScore(
                    oldSolution.suspects || [],
                    oldSolution.completionTimeMs,
                    oldSolution.promptCount
                );
                
                const solution = {
                    ...oldSolution,
                    breakdown: recalculated.breakdown,
                    score: recalculated.score
                };

                const suspects = solution.suspects || [];
                const maxScore = solution.maxScore || 140;
                const percentage = Math.round((solution.score / maxScore) * 100);
                const grade = getGrade(percentage);
                const hasSuicide = suspects.includes('suicide');
                const hasKiller = suspects.some(s => s !== 'suicide');
                const isContradiction = hasSuicide && hasKiller;
                
                document.getElementById('modalTeamName').textContent = 
                    `ΛΥΣΗ ΟΜΑΔΑΣ: ${teamName.toUpperCase()}`;

                document.getElementById('modalContent').innerHTML = `
                    <div class="solution-details">
                        <h3>📊 ΒΑΘΜΟΛΟΓΙΑ</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr)); gap: 10px; margin: 15px 0;">
                            <div style="background: ${solution.score === 0 ? '#f8d7da' : '#d4edda'}; padding: 15px; border-radius: 8px; text-align: center;">
                                <strong style="color: #666; font-size: clamp(11px, 2.3vw, 13px); display: block; margin-bottom: 8px;">ΠΟΝΤΟΙ</strong>
                                <span style="font-size: clamp(22px, 5vw, 32px); font-weight: bold; color: ${solution.score === 0 ? '#dc3545' : '#28a745'};">${solution.score}/${maxScore}</span>
                            </div>
                            <div style="background: ${grade.color}; padding: 15px; border-radius: 8px; text-align: center;">
                                <strong style="color: ${percentage >= 50 ? '#000' : '#fff'}; font-size: clamp(11px, 2.3vw, 13px); display: block; margin-bottom: 8px;">ΤΙΤΛΟΣ</strong>
                                <span style="font-size: clamp(14px, 3vw, 18px); font-weight: bold; color: ${percentage >= 50 ? '#000' : '#fff'};">${grade.name}</span>
                            </div>
                            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
                                <strong style="color: #666; font-size: clamp(11px, 2.3vw, 13px); display: block; margin-bottom: 8px;">ΕΠΙΔΟΣΗ</strong>
                                <span style="font-size: clamp(22px, 5vw, 32px); font-weight: bold; color: #1976d2;">${percentage}%</span>
                            </div>
                        </div>
                        
                        ${isContradiction ? `
                            <div style="background: #f8d7da; border: 2px solid #dc3545; padding: 15px; border-radius: 8px; margin: 15px 0;">
                                <strong style="color: #721c24;">⚠️ ΛΟΓΙΚΗ ΑΝΤΙΦΑΣΗ:</strong>
                                <p style="color: #721c24; margin: 5px 0;">Η ομάδα επέλεξε ταυτόχρονα δολοφονία ΚΑΙ αυτοκτονία</p>
                            </div>
                        ` : ''}
                        
                        <h3 style="margin-top: 20px;">👥 ΔΡΑΣΤΕΣ ΠΟΥ ΕΠΕΛΕΞΑΝ</h3>
                        <div class="suspect-list">
                            ${suspects.map(s => `
                                <span class="badge ${CORRECT_SUSPECTS.includes(s) ? 'badge-correct' : 'badge-incorrect'}" style="font-size: clamp(12px, 2.5vw, 14px); padding: 8px 12px;">
                                    ${CORRECT_SUSPECTS.includes(s) ? '✔' : '✗'} ${SUSPECT_NAMES[s] || s}
                                </span>
                            `).join('')}
                        </div>

                        <h3 style="margin-top: 20px;">📝 ΑΙΤΙΟΛΟΓΗΣΗ</h3>
                        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd; white-space: pre-wrap; word-wrap: break-word; line-height: 1.6; max-height: 300px; overflow-y: auto; font-size: clamp(12px, 2.5vw, 14px);">
                            ${solution.justification || 'Δεν παρασχέθηκε αιτιολόγηση'}
                        </div>

                        <h3 style="margin-top: 20px;">⏱️ ΧΡΟΝΟΣ ΕΠΙΛΥΣΗΣ</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 12px; margin-top: 10px;">
                            ${(() => {
                                const ms = solution.completionTimeMs;
                                const seconds = Math.floor(ms / 1000);
                                const minutes = Math.floor(seconds / 60);
                                const hours = Math.floor(minutes / 60);
                                
                                const h = hours;
                                const m = minutes % 60;
                                const s = seconds % 60;
                                
                                let timeUnits = [];
                                if (h > 0) timeUnits.push({value: h, label: 'ΩΡΕΣ'});
                                if (m > 0 || h > 0) timeUnits.push({value: m, label: 'ΛΕΠΤΑ'});
                                timeUnits.push({value: s, label: 'ΔΕΥΤ.'});
                                
                                return timeUnits.map(unit => `
                                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                                        <div style="font-size: clamp(32px, 7vw, 42px); font-weight: bold; color: white; line-height: 1; text-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                                            ${unit.value}
                                        </div>
                                        <div style="font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 8px; text-transform: uppercase; letter-spacing: 1px;">
                                            ${unit.label}
                                        </div>
                                    </div>
                                `).join('');
                            })()}
                        </div>

                        <h3 style="margin-top: 25px; margin-bottom: 15px;">🎯 ΑΝΑΛΥΤΙΚΗ ΒΑΘΜΟΛΟΓΙΑ</h3>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: clamp(11px, 2vw, 13px); line-height: 1.7; max-height: 400px; overflow-y: auto; word-wrap: break-word;">
                            ${solution.breakdown.map(line => {
                                const [type, content] = line.split(':');
                                
                                if (type === 'HEADER') {
                                    return `<div style="background: linear-gradient(135deg, #0f3460 0%, #16213e 100%); color: white; padding: clamp(10px, 2vw, 12px) clamp(12px, 2.5vw, 15px); margin: 15px 0 10px 0; border-radius: 8px; font-weight: bold; font-size: clamp(13px, 2.5vw, 15px); box-shadow: 0 2px 8px rgba(0,0,0,0.2);">${content}</div>`;
                                }
                                
                                if (type === 'SUCCESS') {
                                    return `<div style="background: #fff8e1; padding: clamp(8px, 1.5vw, 10px) clamp(12px, 2.5vw, 15px); margin: 5px 0; border-left: 4px solid #ffc107; border-radius: 4px; color: #f57f17; font-weight: 500;">${content}</div>`;
                                }
                                
                                if (type === 'PENALTY') {
                                    return `<div style="background: #ffebee; padding: clamp(6px, 1.2vw, 8px) clamp(10px, 2vw, 12px); margin: 3px 0 3px 20px; border-left: 3px solid #dc3545; border-radius: 4px; color: #c62828;">→ ${content}</div>`;
                                }
                                
                                if (type === 'ERROR') {
                                    return `<div style="background: #ffebee; padding: clamp(8px, 1.5vw, 10px) clamp(12px, 2.5vw, 15px); margin: 5px 0; border-left: 4px solid #dc3545; border-radius: 4px; color: #c62828; font-weight: 500;">${content}</div>`;
                                }
                                
                                if (type === 'CONTRADICTION') {
                                    return `<div style="background: #fff3e0; padding: clamp(8px, 1.5vw, 10px) clamp(12px, 2.5vw, 15px); margin: 5px 0; border-left: 4px solid #ff9800; border-radius: 4px; color: #e65100; font-weight: 500;">${content}</div>`;
                                }
                                
                                if (type === 'SUBHEADER') {
                                    return `<div style="padding: clamp(8px, 1.5vw, 10px) clamp(5px, 1vw, 8px); margin: 10px 0 5px 0; color: #0f3460; font-weight: bold; font-size: clamp(12px, 2.2vw, 14px);">${content}</div>`;
                                }
                                
                                if (type === 'ITEM') {
                                    return `<div style="padding: clamp(4px, 1vw, 5px) clamp(5px, 1vw, 8px) clamp(4px, 1vw, 5px) clamp(20px, 4vw, 25px); margin: 2px 0; color: #555;">• ${content}</div>`;
                                }
                                
                                if (type === 'INFO') {
                                    return `<div style="background: #e3f2fd; padding: clamp(8px, 1.5vw, 10px) clamp(12px, 2.5vw, 15px); margin: 5px 0; border-left: 4px solid #2196f3; border-radius: 4px; color: #0d47a1;">${content}</div>`;
                                }
                                
                                return `<div style="padding: 5px 0; color: #333;">${line}</div>`;
                            }).join('')}
                        </div>
                    </div>
                `;

                document.getElementById('solutionModal').classList.add('active');
                document.body.style.overflow = 'hidden';

            } catch (error) {
                console.error('Error loading solution:', error);
                alert('Σφάλμα φόρτωσης λύσης');
            }
        };

        window.closeModal = function() {
            document.getElementById('solutionModal').classList.remove('active');
            document.body.style.overflow = '';
        };

        window.refreshLeaderboard = refreshLeaderboard;

        document.getElementById('solutionModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        window.addEventListener('beforeunload', function() {
            if (firestoreUnsubscribe) {
                firestoreUnsubscribe();
            }
        });

        window.addEventListener('online', () => {
            console.log('🟢 Back online');
            showSyncStatus('🟢 Reconnecting...', 'syncing');
        });

        window.addEventListener('offline', () => {
            console.log('🔴 Offline');
            showSyncStatus('🔴 Offline - Data may be stale', 'error');
        });