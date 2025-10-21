window.goBackToCaseFile = function() {
            const teamCode = sessionStorage.getItem('teamCode');
            console.log('🔙 Button clicked! Team:', teamCode);
            
            if (teamCode) {
                window.location.href = `../index.html?team=${teamCode}&tab=evidence`;
            } else {
                window.location.href = '../../index.html?tab=evidence';
            }
        };

        function drawCrimeScene() {
            const canvas = document.getElementById('crimeSceneCanvas');
            const ctx = canvas.getContext('2d');
            const containerWidth = canvas.parentElement.offsetWidth;
            const aspectRatio = 4/3;
            canvas.width = Math.min(800, containerWidth);
            canvas.height = canvas.width / aspectRatio;
            
            const scale = canvas.width / 800;
            ctx.scale(scale, scale);
            
            const floorGradient = ctx.createLinearGradient(0, 0, 0, 600);
            floorGradient.addColorStop(0, '#8b7355');
            floorGradient.addColorStop(0.5, '#7a6348');
            floorGradient.addColorStop(1, '#6b5345');
            ctx.fillStyle = floorGradient;
            ctx.fillRect(0, 0, 800, 600);
			
			ctx.strokeStyle = 'rgba(101, 67, 33, 0.2)';
			ctx.lineWidth = 1.5;
			for (let i = 0; i < 600; i += 35) {
				ctx.beginPath();
				ctx.moveTo(0, i);
				ctx.lineTo(800, i);
				ctx.stroke();
			}

            const receiptX = 100;
            const receiptY = 50;
            const receiptWidth = 600;
            const receiptHeight = 540;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
            ctx.beginPath();
            ctx.roundRect(receiptX + 8, receiptY + 8, receiptWidth, receiptHeight, 4);
            ctx.fill();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.beginPath();
            ctx.roundRect(receiptX + 5, receiptY + 5, receiptWidth, receiptHeight, 4);
            ctx.fill();

            const paperGradient = ctx.createLinearGradient(receiptX, receiptY, receiptX + receiptWidth, receiptY);
            paperGradient.addColorStop(0, '#fafafa');
            paperGradient.addColorStop(0.5, '#ffffff');
            paperGradient.addColorStop(1, '#f8f8f8');
            ctx.fillStyle = paperGradient;
            ctx.beginPath();
            ctx.roundRect(receiptX, receiptY, receiptWidth, receiptHeight, 4);
            ctx.fill();
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(receiptX, receiptY, receiptWidth, receiptHeight, 4);
            ctx.stroke();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = '#bbb';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(receiptX + 20, receiptY + 20);
            ctx.lineTo(receiptX + receiptWidth - 20, receiptY + 20);
            ctx.stroke();
            ctx.setLineDash([]);
            
            const logoGradient = ctx.createLinearGradient(receiptX + 30, receiptY + 30, receiptX + receiptWidth - 30, receiptY + 30);
            logoGradient.addColorStop(0, '#ff6b00');
            logoGradient.addColorStop(1, '#ff8800');
            ctx.fillStyle = logoGradient;
            ctx.beginPath();
            ctx.roundRect(receiptX + 30, receiptY + 35, receiptWidth - 60, 55, 6);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('ΧΗΜΙΚΑ PLUS Α.Ε.', receiptX + receiptWidth / 2, receiptY + 65);
            ctx.font = '11px Arial';
            ctx.fillText('Λεωφ. Κηφισίας 247, Χαλάνδρι 152 32', receiptX + receiptWidth / 2, receiptY + 82);
            ctx.fillStyle = '#555';
            ctx.font = '10px Arial';
            ctx.fillText('ΑΦΜ: 094523871 | ΔΟΥ: Χαλανδρίου | Τηλ: 210-6847321', receiptX + receiptWidth / 2, receiptY + 105);
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(receiptX + 30, receiptY + 115);
            ctx.lineTo(receiptX + receiptWidth - 30, receiptY + 115);
            ctx.stroke();
            ctx.fillStyle = '#333';
            ctx.font = '11px monospace';
            ctx.textAlign = 'left';
            
            let yPos = receiptY + 135;
            ctx.fillText('Αριθμός Απόδειξης: #CH-2025-09847', receiptX + 40, yPos);
            yPos += 18;
            ctx.fillText('Ημερομηνία: 19/09/2025 - 14:30', receiptX + 40, yPos);
            yPos += 18;
            ctx.fillText('Πωλητής: Α. Κωνσταντινίδης', receiptX + 40, yPos);
            yPos += 18;
            
            ctx.setLineDash([2, 2]);
            ctx.strokeStyle = '#ccc';
            ctx.beginPath();
            ctx.moveTo(receiptX + 30, yPos + 5);
            ctx.lineTo(receiptX + receiptWidth - 30, yPos + 5);
            ctx.stroke();
            ctx.setLineDash([]);
            yPos += 20;
            
            ctx.fillStyle = 'rgba(220, 53, 69, 0.08)';
            ctx.beginPath();
            ctx.roundRect(receiptX + 25, yPos - 10, receiptWidth - 50, 90, 6);
            ctx.fill();
            ctx.strokeStyle = 'rgba(220, 53, 69, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(receiptX + 25, yPos - 10, receiptWidth - 50, 90, 6);
            ctx.stroke();
            
            ctx.fillStyle = '#dc3545';
            ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('⚠️', receiptX + 35, yPos + 10);
            ctx.fillStyle = '#c00';
            ctx.font = 'bold 15px Arial';
            ctx.fillText('ΚΥΑΝΙΟΥΧΟ ΚΑΛΙΟ (KCN)', receiptX + 60, yPos + 10);
            yPos += 25;
            
            ctx.fillStyle = '#333';
            ctx.font = '11px monospace';
            ctx.fillText('Ποσότητα:', receiptX + 60, yPos);
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'right';
            ctx.fillText('500g', receiptX + receiptWidth - 60, yPos);
            yPos += 18;
            ctx.textAlign = 'left';
            ctx.font = '11px monospace';
            ctx.fillText('Τιμή Μονάδας:', receiptX + 60, yPos);
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'right';
            ctx.fillText('€42.00', receiptX + receiptWidth - 60, yPos);
            yPos += 18;
            ctx.textAlign = 'left';
            ctx.font = '10px monospace';
            ctx.fillStyle = '#666';
            ctx.fillText('Κωδικός: KCN-500-IND', receiptX + 60, yPos);
            yPos += 20;
            
            ctx.setLineDash([2, 2]);
            ctx.strokeStyle = '#ccc';
            ctx.beginPath();
            ctx.moveTo(receiptX + 30, yPos);
            ctx.lineTo(receiptX + receiptWidth - 30, yPos);
            ctx.stroke();
            ctx.setLineDash([]);
            yPos += 20;
            
            ctx.fillStyle = '#1a1a2e';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('ΣΥΝΟΛΟ:', receiptX + 40, yPos);
            ctx.textAlign = 'right';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('€42.00', receiptX + receiptWidth - 40, yPos);
            yPos += 25;
            
            ctx.fillStyle = '#555';
            ctx.font = '10px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('Μέθοδος Πληρωμής: Μετρητά', receiptX + 40, yPos);
            yPos += 25;
            
            ctx.fillStyle = 'rgba(255, 107, 0, 0.12)';
            ctx.fillRect(receiptX + 30, yPos, receiptWidth - 60, 50);
            ctx.strokeStyle = '#ff8800';
            ctx.lineWidth = 2;
            ctx.strokeRect(receiptX + 30, yPos, receiptWidth - 60, 50);
            yPos += 18;
            
            ctx.fillStyle = '#444';
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'left';
            ctx.fillText('Άδεια Απεντόμωσης: ΑΠ-2024-15873', receiptX + 40, yPos);
            yPos += 16;
            ctx.font = '10px Arial';
            ctx.fillStyle = '#555';
            ctx.fillText('Εταιρεία: SecureGuard Υπηρεσίες Ασφαλείας', receiptX + 40, yPos);
            yPos += 30;
            
            ctx.setLineDash([3, 3]);
            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(receiptX + 30, yPos);
            ctx.lineTo(receiptX + receiptWidth - 30, yPos);
            ctx.stroke();
            ctx.setLineDash([]);
            yPos += 20;
            
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(receiptX + 80, yPos);
            ctx.lineTo(receiptX + receiptWidth - 80, yPos);
            ctx.stroke();
            ctx.fillStyle = '#1a1a2e';
            ctx.font = 'italic bold 20px cursive';
            ctx.textAlign = 'center';
            ctx.fillText('Γ. Πετρόπουλος', receiptX + receiptWidth / 2, yPos - 8);
            yPos += 15;
            ctx.fillStyle = '#777';
            ctx.font = '9px Arial';
            ctx.fillText('Υπογραφή Αγοραστή', receiptX + receiptWidth / 2, yPos);
            yPos += 25;
            
            const barcodeWidth = 300;
            const barcodeX = receiptX + (receiptWidth - barcodeWidth) / 2;
            ctx.fillStyle = '#000';
            ctx.fillRect(barcodeX, yPos, barcodeWidth, 2);
            yPos += 4;
            
            let random = 12345;
            for (let i = 0; i < 60; i++) {
                random = (random * 9301 + 49297) % 233280;
                const barWidth = (random % 3) + 1;
                const spacing = i * 5;
                ctx.fillRect(barcodeX + spacing, yPos, barWidth, 25);
            }
            
            yPos += 32;
            ctx.fillStyle = '#666';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('CH-2025-09847-KCN', receiptX + receiptWidth / 2, yPos);
			
			ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
			ctx.fillRect(0, 0, 800, 40);
			ctx.fillStyle = '#ff0000';
			ctx.font = 'bold 14px monospace';
			ctx.textAlign = 'left';
			ctx.fillText('● REC', 10, 25);
			ctx.fillStyle = '#fff';
			ctx.fillText('31/10/2025  09:16:35  |  ΣΚΗΝΗ ΕΓΚΛΗΜΑΤΟΣ - ΛΟΓΙΣΤΗΡΙΟ', 80, 25);
			ctx.textAlign = 'right';
			ctx.fillText('ΤΕΚ #009', 780, 25);
        }

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(drawCrimeScene, 250);
        });

        window.onload = function() {
            drawCrimeScene();
        };