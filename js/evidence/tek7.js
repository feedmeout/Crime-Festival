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
            const container = canvas.parentElement;
            const containerWidth = container.clientWidth;
            const scaleFactor = Math.min(containerWidth / 800, 1);
            const dpr = window.devicePixelRatio || 1;
            const width = Math.min(800, containerWidth);
            const height = width * 0.5;
            
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            
            ctx.scale(dpr, dpr);

            const floorGradient = ctx.createLinearGradient(0, 0, 0, height);
            floorGradient.addColorStop(0, '#8b7355');
            floorGradient.addColorStop(1, '#6b5345');
            ctx.fillStyle = floorGradient;
            ctx.fillRect(0, 0, width, height);
			ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
			ctx.lineWidth = 2;
			for (let i = 0; i < height; i += height * 0.1) {
				ctx.beginPath();
				ctx.moveTo(0, i);
				ctx.lineTo(width, i);
				ctx.stroke();
			}

			const paperX = width * 0.3;
			const paperY = height * 0.2;
			const paperWidth = width * 0.4;
			const paperHeight = height * 0.7;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(paperX, paperY, paperWidth, paperHeight);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(paperX + paperWidth/2, paperY);
            ctx.lineTo(paperX + paperWidth/2, paperY + paperHeight);
            ctx.stroke();

            const fontSize = Math.min(Math.max(width * 0.025, 12), paperWidth * 0.15);
            ctx.fillStyle = '#1a3a8a';
            ctx.font = `italic ${fontSize}px Georgia, serif`;
            ctx.textAlign = 'center';
            const text = 'Συγχώρεσέ με Μ.';
			const maxWidth = paperWidth * 0.9;
			ctx.fillText(text, paperX + paperWidth/2, paperY + paperHeight/2, maxWidth);
            ctx.fillStyle = 'rgba(26, 58, 138, 0.1)';
            ctx.fillRect(paperX + paperWidth/2 - width * 0.075, paperY + paperHeight/2 - height * 0.05, width * 0.15, height * 0.0075);
			
			ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
			ctx.fillRect(0, 0, width, height * 0.1);
			ctx.fillStyle = '#ff0000';
			ctx.font = `bold ${14 * (width / 800)}px monospace`;
			ctx.textAlign = 'left';
			ctx.fillText('● REC', 10 * (width / 800), 25 * (height / 400));
			ctx.fillStyle = '#fff';
			ctx.fillText('31/10/2025  08:47:55  |  ΣΚΗΝΗ ΕΓΚΛΗΜΑΤΟΣ - ΓΡΑΦΕΙΟ ΘΥΜΑΤΟΣ', 80 * (width / 800), 25 * (height / 400));
			ctx.textAlign = 'right';
			ctx.fillText('ΤΕΚ #007', (width - 10) * (width / 800), 25 * (height / 400));
        }

        window.addEventListener('load', drawCrimeScene);
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(drawCrimeScene, 250);
        });