const tekData = [
            { id: 'entry', name: 'ΕΝΑΡΞΗ ΜΥΣΤΗΡΙΟΥ', icon: '🔎', tag: 'entry', url: 'team_entry.html' },
            { id: 1, name: 'ΜΠΟΥΚΑΛΙ ΟΥΙΣΚΙ', icon: '🍾', tag: 'critical' },
            { id: 2, name: 'ΚΡΥΣΤΑΛΛΙΝΑ ΠΟΤΗΡΙΑ', icon: '🥃', tag: 'critical' },
            { id: 3, name: 'ΚΙΝΗΤΟ ΘΥΜΑΤΟΣ', icon: '📱', tag: 'threat' },
            { id: 4, name: 'EMAIL «ΑΥΤΟΚΤΟΝΙΑΣ»', icon: '📧', tag: 'forgery' },
            { id: 5, name: 'ΙΑΤΡΙΚΗ ΓΝΩΜΑΤΕΥΣΗ', icon: '🥼', tag: 'secret' },
            { id: 6, name: 'ΓΑΝΤΙΑ ΛΑΤΕΞ', icon: '🧤', tag: 'clue' },
            { id: 7, name: 'ΧΕΙΡΟΓΡΑΦΟ ΣΗΜΕΙΩΜΑ', icon: '✍️', tag: 'forgery' },
            { id: 8, name: 'ΦΑΚΕΛΟΣ «ΕΜΠΙΣΤΕΥΤΙΚΟ»', icon: '📂', tag: 'blackmail' },
            { id: 9, name: 'ΑΠΟΔΕΙΞΗ ΧΗΜΙΚΩΝ', icon: '🧪', tag: 'critical' },
            { id: 10, name: 'ΚΛΕΙΔΙ ΧΡΗΜΑΤΟΚΙΒΩΤΙΟΥ', icon: '🔑', tag: 'financial' },
            { id: 11, name: 'ΚΑΜΕΡΕΣ ΑΣΦΑΛΕΙΑΣ', icon: '🎥', tag: 'sabotage' }
        ];

        const tagLabels = {
            'critical': 'ΚΡΙΣΙΜΟ',
            'secret': 'ΑΠΟΡΡΗΤΟ',
            'threat': 'ΑΠΕΙΛΗ',
            'forgery': 'ΠΛΑΣΤΟΓΡΑΦΙΑ',
            'clue': 'ΕΝΔΕΙΞΗ',
            'financial': 'ΟΙΚΟΝΟΜΙΚΟ',
            'blackmail': 'ΕΚΒΙΑΣΜΟΣ',
            'sabotage': 'ΣΑΜΠΟΤΑΖ',
            'entry': 'ΕΝΑΡΞΗ'
        };

        function generateAllQRCodes() {
            let baseUrl = document.getElementById('baseUrl').value.trim();
            
            if (!baseUrl) {
                alert('⚠️ Παρακαλώ εισάγετε το Base URL!');
                return;
            }

            if (!baseUrl.endsWith('/')) {
                baseUrl += '/';
            }

            const container = document.getElementById('qrContainer');
            container.innerHTML = '';

			tekData.forEach((tek, index) => {
				let url;
				if (tek.id === 'entry') {
					url = `${baseUrl}pages/team_entry.html`;
				} else {
					url = `${baseUrl}pages/unlock_system.html?tek=${tek.id}`;
				}
                
                const tagLabel = tagLabels[tek.tag] || '';
                const tagClass = `tag-${tek.tag}`;
                
                let cardClass = 'qr-card';
                if (tek.tag === 'critical') cardClass += ' critical';
                if (tek.tag === 'entry') cardClass += ' entry';

                let cardNumber;
                if (tek.id === 'entry') {
                    cardNumber = '<div class="tek-number">TEK #000</div>';
                } else {
                    cardNumber = `<div class="tek-number">ΤΕΚ #${tek.id.toString().padStart(3, '0')}</div>`;
                }
                
                let scanInstructionClass = 'scan-instruction';
                let scanText = '📱 ΣΚΑΝΑΡΕΤΕ ΓΙΑ ΞΕΚΛΕΙΔΩΜΑ';
                if (tek.id === 'entry') {
                    scanInstructionClass += ' entry-instruction';
                    scanText = '📱 ΣΚΑΝΑΡΕΤΕ ΓΙΑ ΕΙΣΟΔΟ';
                }
                
                const cardDiv = document.createElement('div');
                cardDiv.className = cardClass;
                cardDiv.innerHTML = `
                    ${tagLabel ? `<div class="critical-tag ${tagClass}">⚠️ ${tagLabel}</div>` : ''}
                    ${cardNumber}
                    <div class="tek-icon">${tek.icon}</div>
                    <div class="tek-name">${tek.name}</div>
                    <div class="qr-container">
                        <div class="qr-code-wrapper" id="qr-${tek.id}"></div>
                    </div>
                    <div class="${scanInstructionClass}">
                        ${scanText}
                    </div>
                    <div class="url-display">${url}</div>
                `;
                
                container.appendChild(cardDiv);

                setTimeout(() => {
                    const qrSize = Math.min(200, window.innerWidth - 100);
                    new QRCode(document.getElementById(`qr-${tek.id}`), {
                        text: url,
                        width: qrSize,
                        height: qrSize,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }, 100 * index);
            });

            console.log('✅ All 12 QR codes generated successfully!');
        }

        window.addEventListener('DOMContentLoaded', () => {
            generateAllQRCodes();
        });

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                generateAllQRCodes();
            }, 500);
        });