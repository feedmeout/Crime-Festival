function getTeamMemberParams() {
            const urlParams = new URLSearchParams(window.location.search);
            const team = urlParams.get('team');
            const member = urlParams.get('member');
            
            if (!team || !member) {
                return null;
            }
            
            return { team, member };
        }

        const TEAM_MEMBER = getTeamMemberParams();
        
if (!TEAM_MEMBER) {
            document.getElementById('app').innerHTML = `
                <div class="form-section active center-content">
                    <div class="warning-icon">⚠️</div>
                    <h1 class="error-title">Λάθος Πρόσβαση</h1>
                    <p>Πρέπει να εισέλθετε μέσω της αρχικής σελίδας.</p>
                    <button class="btn btn-primary" onclick="window.location.href='team_entry.html'">
                        Επιστροφή
                    </button>
                </div>
            `;
        }
        
        let surveyData = {};
        let currentSection = 0;
        let surveyType = null;
        let totalSections = 0;
        let existingPreData = null;
        let existingPostData = null;
        
console.log('Team:', TEAM_MEMBER?.team, 'Member:', TEAM_MEMBER?.member);

        let initAttempts = 0;
        const maxAttempts = 50;
        
        function waitForFirebase() {
            if (window.firebaseReady) {
                initializeSurvey();
            } else if (initAttempts < maxAttempts) {
                initAttempts++;
                setTimeout(waitForFirebase, 100);
            } else {
                alert('Σφάλμα σύνδεσης. Παρακαλώ ανανεώστε τη σελίδα.');
            }
        }

        setTimeout(waitForFirebase, 500);

async function initializeSurvey() {
            try {
                const preDocId = `${TEAM_MEMBER.team}_pre_${TEAM_MEMBER.member}`;
                const preDocRef = window.firebaseDoc(window.firebaseDB, 'surveys', preDocId);
                const preSnap = await window.firebaseGetDoc(preDocRef);
                if (preSnap.exists()) {
                    existingPreData = preSnap.data();
                }

                const postDocId = `${TEAM_MEMBER.team}_post_${TEAM_MEMBER.member}`;
                const postDocRef = window.firebaseDoc(window.firebaseDB, 'surveys', postDocId);
                const postSnap = await window.firebaseGetDoc(postDocRef);
                if (postSnap.exists()) {
                    existingPostData = postSnap.data();
                }
            } catch (error) {
                console.error('Error checking data:', error);
            }
            
            renderWelcome();
        }

