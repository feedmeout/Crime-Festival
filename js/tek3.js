const view3DBtn = document.getElementById('view3DBtn');
        const close3DBtn = document.getElementById('close3DBtn');
        const modelViewerContainer = document.getElementById('modelViewerContainer');

        view3DBtn.addEventListener('click', function() {
            modelViewerContainer.classList.add('active');
            view3DBtn.style.display = 'none';
            
            setTimeout(() => {
                modelViewerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });

        close3DBtn.addEventListener('click', function() {
            modelViewerContainer.classList.remove('active');
            view3DBtn.style.display = 'flex';
            view3DBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        window.goBackToCaseFile = function() {
            const teamCode = sessionStorage.getItem('teamCode');
            console.log('🔙 Button clicked! Team:', teamCode);
            
            if (teamCode) {
                window.location.href = `../index.html?team=${teamCode}&tab=evidence`;
            } else {
                window.location.href = '../index.html?tab=evidence';
            }
        };

        function drawCrimeScene() {
            const canvas = document.getElementById('crimeSceneCanvas');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const container = canvas.parentElement;
            const dpr = window.devicePixelRatio || 1;
            const containerWidth = container.clientWidth;
            const aspectRatio = 2;
            const canvasWidth = Math.min(containerWidth, 800);
            const canvasHeight = canvasWidth / aspectRatio;
            
            canvas.width = canvasWidth * dpr;
            canvas.height = canvasHeight * dpr;
            canvas.style.width = canvasWidth + 'px';
            canvas.style.height = canvasHeight + 'px';
            
            ctx.scale(dpr, dpr);
            
            const scaleX = canvasWidth / 800;
            const scaleY = canvasHeight / 400;
            const scale = Math.min(scaleX, scaleY);
            const floorGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
            floorGradient.addColorStop(0, '#8b7355');
            floorGradient.addColorStop(1, '#6b5345');
            ctx.fillStyle = floorGradient;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
			
			ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
			ctx.lineWidth = 2 * scale;
			for (let i = 0; i < canvasHeight; i += 40 * scale) {
				ctx.beginPath();
				ctx.moveTo(0, i);
				ctx.lineTo(canvasWidth, i);
				ctx.stroke();
			}
            
            const phoneWidth = 140 * scale;
            const phoneHeight = 260 * scale;
            const phoneX = (canvasWidth - phoneWidth) / 2;
            const phoneY = (canvasHeight - phoneHeight) / 2;
            const phoneGradient = ctx.createLinearGradient(phoneX, phoneY, phoneX + phoneWidth, phoneY);
            phoneGradient.addColorStop(0, '#1a1a1a');
            phoneGradient.addColorStop(0.5, '#2d2d2d');
            phoneGradient.addColorStop(1, '#1a1a1a');
            ctx.fillStyle = phoneGradient;
            
            ctx.beginPath();
            ctx.roundRect(phoneX, phoneY, phoneWidth, phoneHeight, 15 * scale);
            ctx.fill();
            
            const screenX = phoneX + 10 * scale;
            const screenY = phoneY + 20 * scale;
            const screenWidth = phoneWidth - 20 * scale;
            const screenHeight = phoneHeight - 40 * scale;
            
            const screenGradient = ctx.createLinearGradient(screenX, screenY, screenX + screenWidth, screenY);
            screenGradient.addColorStop(0, '#0a4d6e');
            screenGradient.addColorStop(0.5, '#0d5f8a');
            screenGradient.addColorStop(1, '#0a4d6e');
            ctx.fillStyle = screenGradient;
            ctx.fillRect(screenX, screenY, screenWidth, screenHeight);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(screenX + 5 * scale, screenY + 5 * scale, 50 * scale, 100 * scale);

            const centerX = phoneX + phoneWidth / 2;
            const centerY = phoneY + phoneHeight / 2;
            
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${16 * scale}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText('💬', centerX, centerY - 40 * scale);
            
            ctx.fillStyle = '#fff';
            ctx.font = `${11 * scale}px sans-serif`;
            ctx.fillText('Νέο Μήνυμα', centerX, centerY - 15 * scale);
            ctx.fillText('20:45', centerX, centerY);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = `bold ${10 * scale}px sans-serif`;
            ctx.fillText('Θα τελειώσει απόψε...', centerX, centerY + 20 * scale);
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(centerX, phoneY + phoneHeight - 15 * scale, 10 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#1a5f7a';
            ctx.fillRect(centerX - 10 * scale, phoneY + 12 * scale, 20 * scale, 2 * scale);
			
			ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
			ctx.fillRect(0, 0, canvasWidth, 40 * scale);

			ctx.fillStyle = '#ff0000';
			ctx.font = `bold ${14 * scale}px monospace`;
			ctx.textAlign = 'left';
			ctx.fillText('● REC', 10 * scale, 25 * scale);

			ctx.fillStyle = '#fff';
			ctx.fillText('31/10/2025  07:42:10  |  ΣΚΗΝΗ ΕΓΚΛΗΜΑΤΟΣ - ΓΡΑΦΕΙΟ ΘΥΜΑΤΟΣ', 80 * scale, 25 * scale);

			ctx.textAlign = 'right';
			ctx.fillText('ΤΕΚ #003', (canvasWidth - 10 * scale), 25 * scale);
        }

        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(drawCrimeScene, 250);
        });

        window.addEventListener('load', drawCrimeScene);