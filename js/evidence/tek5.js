window.goBackToCaseFile = function() {
            const teamCode = sessionStorage.getItem('teamCode');
            console.log('🔙 Button clicked! Team:', teamCode);
            
            if (teamCode) {
                window.location.href = `../../index.html?team=${teamCode}&tab=evidence`;
            } else {
                window.location.href = '../../index.html?tab=evidence';
            }
        };

        function drawCrimeScene() {
            const canvas = document.getElementById('crimeSceneCanvas');
            const ctx = canvas.getContext('2d');
            const container = canvas.parentElement;
            const containerWidth = container.clientWidth;
            const aspectRatio = 2;
            
            canvas.width = Math.min(containerWidth, 800);
            canvas.height = canvas.width / aspectRatio;

            const scale = canvas.width / 800;
            const floorGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            floorGradient.addColorStop(0, '#8b7355');
            floorGradient.addColorStop(1, '#6b5345');
            ctx.fillStyle = floorGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
			
			ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
			ctx.lineWidth = 2 * scale;
			for (let i = 0; i < canvas.height; i += 40 * scale) {
				ctx.beginPath();
				ctx.moveTo(0, i);
				ctx.lineTo(canvas.width, i);
				ctx.stroke();
			}

            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(canvas.width/2, 240 * scale, 100 * scale, 20 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(280 * scale, 60 * scale, 240 * scale, 280 * scale);
            ctx.strokeStyle = '#cccccc';
            ctx.lineWidth = 2 * scale;
            ctx.strokeRect(280 * scale, 60 * scale, 240 * scale, 280 * scale);
            ctx.fillStyle = '#1e3a8a';
            ctx.fillRect(280 * scale, 60 * scale, 240 * scale, 40 * scale);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(300 * scale, 70 * scale, 8 * scale, 20 * scale);
            ctx.fillRect(294 * scale, 76 * scale, 20 * scale, 8 * scale);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3 * scale;
            ctx.beginPath();
            ctx.moveTo(490 * scale, 70 * scale);
            ctx.lineTo(490 * scale, 90 * scale);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(490 * scale, 75 * scale, 5 * scale, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.fillStyle = '#1a1a1a';
            ctx.font = `bold ${14 * scale}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('ΙΑΤΡΙΚΗ ΓΝΩΜΑΤΕΥΣΗ', 400 * scale, 85 * scale);
            ctx.fillStyle = '#333333';
            ctx.font = `${11 * scale}px Arial`;
            ctx.textAlign = 'left';
            ctx.fillText('ΑΣΘΕΝΗΣ: Δημητρίου Πέτρος', 295 * scale, 125 * scale);
            ctx.fillText('ΗΜΕΡΟΜΗΝΙΑ: 28/08/2025', 295 * scale, 145 * scale);
            ctx.fillText('ΔΙΑΤΡΟΣ: Δρ. Σταυρίδης Α.', 295 * scale, 165 * scale);
            ctx.fillStyle = 'rgba(220, 53, 69, 0.15)';
            ctx.fillRect(290 * scale, 180 * scale, 220 * scale, 60 * scale);
            ctx.fillStyle = '#dc3545';
            ctx.font = `bold ${12 * scale}px Arial`;
            ctx.fillText('ΔΙΑΓΝΩΣΗ:', 295 * scale, 200 * scale);
            ctx.font = `${11 * scale}px Arial`;
            ctx.fillText('Καρκίνος Παγκρέατος', 295 * scale, 215 * scale);
            ctx.fillText('Στάδιο IV', 295 * scale, 230 * scale);
            ctx.fillStyle = '#dc3545';
            ctx.font = `bold ${11 * scale}px Arial`;
            ctx.fillText('ΠΡΟΓΝΩΣΗ: 2-3 μήνες', 295 * scale, 260 * scale);
            ctx.fillStyle = '#666666';
            ctx.font = `${9 * scale}px Arial`;
            ctx.fillText('Μεταστάσεις σε ήπαρ', 295 * scale, 280 * scale);
            ctx.fillText('Ασθενής αρνήθηκε θεραπεία', 295 * scale, 295 * scale);
            ctx.fillText('Παρηγορητική φροντίδα', 295 * scale, 310 * scale);
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 1 * scale;
            ctx.beginPath();
            ctx.moveTo(350 * scale, 325 * scale);
            ctx.lineTo(500 * scale, 325 * scale);
            ctx.stroke();
            ctx.strokeStyle = '#1e3a8a';
            ctx.lineWidth = 2 * scale;
            ctx.beginPath();
            ctx.moveTo(360 * scale, 320 * scale);
            ctx.quadraticCurveTo(390 * scale, 310 * scale, 420 * scale, 320 * scale);
            ctx.quadraticCurveTo(440 * scale, 325 * scale, 460 * scale, 318 * scale);
            ctx.stroke();
            ctx.save();
            ctx.translate(450 * scale, 160 * scale);
            ctx.rotate(-0.3);
            ctx.strokeStyle = '#dc3545';
            ctx.lineWidth = 3 * scale;
            ctx.strokeRect(-50 * scale, -15 * scale, 100 * scale, 30 * scale);
            ctx.fillStyle = 'rgba(220, 53, 69, 0.1)';
            ctx.fillRect(-50 * scale, -15 * scale, 100 * scale, 30 * scale);
            ctx.fillStyle = '#dc3545';
            ctx.font = `bold ${12 * scale}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('ΑΠΟΡΡΗΤΟ', 0, 5 * scale);
            ctx.restore();
			
			ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
			ctx.fillRect(0, 0, canvas.width, 40 * scale);

			ctx.fillStyle = '#ff0000';
			ctx.font = `bold ${14 * scale}px monospace`;
			ctx.textAlign = 'left';
			ctx.fillText('● REC', 10 * scale, 25 * scale);

			ctx.fillStyle = '#fff';
			ctx.fillText('31/10/2025  08:18:25  |  ΣΚΗΝΗ ΕΓΚΛΗΜΑΤΟΣ - ΓΡΑΦΕΙΟ ΘΥΜΑΤΟΣ (ΣΥΡΤΑΡΙ)', 80 * scale, 25 * scale);

			ctx.textAlign = 'right';
			ctx.fillText('ΤΕΚ #005', (canvas.width - 10 * scale), 25 * scale);
        }

        function handleResize() {
            drawCrimeScene();
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        window.onload = function() {
            drawCrimeScene();
        };