function renderWelcome() {
    const hasPreData = existingPreData !== null;
    const hasPostData = existingPostData !== null;
    
    if (hasPreData && hasPostData) {
        document.getElementById('app').innerHTML = `
            <div class="header">
                <h1>ΕΡΕΥΝΗΤΙΚΟ ΕΡΩΤΗΜΑΤΟΛΟΓΙΟ</h1>
                <p>ΜΕΛΕΤΗ ΧΡΗΣΗΣ (ΓΕΝΕΤΙΚΗΣ) ΤΕΧΝΗΤΗΣ ΝΟΗΜΟΣΥΝΗΣ</p>
            </div>
            
            <div class="form-section active center-content">
                <div class="success-icon">🎉</div>
                <h1 class="success-title">
                    ΣΑΣ ΕΥΧΑΡΙΣΤΟΥΜΕ ΘΕΡΜΑ<br>ΓΙΑ ΤΗ ΣΥΜΜΕΤΟΧΗ ΣΑΣ!
                </h1>
                
<div class="info-box" style="text-align: center; padding: clamp(25px, 4vw, 35px);">
                    <div style="margin-bottom: 20px;">
                        <span style="font-size: clamp(20px, 3vw, 24px); margin-right: 10px;">📋</span>
                        <strong style="display: block; margin-top: 8px; font-size: clamp(14px, 2.5vw, 16px);">ΠΡΟΚΑΤΑΡΚΤΙΚΗ ΕΡΕΥΝΑ</strong>
                        <small style="color: var(--gray-600); font-size: clamp(12px, 2vw, 14px);">Ημερομηνία: ${new Date(existingPreData.submittedAt).toLocaleString('el-GR')}</small>
                    </div>
                    <div>
                        <span style="font-size: clamp(20px, 3vw, 24px); margin-right: 10px;">📊</span>
                        <strong style="display: block; margin-top: 8px; font-size: clamp(14px, 2.5vw, 16px);">ΤΕΛΙΚΗ ΕΡΕΥΝΑ</strong>
                        <small style="color: var(--gray-600); font-size: clamp(12px, 2vw, 14px);">Ημερομηνία: ${new Date(existingPostData.submittedAt).toLocaleString('el-GR')}</small>
                    </div>
                </div>
                
                <p style="text-align: center; margin: 30px 0; font-size: clamp(15px, 3vw, 17px); color: var(--gray-700);">
                    <strong>✅ ΜΠΟΡΕΙΤΕ ΝΑ ΚΛΕΙΣΕΤΕ ΑΥΤΗ ΤΗΝ ΚΑΡΤΕΛΑ!</strong>
                </p>
            </div>
        `;
        return;
    }

    if (hasPostData && !hasPreData) {
        document.getElementById('app').innerHTML = `
            <div class="header">
                <h1>ΕΡΕΥΝΗΤΙΚΟ ΕΡΩΤΗΜΑΤΟΛΟΓΙΟ</h1>
                <p>ΜΕΛΕΤΗ ΧΡΗΣΗΣ (ΓΕΝΕΤΙΚΗΣ) ΤΕΧΝΗΤΗΣ ΝΟΗΜΟΣΥΝΗΣ</p>
            </div>
            
            <div class="form-section active center-content">
                <div class="warning-icon">⚠️</div>
                <h1 class="error-title">Σφάλμα</h1>
                <p class="success-message">
                    Έχετε ολοκληρώσει την τελική έρευνα αλλά όχι την προκαταρκτική.
                    Παρακαλώ επικοινωνήστε με τον ερευνητή.
                </p>
            </div>
        `;
        return;
    }

    document.getElementById('app').innerHTML = `
        <div class="header">
            <h1>ΕΡΕΥΝΗΤΙΚΟ ΕΡΩΤΗΜΑΤΟΛΟΓΙΟ</h1>
            <p>ΜΕΛΕΤΗ ΧΡΗΣΗΣ (ΓΕΝΕΤΙΚΗΣ) ΤΕΧΝΗΤΗΣ ΝΟΗΜΟΣΥΝΗΣ</p>
        </div>
        
        <div class="form-section active">
            <div class="center-content" style="margin-bottom: 40px;">
                <div class="large-icon">🎯</div>
                <h1 class="main-title">
                    ΕΡΓΑΣΤΗΡΙΟ ΓΝΩΣΗΣ & ΕΥΦΥΟΥΣ ΠΛΗΡΟΦΟΡΙΚΗΣ
                </h1>
                <p class="main-subtitle">
                    ΦΕΣΤΙΒΑΛ ΑΣΤΥΝΟΜΙΚΗΣ ΛΟΓΟΤΕΧΝΙΑΣ 2025
                </p>
            </div>
            
            ${hasPreData ? `
                <div class="completed-box">
                    <p class="completed-text">✅ ΕΧΕΤΕ ΣΥΜΠΛΗΡΩΣΕΙ ΤΗΝ ΠΡΟΚΑΤΑΡΚΤΙΚΗ ΕΡΕΥΝΑ</p>
                    <p class="completed-date">Ημερομηνία: ${new Date(existingPreData.submittedAt).toLocaleString('el-GR')}</p>
                </div>
                
                <div class="alert-box text-center">
                    <p class="alert-message">🎮 ΕΤΟΙΜΟΙ ΓΙΑ ΤΗΝ ΤΕΛΙΚΗ ΕΡΕΥΝΑ;</p>
                </div>
            ` : `
                <div class="procedure-box">
                    <p class="procedure-title">📋 ΔΙΑΔΙΚΑΣΙΑ</p>
                    <ol class="procedure-list">
                        <li><strong>ΠΡΩΤΑ:</strong> Συμπληρώστε την Προκαταρκτική Έρευνα</li>
                        <li><strong>ΜΕΤΑ:</strong> Συμμετέχετε στη δραστηριότητα/παιχνίδι</li>
                        <li><strong>ΤΕΛΟΣ:</strong> Επιστρέψτε και συμπληρώστε την Τελική Έρευνα</li>
                    </ol>
                </div>
                
                <div class="note-box">
                    <p class="note-text"><strong>📌 ΣΗΜΕΙΩΣΕΙΣ!</strong></p>
                    <p class="note-text">• Η έρευνα είναι ανώνυμη</p>
                    <p class="note-text">• Διάρκεια: 5-10 λεπτά</p>
                    <p class="note-text" style="color: #d32f2f; font-weight: 600;">• Παρακαλούμε απαντήστε ειλικρινά - δεν υπάρχουν σωστές ή λάθος απαντήσεις!</p>
                </div>
            `}
            
            <div class="form-group" style="margin-top: 40px;">
                <label class="required section-label">
                    ΕΠΙΛΟΓΗ ΕΡΕΥΝΑΣ:
                </label>
                <div class="radio-group">
                    <label class="radio-option" style="padding: clamp(20px, 3vw, 25px); ${hasPreData ? 'opacity: 0.5;' : ''}">
                        <input type="radio" name="survey-type" value="pre" required ${hasPreData ? 'disabled' : ''}>
                        <div>
                            <div class="survey-option-icon">📋</div>
                            <strong class="survey-option-title">ΠΡΟΚΑΤΑΡΚΤΙΚΗ</strong>
                            <small class="survey-option-subtitle">${hasPreData ? '✓ ΣΥΜΠΛΗΡΩΜΕΝΗ' : 'ΠΡΙΝ ΤΗ ΔΡΑΣΤΗΡΙΟΤΗΤΑ'}</small>
                        </div>
                    </label>
                    <label class="radio-option" style="padding: clamp(20px, 3vw, 25px); ${!hasPreData || hasPostData ? 'opacity: 0.5;' : ''}">
                        <input type="radio" name="survey-type" value="post" required ${!hasPreData || hasPostData ? 'disabled' : ''}>
                        <div>
                            <div class="survey-option-icon">📊</div>
                            <strong class="survey-option-title">ΤΕΛΙΚΗ</strong>
                            <small class="survey-option-subtitle">
                                ${hasPostData ? '✓ Συμπληρωμένη' : 
                                  !hasPreData ? '🔒 ΚΛΕΙΔΩΜΕΝΗ - ΣΥΜΠΛΗΡΩΣΤΕ ΜΕΤΑ ΤΗ ΔΡΑΣΤΗΡΙΟΤΗΤΑ' : 
                                  'ΜΕΤΑ ΤΗ ΔΡΑΣΤΗΡΙΟΤΗΤΑ'}
                            </small>
                        </div>
                    </label>
                </div>
            </div>
            
            ${!hasPreData ? `
                <div class="warning-box">
                    <p class="warning-text">
                        ⚠️ Πρέπει να συμπληρώσετε την ΠΡΟΚΑΤΑΡΚΤΙΚΗ έρευνα πρώτα
                    </p>
                </div>
            ` : ''}
            
            <div class="text-center" style="margin-top: 40px;">
                <button class="btn btn-primary start-button" onclick="startSurvey()">
                    ΕΝΑΡΞΗ
                </button>
            </div>
        </div>
    `;
    
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll(`input[name="${this.name}"]`).forEach(r => {
                const parent = r.closest('.radio-option');
                if (parent) parent.classList.remove('selected');
            });
            const parent = this.closest('.radio-option');
            if (parent) parent.classList.add('selected');
        });
    });
}

        function startSurvey() {
            const selected = document.querySelector('input[name="survey-type"]:checked');
            if (!selected) {
                alert('Παρακαλώ επιλέξτε τύπο έρευνας!');
                return;
            }
            
            surveyType = selected.value;
            
            if (surveyType === 'pre' && existingPreData) {
                alert('Έχετε συμπληρώσει την προκαταρκτική έρευνα!');
                return;
            }
            
            if (surveyType === 'post' && existingPostData) {
                alert('Έχετε συμπληρώσει την τελική έρευνα!');
                return;
            }
            
            const sectionMap = {
                'pre': [1, 2, 3],
                'post': [5, 7]
            };
            
            totalSections = sectionMap[surveyType].length;
            currentSection = 1;
            showSection(currentSection);
        }

        function showSection(sectionNum) {
            const actualSection = surveyType === 'pre' ? 
                [1, 2, 3][sectionNum - 1] : 
                [5, 7][sectionNum - 1];
            
            const sectionHTML = {
                1: renderDemographics(),
                2: renderGenAIExperience(),
                3: renderAIAttitudes(),
                5: renderTAM(),
                7: renderOpenEnded()
            };
            
            document.getElementById('app').innerHTML = `
                <div class="header">
                    <h1>${surveyType === 'pre' ? '📋 ΠΡΟΚΑΤΑΡΚΤΙΚΗ ΕΡΕΥΝΑ' : '📊 ΤΕΛΙΚΗ ΕΡΕΥΝΑ'}</h1>
                    <p>ΜΕΛΕΤΗ ΧΡΗΣΗΣ (ΓΕΝΕΤΙΚΗΣ) ΤΕΧΝΗΤΗΣ ΝΟΗΜΟΣΥΝΗΣ</p>
                    <div class="progress-container">
                        <div class="progress-info">
                            <span>${surveyType === 'pre' ? 'ΠΡΙΝ ΤΗΝ ΔΡΑΣΤΗΡΙΟΤΗΤΑ' : 'ΜΕΤΑ ΤΗ ΔΡΑΣΤΗΡΙΟΤΗΤΑ'}</span>
                            <span>Μέρος ${currentSection} από ${totalSections}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(currentSection / totalSections) * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="form-section active">
                    ${sectionHTML[actualSection]}
                </div>
                
                <div class="navigation">
                    <button class="btn btn-secondary" onclick="prevSection()" ${currentSection === 1 ? 'disabled' : ''}>
                        ← Προηγούμενο
                    </button>
                    <span class="step-indicator">Μέρος ${currentSection} από ${totalSections}</span>
                    ${currentSection < totalSections ? 
                        `<button class="btn btn-primary" onclick="nextSection()">Επόμενο →</button>` :
                        `<button class="btn btn-primary" onclick="submitSurvey()" id="submitBtn">✓ Υποβολή</button>`
                    }
                </div>
            `;
            
            attachEventListeners();
            window.scrollTo(0, 0);
        }

        function attachEventListeners() {
            document.querySelectorAll('input[type="radio"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    surveyData[this.name] = this.value;
                    document.querySelectorAll(`input[name="${this.name}"]`).forEach(r => {
                        const parent = r.closest('.radio-option, .likert-option');
                        if (parent) parent.classList.remove('selected');
                    });
                    const parent = this.closest('.radio-option, .likert-option');
                    if (parent) parent.classList.add('selected');
                    
                    if (this.name === 'genai-used') {
                        handleBranching();
                    }
                });
                
                if (surveyData[radio.name] === radio.value) {
                    radio.checked = true;
                    const parent = radio.closest('.radio-option, .likert-option');
                    if (parent) parent.classList.add('selected');
                }
            });

            document.querySelectorAll('input[type="text"], input[type="number"], textarea').forEach(input => {
                input.addEventListener('input', function() {
                    surveyData[this.name || this.id] = this.value;
                });
                if (surveyData[input.name || input.id]) {
                    input.value = surveyData[input.name || input.id];
                }
            });

            document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    if (!surveyData[this.name]) surveyData[this.name] = [];
                    
                    if (!Array.isArray(surveyData[this.name])) {
                        surveyData[this.name] = [];
                    }

                    if (this.checked) {
                        surveyData[this.name].push(this.value);
                        this.closest('.checkbox-option').classList.add('selected');
                    } else {
                        surveyData[this.name] = surveyData[this.name].filter(v => v !== this.value);
                        this.closest('.checkbox-option').classList.remove('selected');
                    }
                });

                if (surveyData[checkbox.name] && Array.isArray(surveyData[checkbox.name]) && surveyData[checkbox.name].includes(checkbox.value)) {
                    checkbox.checked = true;
                    checkbox.closest('.checkbox-option').classList.add('selected');
                }
            });

            if(document.getElementById('branching-question')) {
                handleBranching();
            }
        }

        function handleBranching() {
            const genaiUsed = document.querySelector('input[name="genai-used"]:checked');
            const branchA = document.getElementById('branch-a');
            const branchB = document.getElementById('branch-b');
            const branchC = document.getElementById('branch-c');
            const commonQuestions = document.getElementById('common-questions');

            if(branchA) branchA.classList.add('hidden');
            if(branchB) branchB.classList.add('hidden');
            if(branchC) branchC.classList.add('hidden');
            if(commonQuestions) commonQuestions.classList.add('hidden');
            
            if (genaiUsed) {
                commonQuestions.classList.remove('hidden');

                if (genaiUsed.value === 'yes') {
                    branchA.classList.remove('hidden');
                    setRequired(branchA, true);
                    setRequired(branchB, false);
                    setRequired(branchC, false);
                } else if (genaiUsed.value === 'no') {
                    branchB.classList.remove('hidden');
                    setRequired(branchA, false);
                    setRequired(branchB, true);
                    setRequired(branchC, false);
                } else if (genaiUsed.value === 'unsure') {
                    branchC.classList.remove('hidden');
                    setRequired(branchA, false);
                    setRequired(branchB, false);
                    setRequired(branchC, true);
                }
            }
        }
