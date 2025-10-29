const StorageManager = {
    saveAuth(teamCode, memberName) {
        localStorage.setItem('teamCode', teamCode);
        localStorage.setItem('memberName', memberName);
        localStorage.setItem('memberAuth', 'true');
        localStorage.setItem('lastLogin', new Date().toISOString());
        
        sessionStorage.setItem('teamCode', teamCode);
        sessionStorage.setItem('memberName', memberName);
        sessionStorage.setItem('sessionActive', 'true');
        sessionStorage.setItem('sessionStart', new Date().toISOString());
        
        console.log('✅ Auth saved to both storages');
    },
    
    getAuth() {
        let teamCode = sessionStorage.getItem('teamCode') || localStorage.getItem('teamCode');
        let memberName = sessionStorage.getItem('memberName') || localStorage.getItem('memberName');
        return { teamCode, memberName };
    },
    
    isAuthenticated() {
        const hasLocalAuth = localStorage.getItem('memberAuth') === 'true';
        const hasTeamCode = localStorage.getItem('teamCode') !== null;
        return hasLocalAuth && hasTeamCode;
    }
};

function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    alertBox.innerHTML = `
        <div class="alert alert-${type}">
            ${type === 'error' ? '❌' : 'ℹ️'} ${message}
        </div>
    `;
    
    setTimeout(() => {
        alertBox.innerHTML = '';
    }, 5000);
}

function setLoading(isLoading) {
    const btn = document.getElementById('enterBtn');
    const teamInput = document.getElementById('teamName');
    const memberInput = document.getElementById('memberName');
    const passwordInput = document.getElementById('teamPassword');
    
    if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = '<span class="loading"></span>Επαλήθευση...';
        teamInput.disabled = true;
        memberInput.disabled = true;
        passwordInput.disabled = true;
    } else {
        btn.disabled = false;
        btn.innerHTML = 'ΕΝΑΡΞΗ ΜΥΣΤΗΡΙΟΥ';
        teamInput.disabled = false;
        memberInput.disabled = false;
        passwordInput.disabled = false;
    }
}

async function enterGame(event) {
    event.preventDefault();
    
    const teamName = document.getElementById('teamName').value.trim().toLowerCase();
    const memberName = document.getElementById('memberName').value.trim();
    const password = document.getElementById('teamPassword').value.trim();

    if (!teamName) {
        showAlert('Παρακαλώ εισάγετε το όνομα της ομάδας!');
        return;
    }

    if (!memberName) {
        showAlert('Παρακαλώ εισάγετε το όνομά σας!');
        return;
    }

    if (!password) {
        showAlert('Παρακαλώ εισάγετε τον κωδικό της ομάδας!');
        return;
    }
    
    if (!window.firebaseReady) {
        showAlert('Αναμονή σύνδεσης... Δοκιμάστε ξανά σε λίγο.', 'info');
        return;
    }

    setLoading(true);

    try {
        const docRef = window.firebaseDoc(window.firebaseDB, 'teams', teamName);
        const docSnap = await window.firebaseGetDoc(docRef);

        if (!docSnap.exists()) {
            setLoading(false);
            showAlert(`Η ομάδα "${teamName}" δεν βρέθηκε! Επικοινωνήστε με τον διοργανωτή.`);
            return;
        }

        const teamData = docSnap.data();
        
        console.log('=== TEAM LOGIN DEBUG ===');
        console.log('Team name:', teamName);
        console.log('Full team data:', teamData);
        console.log('testingMode value:', teamData.testingMode);
        console.log('testingMode type:', typeof teamData.testingMode);
        console.log('All team keys:', Object.keys(teamData));
        console.log('========================');

        if (!teamData.password || teamData.password !== password) {
            setLoading(false);
            showAlert('Λάθος κωδικός! Προσπαθήστε ξανά.');
            document.getElementById('teamPassword').value = '';
            document.getElementById('teamPassword').focus();
            return;
        }

        StorageManager.saveAuth(teamName, memberName);

        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect');

        const isTestingMode = teamData.testingMode === true || 
                             teamData.testingMode === 'true' || 
                             teamData.testingMode === 1 ||
                             teamData.testingMode === '1';
        
        console.log('🧪 Testing mode check:', isTestingMode);

        if (isTestingMode) {
            console.log(`✅ Testing mode ACTIVE for team ${teamName}`);
            console.log('🚀 Bypassing all survey requirements');
            
            setLoading(false);
            //alert('🧪 ΛΕΙΤΟΥΡΓΙΑ ΔΟΚΙΜΩΝ ΕΝΕΡΓΗ\n\nΠαράκαμψη ερωτηματολογίων...');
            setLoading(true);
            
            setTimeout(() => {
                if (redirectUrl) {
                    console.log(`🔄 Redirecting to: ${redirectUrl}`);
                    window.location.href = redirectUrl;
                } else {
                    console.log('🔄 Redirecting to index.html');
                    window.location.href = `../index.html?team=${teamName}`;
                }
            }, 500);
            return;
        }

        console.log('📋 Normal mode - checking survey requirements');
        
        const preSurveyDoc = `${teamName}_pre_${memberName}`;
        const preSurveyRef = window.firebaseDoc(window.firebaseDB, 'surveys', preSurveyDoc);
        const preSurveySnap = await window.firebaseGetDoc(preSurveyRef);

        if (!preSurveySnap.exists()) {
            console.log('❌ Pre-survey not found - redirecting to survey');
            setLoading(false);
            alert('Πρώτα πρέπει να ολοκληρώσετε την προκαταρκτική έρευνα!');
            
            const surveyUrl = `survey.html?team=${teamName}&member=${encodeURIComponent(memberName)}&type=pre`;
            
            if (redirectUrl) {
                window.location.href = `${surveyUrl}&redirect=${encodeURIComponent(redirectUrl)}`;
            } else {
                window.location.href = surveyUrl;
            }
        } else {
            console.log(`✅ Member authenticated: ${teamName}/${memberName}`);
            
            if (redirectUrl) {
                console.log(`🔄 Redirecting to: ${redirectUrl}`);
                window.location.href = redirectUrl;
            } else {
                window.location.href = `../index.html?team=${teamName}`;
            }
        }

    } catch (error) {
        setLoading(false);
        console.error('❌ Login error:', error);
        showAlert('Σφάλμα σύνδεσης. Παρακαλώ δοκιμάστε ξανά.');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    if (StorageManager.isAuthenticated()) {
        const { teamCode: storedTeam } = StorageManager.getAuth();
        console.log('Already authenticated, checking for redirect...');
        
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect');
        
        if (redirectUrl) {
            console.log(`🔄 Already logged in, redirecting to: ${redirectUrl}`);
            window.location.href = redirectUrl;
        } else {
            console.log('Already logged in, redirecting to index...');
            window.location.href = `../index.html?team=${storedTeam}`;
        }
    }
});