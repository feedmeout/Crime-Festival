const view3DBtn = document.getElementById('view3DBtn');
        const close3DBtn = document.getElementById('close3DBtn');
        const modelViewerContainer = document.getElementById('modelViewerContainer');

        view3DBtn.addEventListener('click', function() {
            modelViewerContainer.classList.add('active');
            view3DBtn.style.display = 'none';
            close3DBtn.style.display = 'inline-flex';
            
            setTimeout(() => {
                modelViewerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });

        close3DBtn.addEventListener('click', function() {
            modelViewerContainer.classList.remove('active');
            view3DBtn.style.display = 'inline-flex';
            close3DBtn.style.display = 'none';
            
            view3DBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

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

            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const floorWidth = canvas.width * 1;
            const floorX = (canvas.width - floorWidth) / 2;
            
            const floorGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            floorGradient.addColorStop(0, '#8b7355');
            floorGradient.addColorStop(1, '#6b5345');
            ctx.fillStyle = floorGradient;
            ctx.fillRect(floorX, 0, floorWidth, canvas.height);
			
			ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
			ctx.lineWidth = 2 * scale;
			for (let i = 0; i < canvas.height; i += 40 * scale) {
				ctx.beginPath();
				ctx.moveTo(floorX, i);
				ctx.lineTo(floorX + floorWidth, i);
				ctx.stroke();
			}

            const centerX = canvas.width / 2;
			
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(centerX - 100 * scale, 320 * scale, 35 * scale, 15 * scale, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(centerX + 100 * scale, 330 * scale, 40 * scale, 15 * scale, -0.3, 0, Math.PI * 2);
            ctx.fill();
            
            const glass1X = centerX - 100 * scale;
            const glass1Gradient = ctx.createLinearGradient(glass1X - 40 * scale, 260 * scale, glass1X + 40 * scale, 260 * scale);
            glass1Gradient.addColorStop(0, 'rgba(200, 220, 255, 0.3)');
            glass1Gradient.addColorStop(0.5, 'rgba(220, 235, 255, 0.5)');
            glass1Gradient.addColorStop(1, 'rgba(200, 220, 255, 0.3)');
            ctx.fillStyle = glass1Gradient;
            ctx.beginPath();
            ctx.moveTo(glass1X - 35 * scale, 320 * scale);
            ctx.lineTo(glass1X - 30 * scale, 260 * scale);
            ctx.lineTo(glass1X + 30 * scale, 260 * scale);
            ctx.lineTo(glass1X + 35 * scale, 320 * scale);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = 'rgba(180, 200, 230, 0.8)';
            ctx.lineWidth = 3 * scale;
            ctx.beginPath();
            ctx.ellipse(glass1X, 260 * scale, 32 * scale, 8 * scale, 0, 0, Math.PI * 2);
            ctx.stroke();
			
            ctx.fillStyle = 'rgba(180, 200, 230, 0.4)';
            ctx.beginPath();
            ctx.ellipse(glass1X, 320 * scale, 35 * scale, 12 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(200, 150, 80, 0.5)';
            ctx.beginPath();
            ctx.moveTo(glass1X - 28 * scale, 305 * scale);
            ctx.lineTo(glass1X - 25 * scale, 285 * scale);
            ctx.lineTo(glass1X + 25 * scale, 285 * scale);
            ctx.lineTo(glass1X + 28 * scale, 305 * scale);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2 * scale;
            ctx.beginPath();
            ctx.moveTo(glass1X - 27 * scale, 270 * scale);
            ctx.lineTo(glass1X - 30 * scale, 310 * scale);
            ctx.stroke();

            const glass2X = centerX + 100 * scale;
            ctx.save();
            ctx.translate(glass2X, 300 * scale);
            ctx.rotate(-0.4);

            const glass2Gradient = ctx.createLinearGradient(-40 * scale, -30 * scale, 40 * scale, -30 * scale);
            glass2Gradient.addColorStop(0, 'rgba(200, 220, 255, 0.3)');
            glass2Gradient.addColorStop(0.5, 'rgba(220, 235, 255, 0.5)');
            glass2Gradient.addColorStop(1, 'rgba(200, 220, 255, 0.3)');
            ctx.fillStyle = glass2Gradient;
            ctx.beginPath();
            ctx.moveTo(-35 * scale, 0);
            ctx.lineTo(-30 * scale, -60 * scale);
            ctx.lineTo(30 * scale, -60 * scale);
            ctx.lineTo(35 * scale, 0);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = 'rgba(180, 200, 230, 0.8)';
            ctx.lineWidth = 3 * scale;
            ctx.beginPath();
            ctx.ellipse(0, -60 * scale, 32 * scale, 8 * scale, 0, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = 'rgba(180, 200, 230, 0.4)';
            ctx.beginPath();
            ctx.ellipse(0, 0, 35 * scale, 12 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(100, 80, 60, 0.2)';
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.ellipse((-10 + i * 8) * scale, (-35 + i * 8) * scale, 8 * scale, 12 * scale, 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2 * scale;
            ctx.beginPath();
            ctx.moveTo(-25 * scale, -45 * scale);
            ctx.lineTo(-22 * scale, -10 * scale);
            ctx.stroke();
            
            ctx.restore();

            ctx.fillStyle = 'rgba(220, 53, 69, 0.8)';
            ctx.font = `bold ${16 * scale}px monospace`;
            ctx.textAlign = 'center';
            ctx.fillText('A', glass1X, 345 * scale);
            ctx.fillText('B', glass2X - 20 * scale, 345 * scale);

			ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
			ctx.fillRect(0, 0, canvas.width, 40 * scale);

			ctx.fillStyle = '#ff0000';
			ctx.font = `bold ${14 * scale}px monospace`;
			ctx.textAlign = 'left';
			ctx.fillText('● REC', 10 * scale, 25 * scale);

			ctx.fillStyle = '#fff';
			ctx.fillText('31/10/2025  07:28:45  |  ΣΚΗΝΗ ΕΓΚΛΗΜΑΤΟΣ - ΓΡΑΦΕΙΟ ΘΥΜΑΤΟΣ', 80 * scale, 25 * scale);

			ctx.textAlign = 'right';
			ctx.fillText('ΤΕΚ #002', (canvas.width - 10 * scale), 25 * scale);
        }

        function handleResize() {
            drawCrimeScene();
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        window.onload = function() {
            drawCrimeScene();
        };