function handleServicesSelection() {
    const servicesUsed = document.querySelectorAll('input[name="services-used"]:checked');
    const branchA = document.getElementById('branch-a');
    
    let hasAIService = false;
    servicesUsed.forEach(service => {
        if (service.value !== 'none' && service.value !== 'dont-know') {
            hasAIService = true;
        }
    });
    
    if (hasAIService) {
        if (branchA) {
            branchA.classList.remove('hidden');
            setRequired(branchA, true);
        }

        const noneBox = document.querySelector('input[name="services-used"][value="none"]');
        const dontKnowBox = document.querySelector('input[name="services-used"][value="dont-know"]');
        if (noneBox) {
            noneBox.checked = false;
            noneBox.closest('.checkbox-option').classList.remove('selected');
        }
        if (dontKnowBox) {
            dontKnowBox.checked = false;
            dontKnowBox.closest('.checkbox-option').classList.remove('selected');
        }
    } else {

        if (branchA) {
            branchA.classList.add('hidden');
            setRequired(branchA, false);
        }
    }
}

function handleNoneSelected(checkbox) {
    if (checkbox.checked) {
        document.querySelectorAll('input[name="services-used"]').forEach(cb => {
            if (cb !== checkbox && cb.value !== 'dont-know') {
                cb.checked = false;
                cb.closest('.checkbox-option').classList.remove('selected');
            }
        });

        const branchA = document.getElementById('branch-a');
        if (branchA) {
            branchA.classList.add('hidden');
            setRequired(branchA, false);
        }
    }
}

function handleDontKnow(checkbox) {
    if (checkbox.checked) {
        document.querySelectorAll('input[name="services-used"]').forEach(cb => {
            if (cb !== checkbox && cb.value !== 'none') {
                cb.checked = false;
                cb.closest('.checkbox-option').classList.remove('selected');
            }
        });

        const branchA = document.getElementById('branch-a');
        if (branchA) {
            branchA.classList.add('hidden');
            setRequired(branchA, false);
        }
    }
}
        function setRequired(branchElement, isRequired) {
            if (!branchElement) return;
            branchElement.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
                input.required = isRequired;
            });
        }
        
        function limitCheckboxes(name, max) {
            const checked = document.querySelectorAll(`input[name="${name}"]:checked`);
            if (checked.length >= max) {
                document.querySelectorAll(`input[name="${name}"]:not(:checked)`).forEach(cb => {
                    cb.disabled = true;
                    cb.closest('.checkbox-option').style.opacity = '0.5';
                });
            } else {
                document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
                    cb.disabled = false;
                    cb.closest('.checkbox-option').style.opacity = '1';
                });
            }
        }

        function toggleOtherInput(checkbox, inputId) {
            const input = document.getElementById(inputId);
            input.disabled = !checkbox.checked;
            if (checkbox.checked) {
                 input.focus();
                 input.required = true;
            } else {
                 input.value = '';
                 input.required = false;

                 if (surveyData[inputId]) {
                    delete surveyData[inputId];
                 }
            }
        }

        function nextSection() {
            if (!validateSection()) {
                alert('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία!');
                return;
            }
            currentSection++;
            showSection(currentSection);
        }

        function prevSection() {
            currentSection--;
            showSection(currentSection);
        }

function validateSection() {
    let isValid = true;
    const activeSection = document.querySelector('.form-section.active');
    activeSection.querySelectorAll('input[required]:not([type="radio"]):not([type="checkbox"]), textarea[required]').forEach(input => {
        if (!input.disabled && !input.value.trim()) {
            input.style.borderColor = 'var(--danger)';
            isValid = false;
        } else {
            input.style.borderColor = 'var(--gray-200)';
        }
        if (input.name === 'age' && input.value) {
            const age = parseInt(input.value);
            if (age < 13 || age > 100) {
                input.style.borderColor = 'var(--danger)';
                isValid = false;
                alert('Η ηλικία πρέπει να είναι μεταξύ 13 και 100 ετών!');
            }
        }
    });

            const radioGroups = {};
            activeSection.querySelectorAll('input[type="radio"][required]').forEach(radio => {
                if (!radio.closest('.hidden')) {
                    if (!radioGroups[radio.name]) {
                        radioGroups[radio.name] = {
                            elements: [],
                            isChecked: false
                        };
                    }
                    radioGroups[radio.name].elements.push(radio);
                    if (radio.checked) {
                        radioGroups[radio.name].isChecked = true;
                    }
                }
            });

            for (const name in radioGroups) {
                if (!radioGroups[name].isChecked) {
                    isValid = false;
                    const parentGroup = radioGroups[name].elements[0].closest('.form-group, .likert-group');
                    if (parentGroup) {
                        parentGroup.style.border = '2px solid var(--danger)';
                    }
                } else {
                     const parentGroup = radioGroups[name].elements[0].closest('.form-group, .likert-group');
                    if (parentGroup) {
                        parentGroup.style.border = '1px solid var(--gray-200)';
                    }
                }
            }

            const checkboxGroups = {};
            activeSection.querySelectorAll('input[type="checkbox"][required]').forEach(cb => {
                 if (!cb.closest('.hidden')) {
                    if (!checkboxGroups[cb.name]) {
                        checkboxGroups[cb.name] = {
                            elements: [],
                            isChecked: false
                        };
                    }
                    checkboxGroups[cb.name].elements.push(cb);
                    if (cb.checked) {
                        checkboxGroups[cb.name].isChecked = true;
                    }
                }
            });
            for (const name in checkboxGroups) {
                if (!checkboxGroups[name].isChecked) {
                    isValid = false;
                    const parentGroup = checkboxGroups[name].elements[0].closest('.form-group');
                    if (parentGroup) {
                        parentGroup.style.border = '2px solid var(--danger)';
                    }
                } else {
                     const parentGroup = checkboxGroups[name].elements[0].closest('.form-group');
                    if (parentGroup) {
                        parentGroup.style.border = 'none';
                    }
                }
            }

            return isValid;
        }

async function submitSurvey() {
    if (!validateSection()) {
        alert('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία!');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ Αποθήκευση...';

    try {
        const data = {
            teamCode: TEAM_MEMBER.team,
            memberName: TEAM_MEMBER.member,
            surveyType: surveyType,
            submittedAt: new Date().toISOString(),
            responses: surveyData
        };

        const docId = `${TEAM_MEMBER.team}_${surveyType}_${TEAM_MEMBER.member}`;
        const docRef = window.firebaseDoc(window.firebaseDB, 'surveys', docId);
        await window.firebaseSetDoc(docRef, data);

        if (surveyType === 'pre') {
            document.getElementById('app').innerHTML = `
                <div class="form-section active center-content">
                    <div class="success-icon">✅</div>
                    <h1 class="success-title">ΕΠΙΤΥΧΗΣ ΥΠΟΒΟΛΗ!</h1>
                    
                    <div class="alert-box" style="text-align: center;">
                        <p class="alert-message">🎮 ΕΠΟΜΕΝΟ ΒΗΜΑ: ΣΥΜΜΕΤΕΧΕΤΕ ΣΤΟ ΠΑΙΧΝΙΔΙ</p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
<button class="btn btn-primary" onclick="window.location.href='../index.html?team=${TEAM_MEMBER.team}'" style="font-size: clamp(14px, 2.5vw, 16px);">
    🎮 ΕΚΚΙΝΗΣΗ ΠΑΙΧΝΙΔΙΟΥ
</button>
                    </div>
                </div>
            `;
} else {
            document.getElementById('app').innerHTML = `
                <div class="form-section active center-content">
                    <div class="success-icon">✅</div>
                    <h1 class="success-title">ΕΠΙΤΥΧΗΣ ΥΠΟΒΟΛΗ!</h1>
                    <p style="font-size: clamp(16px, 3vw, 18px); color: var(--gray-700); margin-bottom: 30px;">
                        ΕΥΧΑΡΙΣΤΟΥΜΕ ΓΙΑ ΤΗ ΣΥΜΜΕΤΟΧΗ ΣΑΣ!
                    </p>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="btn btn-primary" onclick="window.close(); if(!window.closed) window.location.href='../index.html?team=${TEAM_MEMBER.team}'" style="font-size: clamp(14px, 2.5vw, 16px);">
                            🏠 ΕΠΙΣΤΡΟΦΗ ΣΤΟ ΠΑΙΧΝΙΔΙ
                        </button>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Σφάλμα αποθήκευσης: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = '✓ Υποβολή';
    }
}

function renderDemographics() {
    return `
        <h2 class="section-title">ΜΕΡΟΣ 1: ΔΗΜΟΓΡΑΦΙΚΑ ΣΤΟΙΧΕΙΑ</h2>
        <p class="section-subtitle">Παρακαλούμε συμπληρώστε τις παρακάτω πληροφορίες</p>
        
        <div class="post-activity-notice" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border-color: var(--primary);">
            ΠΡΙΝ ΤΗΝ ΔΡΑΣΤΗΡΙΟΤΗΤΑ
        </div>
        
		<div class="form-group">				
			<label for="group">
				<span class="question-number">1.1</span>
				Ομάδα
				<span style="color: var(--gray-500); font-size: 13px; font-weight: normal;"> (Προαιρετικό)</span>
			</label>
			<input type="text" id="group" name="group" placeholder="Αναφέρετε το όνομα της ομάδας σας (Προαιρετικό)">
		</div>
                
                <div class="form-group">
                    <label class="required">
                        <span class="question-number">1.2</span>
                        Φύλο
                    </label>
                    <div class="radio-group">
                        <label class="radio-option">
                            <input type="radio" name="gender" value="male" required>
                            Άνδρας
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="gender" value="female" required>
                            Γυναίκα
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="gender" value="other" required>
                            Άλλο
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="gender" value="prefer-not" required>
                            Δεν επιθυμώ να απαντήσω
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="age" class="required">
                        <span class="question-number">1.3</span>
                        Ηλικία
                    </label>
                    <input type="number" id="age" name="age" min="13" max="100" placeholder="Σε έτη" required>
                </div>
                
                <div class="form-group">
                    <label class="required">
                        <span class="question-number">1.4</span>
                        Επίπεδο εκπαίδευσης
                    </label>
                    <div class="radio-group">
                        <label class="radio-option">
                            <input type="radio" name="education" value="highschool" required>
                            Λύκειο
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="education" value="undergraduate" required>
                            Προπτυχιακό
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="education" value="graduate" required>
                            Μεταπτυχιακό
                        </label>
                        <label class="radio-option">
                            <input type="radio" name="education" value="doctoral" required>
                            Διδακτορικό
                        </label>
                    </div>
                </div>
            `;
        }

function renderGenAIExperience() {
    return `
        <h2 class="section-title">ΜΕΡΟΣ 2: ΕΜΠΕΙΡΙΑ ΜΕ ΓΕΝΕΤΙΚΗ ΤΕΧΝΗΤΗ ΝΟΗΜΟΣΥΝΗ (ΓΤΝ)</h2>
        <p class="section-subtitle">Εμπειρία με εργαλεία ΓΤΝ</p>
        
        <div class="post-activity-notice" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border-color: var(--primary);">
            ΠΡΙΝ ΤΗΝ ΔΡΑΣΤΗΡΙΟΤΗΤΑ
        </div>
        
        <div class="form-group" id="branching-question">
            <label class="required">
                <span class="question-number">2.0</span>
                Έχετε χρησιμοποιήσει ποτέ εργαλεία Γενετικής Τεχνητής Νοημοσύνης (π.χ., ChatGPT, Claude, Gemini, Copilot, κ.λπ.) για οποιονδήποτε σκοπό;
            </label>
            <div class="radio-group">
                <label class="radio-option">
                    <input type="radio" name="genai-used" value="yes" required>
                    Ναι
                </label>
                <label class="radio-option">
                    <input type="radio" name="genai-used" value="no" required>
                    Όχι
                </label>
                <label class="radio-option">
                    <input type="radio" name="genai-used" value="unsure" required>
                    Δεν είμαι σίγουρος/η
                </label>
            </div>
        </div>
        
<div id="branch-c" class="hidden">
    <div class="form-group">
        <label class="required">
            <span class="question-number">2.Γ1</span>
            Έχετε χρησιμοποιήσει ή αλληλεπιδράσει με κάποια από τις παρακάτω υπηρεσίες τους τελευταίους 6 μήνες;
        </label>
        <div class="checkbox-group">
            <label class="checkbox-option">
                <input type="checkbox" name="services-used" value="chatgpt" onchange="handleServicesSelection()">
                ChatGPT / Gemini / Claude / Perplexity
            </label>
            <label class="checkbox-option">
                <input type="checkbox" name="services-used" value="copilot" onchange="handleServicesSelection()">
                Microsoft Copilot/Bing Chat
            </label>
            <label class="checkbox-option">
                <input type="checkbox" name="services-used" value="translation" onchange="handleServicesSelection()">
                DeepL ή Google Translate
            </label>
            <label class="checkbox-option">
                <input type="checkbox" name="services-used" value="none" onchange="handleNoneSelected(this)">
                Κανένα από τα παραπάνω
            </label>
            <label class="checkbox-option">
                <input type="checkbox" name="services-used" value="dont-know" onchange="handleDontKnow(this)">
                Δεν είμαι σίγουρος/η
            </label>
        </div>
    </div>
</div>
        
        <div id="branch-a" class="hidden">
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.A1</span>
                    Πόσο καιρό χρησιμοποιείτε εργαλεία ΓΤΝ;
                </label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="genai-duration" value="less-1month">
                        Λιγότερο από 1 μήνα
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-duration" value="1-3months">
                        1-3 μήνες
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-duration" value="4-6months">
                        4-6 μήνες
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-duration" value="7-12months">
                        7-12 μήνες
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-duration" value="more-1year">
                        Περισσότερο από 1 χρόνο
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.A2</span>
                    Τον τελευταίο μήνα, πόσο συχνά χρησιμοποιήσατε εργαλεία ΓΤΝ;
                </label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="genai-frequency" value="daily">
                        Καθημερινά
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-frequency" value="4-6week">
                        4-6 φορές την εβδομάδα
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-frequency" value="2-3week">
                        2-3 φορές την εβδομάδα
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-frequency" value="once-week">
                        Μία φορά την εβδομάδα
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-frequency" value="2-3month">
                        2-3 φορές τον μήνα
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label>
                    <span class="question-number">2.A3</span>
                    Ποια εργαλεία ΓΤΝ έχετε χρησιμοποιήσει; (Επιλέξτε όλα όσα ισχύουν)
                </label>
                <div class="checkbox-group">
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-tools" value="chatgpt">
                        ChatGPT
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-tools" value="claude">
                        Claude
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-tools" value="gemini">
                        Google Gemini/Bard
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-tools" value="copilot">
                        Microsoft Copilot
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-tools" value="perplexity">
                        Perplexity
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-tools" value="github-copilot">
                        GitHub Copilot
                    </label>
                    <label class="checkbox-option" style="grid-column: span 2;">
                        <input type="checkbox" name="genai-tools" value="other" onchange="toggleOtherInput(this, 'genai-tools-other')">
                        Άλλο:
                        <input type="text" id="genai-tools-other" name="genai-tools-other" placeholder="Προσδιορίστε" disabled style="margin-left: 10px;">
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.A4</span>
                    Για ποιους σκοπούς χρησιμοποιείτε κυρίως εργαλεία ΓΤΝ; (Επιλέξτε έως 3)
                </label>
                <div class="checkbox-group">
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-purposes" value="homework" onchange="limitCheckboxes('genai-purposes', 3)">
                        Βοήθεια με σχολικές εργασίες
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-purposes" value="study" onchange="limitCheckboxes('genai-purposes', 3)">
                        Μελέτη και κατανόηση εννοιών
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-purposes" value="research" onchange="limitCheckboxes('genai-purposes', 3)">
                        Έρευνα πληροφοριών
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-purposes" value="writing" onchange="limitCheckboxes('genai-purposes', 3)">
                        Συγγραφή κειμένων
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-purposes" value="translation" onchange="limitCheckboxes('genai-purposes', 3)">
                        Μετάφραση
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-purposes" value="programming" onchange="limitCheckboxes('genai-purposes', 3)">
                        Προγραμματισμός/κώδικας
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-purposes" value="images" onchange="limitCheckboxes('genai-purposes', 3)">
                        Δημιουργία εικόνων
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-purposes" value="entertainment" onchange="limitCheckboxes('genai-purposes', 3)">
                        Προσωπική ψυχαγωγία
                    </label>
                    <label class="checkbox-option" style="grid-column: span 2;">
                        <input type="checkbox" name="genai-purposes" value="other" onchange="toggleOtherInput(this, 'genai-purposes-other'); limitCheckboxes('genai-purposes', 3)">
                        Άλλο:
                        <input type="text" id="genai-purposes-other" name="genai-purposes-other" placeholder="Προσδιορίστε" disabled style="margin-left: 10px;">
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.A5</span>
                    Πόσο ικανός/ή αισθάνεσθε στη διατύπωση αποτελεσματικών εντολών (prompts) σε εργαλεία ΓΤΝ;
                </label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="prompt-ability" value="1">
                        Καθόλου ικανός/ή
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="prompt-ability" value="2">
                        Λίγο ικανός/ή
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="prompt-ability" value="3">
                        Μέτρια ικανός/ή
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="prompt-ability" value="4">
                        Πολύ ικανός/ή
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="prompt-ability" value="5">
                        Εξαιρετικά ικανός/ή
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.A6</span>
                    Πόσο εμπιστεύεσθε τις απαντήσεις που λαμβάνετε από εργαλεία ΓΤΝ;
                </label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="trust-level" value="1">
                        Καθόλου
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="trust-level" value="2">
                        Λίγο
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="trust-level" value="3">
                        Μέτρια
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="trust-level" value="4">
                        Πολύ
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="trust-level" value="5">
                        Απόλυτα
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.A7</span>
                    Πόσο συχνά επαληθεύετε τις πληροφορίες που λαμβάνετε από ΓΤΝ;
                </label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="verify-frequency" value="always">
                        Πάντα
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="verify-frequency" value="often">
                        Συχνά
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="verify-frequency" value="sometimes">
                        Μερικές φορές
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="verify-frequency" value="rarely">
                        Σπάνια
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="verify-frequency" value="never">
                        Ποτέ
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.A8</span>
                    Ποια είναι η μεγαλύτερη πρόκληση που αντιμετωπίζετε με τα εργαλεία ΓΤΝ;
                </label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="biggest-challenge" value="formulation">
                        Δυσκολία στη διατύπωση σωστών ερωτήσεων
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="biggest-challenge" value="accuracy">
                        Αμφιβολία για την ακρίβεια των απαντήσεων
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="biggest-challenge" value="access">
                        Περιορισμένη πρόσβαση (κόστος/διαθεσιμότητα)
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="biggest-challenge" value="technical">
                        Τεχνικές δυσκολίες
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="biggest-challenge" value="ethical">
                        Ηθικές ανησυχίες
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="biggest-challenge" value="none">
                        Δεν αντιμετωπίζω προκλήσεις
                    </label>
                </div>
            </div>
        </div>
        
        <div id="branch-b" class="hidden">
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.B1</span>
                    Ποιος είναι ο κύριος λόγος που δεν έχετε χρησιμοποιήσει εργαλεία ΓΤΝ;
                </label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="non-use-reason" value="dont-know">
                        Δεν γνωρίζω τι είναι ή πώς λειτουργούν
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="non-use-reason" value="no-access">
                        Δεν έχω πρόσβαση σε αυτά
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="non-use-reason" value="dont-need">
                        Δεν τα χρειάζομαι
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="non-use-reason" value="dont-trust">
                        Δεν τα εμπιστεύομαι
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="non-use-reason" value="prefer-traditional">
                        Προτιμώ παραδοσιακές μεθόδους
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="non-use-reason" value="privacy-concerns">
                        Ανησυχίες για προσωπικά δεδομένα
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="non-use-reason" value="not-allowed">
                        Το σχολείο/πανεπιστήμιο δεν το επιτρέπει
                    </label>
                    <label class="radio-option" style="grid-column: span 2;">
                        <input type="radio" name="non-use-reason" value="other">
                        Άλλο:
                        <input type="text" id="non-use-reason-other" name="non-use-reason-other" placeholder="Προσδιορίστε" disabled style="margin-left: 10px;">
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.B2</span>
                    Πόσο ενημερωμένος/η αισθάνεσθε για τις δυνατότητες των εργαλείων ΓΤΝ;
                </label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="genai-awareness" value="1">
                        Καθόλου ενημερωμένος/η
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-awareness" value="2">
                        Λίγο ενημερωμένος/η
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-awareness" value="3">
                        Μέτρια ενημερωμένος/η
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-awareness" value="4">
                        Πολύ ενημερωμένος/η
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-awareness" value="5">
                        Πλήρως ενημερωμένος/η
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label>
                    <span class="question-number">2.B3</span>
                    Ποιες ανησυχίες έχετε σχετικά με τη χρήση ΓΤΝ; (Επιλέξτε όλες που ισχύουν)
                </label>
                <div class="checkbox-group">
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-concerns" value="accuracy">
                        Ακρίβεια πληροφοριών
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-concerns" value="dependency">
                        Εξάρτηση από την τεχνολογία
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-concerns" value="integrity">
                        Ακαδημαϊκή ακεραιότητα
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-concerns" value="critical-thinking">
                        Απώλεια κριτικής σκέψης
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-concerns" value="privacy">
                        Προστασία προσωπικών δεδομένων
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-concerns" value="cost">
                        Κόστος χρήσης
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-concerns" value="no-concerns">
                        Δεν έχω ανησυχίες
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.B4</span>
                    Πόσο πιθανό είναι να χρησιμοποιήσετε εργαλεία ΓΤΝ στο μέλλον;
                </label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="future-likelihood" value="1">
                        Πολύ απίθανο
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="future-likelihood" value="2">
                        Απίθανο
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="future-likelihood" value="3">
                        Ούτε πιθανό ούτε απίθανο
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="future-likelihood" value="4">
                        Πιθανό
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="future-likelihood" value="5">
                        Πολύ πιθανό
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.B5</span>
                    Τι θα σας έκανε να εξετάσετε τη χρήση εργαλείων ΓΤΝ; (Επιλέξτε έως 2)
                </label>
                <div class="checkbox-group">
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-motivators" value="free-access" onchange="limitCheckboxes('genai-motivators', 2)">
                        Δωρεάν και απεριόριστη πρόσβαση
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-motivators" value="training" onchange="limitCheckboxes('genai-motivators', 2)">
                        Εκπαίδευση/σεμινάρια για σωστή χρήση
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-motivators" value="security" onchange="limitCheckboxes('genai-motivators', 2)">
                        Βελτιωμένη ασφάλεια και προστασία δεδομένων
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-motivators" value="accuracy-guarantee" onchange="limitCheckboxes('genai-motivators', 2)">
                        Εγγυήσεις για ακρίβεια πληροφοριών
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-motivators" value="learning-benefits" onchange="limitCheckboxes('genai-motivators', 2)">
                        Αν έβλεπα συγκεκριμένα οφέλη στη μάθηση
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-motivators" value="better-understanding" onchange="limitCheckboxes('genai-motivators', 2)">
                        Καλύτερη κατανόηση των δυνατοτήτων τους
                    </label>
                    <label class="checkbox-option">
                        <input type="checkbox" name="genai-motivators" value="nothing">
                        Τίποτα - Δεν με ενδιαφέρει η χρήση τους
                    </label>
                </div>
            </div>
        </div>
        
        <div id="common-questions" class="hidden">
            <div class="branch-divider">ΚΟΙΝΕΣ ΕΡΩΤΗΣΕΙΣ ΓΙΑ ΟΛΟΥΣ</div>
            
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.O1</span>
                    Πιστεύετε ότι τα εργαλεία ΓΤΝ θα είναι σημαντικά για το μελλοντικό σας επάγγελμα;
                </label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="genai-importance" value="1" required>
                        Καθόλου σημαντικά
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-importance" value="2" required>
                        Λίγο σημαντικά
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-importance" value="3" required>
                        Μέτρια σημαντικά
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-importance" value="4" required>
                        Πολύ σημαντικά
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="genai-importance" value="5" required>
                        Εξαιρετικά σημαντικά
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="required">
                    <span class="question-number">2.O2</span>
                    Πόσο επαρκής είναι η εκπαίδευση που λαμβάνετε σχετικά με τη χρήση ΓΤΝ;
                </label>
                <div class="radio-group">
                    <label class="radio-option">
                        <input type="radio" name="education-adequacy" value="1" required>
                        Εξαιρετικά ανεπαρκής
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="education-adequacy" value="2" required>
                        Ανεπαρκής
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="education-adequacy" value="3" required>
                        Μέτρια
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="education-adequacy" value="4" required>
                        Επαρκής
                    </label>
                    <label class="radio-option">
                        <input type="radio" name="education-adequacy" value="5" required>
                        Εξαιρετικά επαρκής
                    </label>
                </div>
            </div>
        </div>
    `;
}
function renderAIAttitudes() {
    return `
        <h2 class="section-title">ΜΕΡΟΣ 3: GENERAL ATTITUDES TOWARDS ARTIFICIAL INTELLIGENCE SCALE</h2>
        <p class="section-subtitle">Στάσεις απέναντι στην Τεχνητή Νοημοσύνη</p>

        <div class="post-activity-notice" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%); border-color: var(--primary);">
            ΠΡΙΝ ΤΗΝ ΔΡΑΣΤΗΡΙΟΤΗΤΑ
        </div>
		
        <div class="scale-instructions">
            <p><strong>Οδηγίες:</strong> Παρακαλώ αξιολογήστε τις παρακάτω δηλώσεις σε μια κλίμακα από 1 έως 5:</p>
            <div class="scale-legend">
                <span><strong>1</strong> = Διαφωνώ Απόλυτα</span>
                <span><strong>2</strong> = Διαφωνώ</span>
                <span><strong>3</strong> = Ούτε Συμφωνώ Ούτε Διαφωνώ</span>
                <span><strong>4</strong> = Συμφωνώ</span>
                <span><strong>5</strong> = Συμφωνώ Απόλυτα</span>
            </div>
        </div>
        <div class="subscale-header">ΘΕΤΙΚΕΣ ΣΤΑΣΕΙΣ ΑΠΕΝΑΝΤΙ ΣΤΗΝ ΤΝ</div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">3.1</span>
                Είμαι εντυπωσιασμένος/η από αυτά που μπορεί να κάνει η Τεχνητή Νοημοσύνη.
            </label>
            <div class="likert-scale">
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-1" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-1" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-1" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-1" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-1" value="5" required>
                    <span class="likert-label">5</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">3.2</span>
                Ενδιαφέρομαι να χρησιμοποιώ συστήματα τεχνητής νοημοσύνης στην καθημερινή μου ζωή.
            </label>
            <div class="likert-scale">
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-2" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-2" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-2" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-2" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-2" value="5" required>
                    <span class="likert-label">5</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">3.3</span>
                Η Τεχνητή Νοημοσύνη είναι συναρπαστική.
            </label>
            <div class="likert-scale">
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-3" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-3" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-3" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-3" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-3" value="5" required>
                    <span class="likert-label">5</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">3.4</span>
                Υπάρχουν πολλές ωφέλιμες εφαρμογές της Τεχνητής Νοημοσύνης.
            </label>
            <div class="likert-scale">
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-4" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-4" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-4" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-4" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-4" value="5" required>
                    <span class="likert-label">5</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">3.5</span>
                Τα συστήματα τεχνητής νοημοσύνης μπορούν να αποδώσουν καλύτερα από τους ανθρώπους.
            </label>
            <div class="likert-scale">
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-5" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-5" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-5" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-5" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-5" value="5" required>
                    <span class="likert-label">5</span>
                </label>
            </div>
        </div>
        
        <div class="subscale-header">ΑΡΝΗΤΙΚΕΣ ΣΤΑΣΕΙΣ/ΑΝΗΣΥΧΙΕΣ ΓΙΑ ΤΗΝ ΤΕΧΝΗΤΗ ΝΟΗΜΟΣΥΝΗ</div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">3.6</span>
                Πιστεύω ότι τα συστήματα τεχνητής νοημοσύνης κάνουν πολλά λάθη.
            </label>
            <div class="likert-scale">
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-6" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-6" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-6" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-6" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-6" value="5" required>
                    <span class="likert-label">5</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">3.7</span>
                Πιστεύω ότι η Τεχνητή Νοημοσύνη είναι επικίνδυνη.
            </label>
            <div class="likert-scale">
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-7" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-7" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-7" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-7" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-7" value="5" required>
                    <span class="likert-label">5</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">3.8</span>
                Ανατριχιάζω από δυσφορία όταν σκέφτομαι τις μελλοντικές χρήσεις της Τεχνητής Νοημοσύνης.
            </label>
            <div class="likert-scale">
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-8" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-8" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-8" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-8" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="ai-attitude-8" value="5" required>
                    <span class="likert-label">5</span>
                </label>
            </div>
        </div>
    `;
}
function renderTAM() {
    return `
        <h2 class="section-title">ΜΕΡΟΣ 4: ΑΞΙΟΛΟΓΗΣΗ ΕΜΠΕΙΡΙΑΣ ΧΡΗΣΗΣ ΓΝΤ</h2>
        <p class="section-subtitle">Αξιολογήστε την εμπειρία σας με το εργαλείο ΓΝΤ στη δραστηριότητα</p>
        <div class="post-activity-notice">ΜΕΤΑ ΤΗ ΔΡΑΣΤΗΡΙΟΤΗΤΑ</div>
        
        <div class="scale-instructions">
            <p><strong>Οδηγίες:</strong> Παρακαλώ αξιολογήστε τις παρακάτω δηλώσεις σε μια κλίμακα από 1 έως 7:</p>
            <div class="scale-legend-7">
                <span><strong>1</strong> = Διαφωνώ Απόλυτα</span>
                <span><strong>2</strong> = Διαφωνώ Πολύ</span>
                <span><strong>3</strong> = Διαφωνώ</span>
                <span><strong>4</strong> = Ουδέτερο</span>
                <span><strong>5</strong> = Συμφωνώ</span>
                <span><strong>6</strong> = Συμφωνώ Πολύ</span>
                <span><strong>7</strong> = Συμφωνώ Απόλυτα</span>
            </div>
        </div>
        
        <div class="subscale-header">PU (PERCEIVED USEFULNESS)</div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">PU1</span>
                Η χρήση του GenAI μου επέτρεψε να λύσω το μυστήριο πιο γρήγορα απ' ό,τι θα μπορούσα χωρίς αυτό
            </label>
            <div class="likert-scale-7">
                <label class="likert-option">
                    <input type="radio" name="pu1" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu1" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu1" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu1" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu1" value="5" required>
                    <span class="likert-label">5</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu1" value="6" required>
                    <span class="likert-label">6</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu1" value="7" required>
                    <span class="likert-label">7</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">PU2</span>
                Η χρήση του GenAI βελτίωσε την απόδοση μου στην επίλυση του μυστηρίου
            </label>
            <div class="likert-scale-7">
                <label class="likert-option">
                    <input type="radio" name="pu2" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu2" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu2" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu2" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu2" value="5" required>
                    <span class="likert-label">5</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu2" value="6" required>
                    <span class="likert-label">6</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu2" value="7" required>
                    <span class="likert-label">7</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">PU3</span>
                Η χρήση του GenAI σε αυτή τη δραστηριότητα αύξησε την παραγωγικότητά μου
            </label>
            <div class="likert-scale-7">
                <label class="likert-option">
                    <input type="radio" name="pu3" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu3" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu3" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu3" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu3" value="5" required>
                    <span class="likert-label">5</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu3" value="6" required>
                    <span class="likert-label">6</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu3" value="7" required>
                    <span class="likert-label">7</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">PU4</span>
                Η χρήση του GenAI ενίσχυσε την αποτελεσματικότητά μου στην επίλυση του μυστηρίου
            </label>
            <div class="likert-scale-7">
                <label class="likert-option">
                    <input type="radio" name="pu4" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu4" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu4" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu4" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu4" value="5" required>
                    <span class="likert-label">5</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu4" value="6" required>
                    <span class="likert-label">6</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu4" value="7" required>
                    <span class="likert-label">7</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">PU5</span>
                Η χρήση του GenAI έκανε πιο εύκολη την επίλυση του μυστηρίου
            </label>
            <div class="likert-scale-7">
                <label class="likert-option">
                    <input type="radio" name="pu5" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu5" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu5" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu5" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu5" value="5" required>
                    <span class="likert-label">5</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu5" value="6" required>
                    <span class="likert-label">6</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu5" value="7" required>
                    <span class="likert-label">7</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">PU6</span>
                Βρήκα το GenAI χρήσιμο για την επίλυση αυτού του μυστηρίου
            </label>
            <div class="likert-scale-7">
                <label class="likert-option">
                    <input type="radio" name="pu6" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu6" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu6" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu6" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu6" value="5" required>
                    <span class="likert-label">5</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu6" value="6" required>
                    <span class="likert-label">6</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="pu6" value="7" required>
                    <span class="likert-label">7</span>
                </label>
            </div>
        </div>
        
        <div class="subscale-header">PEU (PERCEIVED EASE OF USE)</div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">PEU1</span>
                Ήταν εύκολο για μένα να μάθω να χρησιμοποιώ το GenAI για αυτή τη δραστηριότητα
            </label>
            <div class="likert-scale-7">
                <label class="likert-option">
                    <input type="radio" name="peu1" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu1" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu1" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu1" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu1" value="5" required>
                    <span class="likert-label">5</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu1" value="6" required>
                    <span class="likert-label">6</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu1" value="7" required>
                    <span class="likert-label">7</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">PEU2</span>
                Βρήκα εύκολο να κάνω το GenAI να με βοηθήσει σε αυτό που χρειαζόμουν
            </label>
            <div class="likert-scale-7">
                <label class="likert-option">
                    <input type="radio" name="peu2" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu2" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu2" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu2" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu2" value="5" required>
                    <span class="likert-label">5</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu2" value="6" required>
                    <span class="likert-label">6</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu2" value="7" required>
                    <span class="likert-label">7</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">PEU3</span>
                Η αλληλεπίδρασή μου με το GenAI ήταν σαφής και κατανοητή
            </label>
            <div class="likert-scale-7">
                <label class="likert-option">
                    <input type="radio" name="peu3" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu3" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu3" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu3" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu3" value="5" required>
                    <span class="likert-label">5</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu3" value="6" required>
                    <span class="likert-label">6</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu3" value="7" required>
                    <span class="likert-label">7</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">PEU4</span>
                Βρήκα το GenAI ευέλικτο στην αλληλεπίδραση κατά τη διάρκεια της δραστηριότητας
            </label>
            <div class="likert-scale-7">
                <label class="likert-option">
                    <input type="radio" name="peu4" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu4" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu4" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu4" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu4" value="5" required>
                    <span class="likert-label">5</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu4" value="6" required>
                    <span class="likert-label">6</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu4" value="7" required>
                    <span class="likert-label">7</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">PEU5</span>
                Ήταν εύκολο για μένα να αποκτήσω δεξιότητες στη χρήση του GenAI κατά τη διάρκεια αυτής της δραστηριότητας
            </label>
            <div class="likert-scale-7">
                <label class="likert-option">
                    <input type="radio" name="peu5" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu5" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu5" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu5" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu5" value="5" required>
                    <span class="likert-label">5</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu5" value="6" required>
                    <span class="likert-label">6</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu5" value="7" required>
                    <span class="likert-label">7</span>
                </label>
            </div>
        </div>
        
        <div class="likert-group">
            <label class="likert-question required">
                <span class="question-number">PEU6</span>
                Βρήκα το GenAI εύκολο στη χρήση για την επίλυση του μυστηρίου
            </label>
            <div class="likert-scale-7">
                <label class="likert-option">
                    <input type="radio" name="peu6" value="1" required>
                    <span class="likert-label">1</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu6" value="2" required>
                    <span class="likert-label">2</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu6" value="3" required>
                    <span class="likert-label">3</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu6" value="4" required>
                    <span class="likert-label">4</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu6" value="5" required>
                    <span class="likert-label">5</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu6" value="6" required>
                    <span class="likert-label">6</span>
                </label>
                <label class="likert-option">
                    <input type="radio" name="peu6" value="7" required>
                    <span class="likert-label">7</span>
                </label>
            </div>
        </div>
    `;
}

function renderOpenEnded() {
    return `
        <h2 class="section-title">ΜΕΡΟΣ 6: ΕΡΩΤΗΣΕΙΣ ΑΝΟΙΧΤΟΥ ΤΥΠΟΥ</h2>
        <p class="section-subtitle">Μοιραστείτε τις σκέψεις και εμπειρίες σας</p>
        <div class="post-activity-notice">ΜΕΤΑ ΤΗ ΔΡΑΣΤΗΡΙΟΤΗΤΑ</div>
        
        <div class="form-group">
            <label for="open-strategy">
                <span class="question-number">6.1</span>
                Περιγράψτε τη στρατηγική που ακολουθήσατε για να λύσετε το μυστήριο με τη βοήθεια της ΓΝΤ:
                <span style="color: var(--gray-500); font-size: 13px; font-weight: normal;"> (Προαιρετικό)</span>
            </label>
            <textarea id="open-strategy" name="open-strategy" rows="5" 
                      placeholder="Περιγράψτε αναλυτικά τη στρατηγική σας..."></textarea>
        </div>
        
        <div class="form-group">
            <label for="open-difficulties">
                <span class="question-number">6.2</span>
                Ποιες δυσκολίες αντιμετωπίσατε στη χρήση της ΓΝΤ και πώς τις ξεπεράσατε;
                <span style="color: var(--gray-500); font-size: 13px; font-weight: normal;"> (Προαιρετικό)</span>
            </label>
            <textarea id="open-difficulties" name="open-difficulties" rows="5" 
                      placeholder="Περιγράψτε τις δυσκολίες που αντιμετωπίσατε και τις λύσεις που βρήκατε..."></textarea>
        </div>
        
        <div class="form-group">
            <label for="open-learning">
                <span class="question-number">6.3</span>
                Τι μάθατε από αυτή την εμπειρία σχετικά με τη χρήση ΓΝΤ για επίλυση προβλημάτων;
                <span style="color: var(--gray-500); font-size: 13px; font-weight: normal;"> (Προαιρετικό)</span>
            </label>
            <textarea id="open-learning" name="open-learning" rows="5" 
                      placeholder="Περιγράψτε τι μάθατε από αυτή την εμπειρία..."></textarea>
        </div>
    `;
}

window.startSurvey = startSurvey;
window.nextSection = nextSection;
window.prevSection = prevSection;
window.submitSurvey = submitSurvey;
window.handleBranching = handleBranching;
window.limitCheckboxes = limitCheckboxes;
window.toggleOtherInput = toggleOtherInput;
window.handleServicesSelection = handleServicesSelection;
window.handleNoneSelected = handleNoneSelected;
window.handleDontKnow = handleDontKnow;