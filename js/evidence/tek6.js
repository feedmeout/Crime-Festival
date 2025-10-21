const view3dBtn = document.getElementById('view3dBtn');
        const close3dBtn = document.getElementById('close3dBtn');
        const modelViewerContainer = document.getElementById('modelContainer');

        view3dBtn.addEventListener('click', function() {
            modelViewerContainer.classList.add('active');
            view3dBtn.style.display = 'none';
            
            setTimeout(() => {
                modelViewerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });

        close3dBtn.addEventListener('click', function() {
            modelViewerContainer.classList.remove('active');
            view3dBtn.style.display = 'flex';
            view3dBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

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
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            const container = canvas.parentElement;
            const maxWidth = Math.min(container.clientWidth, 800);
            const scale = maxWidth / 800;
            
            canvas.width = 800;
            canvas.height = 400;
            canvas.style.width = maxWidth + 'px';
            canvas.style.height = (400 * scale) + 'px';
			
            const wallGradient = ctx.createLinearGradient(0, 0, 0, 400);
            wallGradient.addColorStop(0, '#e8e4d9');
            wallGradient.addColorStop(1, '#d4cfc0');
            ctx.fillStyle = wallGradient;
            ctx.fillRect(0, 0, 800, 400);
            
            ctx.fillStyle = '#5a4a3a';
            ctx.fillRect(260, 60, 280, 300);
            ctx.fillStyle = '#4a3a2a';
            ctx.fillRect(275, 75, 250, 270);

            const doorGradient = ctx.createLinearGradient(285, 85, 515, 85);
            doorGradient.addColorStop(0, '#3d2f1f');
            doorGradient.addColorStop(0.15, '#5d4e37');
            doorGradient.addColorStop(0.5, '#6b5645');
            doorGradient.addColorStop(0.85, '#5d4e37');
            doorGradient.addColorStop(1, '#3d2f1f');
            ctx.fillStyle = doorGradient;
            ctx.fillRect(285, 85, 230, 255);
            
            ctx.strokeStyle = '#2d1f0f';
            ctx.lineWidth = 3;
            ctx.strokeRect(305, 105, 190, 100);
            ctx.strokeStyle = '#7d6e57';
            ctx.lineWidth = 1;
            ctx.strokeRect(307, 107, 186, 96);
            ctx.strokeStyle = '#2d1f0f';
            ctx.lineWidth = 3;
            ctx.strokeRect(305, 220, 190, 100);
            ctx.strokeStyle = '#7d6e57';
            ctx.lineWidth = 1;
            ctx.strokeRect(307, 222, 186, 96);
            
            ctx.strokeStyle = 'rgba(45, 31, 15, 0.15)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 12; i++) {
                ctx.beginPath();
                ctx.moveTo(305, 110 + i * 18);
                ctx.quadraticCurveTo(400, 111 + i * 18, 495, 110 + i * 18);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(305, 225 + i * 18);
                ctx.quadraticCurveTo(400, 226 + i * 18, 495, 225 + i * 18);
                ctx.stroke();
            }
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(478, 223, 12, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            
            const plateGradient = ctx.createRadialGradient(477, 218, 0, 477, 218, 10);
            plateGradient.addColorStop(0, '#e0e0e0');
            plateGradient.addColorStop(0.7, '#b0b0b0');
            plateGradient.addColorStop(1, '#808080');
            ctx.fillStyle = plateGradient;
            ctx.beginPath();
            ctx.arc(477, 218, 10, 0, Math.PI * 2);
            ctx.fill();

            const knobGradient = ctx.createRadialGradient(475, 216, 2, 477, 218, 12);
            knobGradient.addColorStop(0, '#ffffff');
            knobGradient.addColorStop(0.3, '#e8e8e8');
            knobGradient.addColorStop(0.6, '#c0c0c0');
            knobGradient.addColorStop(1, '#909090');
            ctx.fillStyle = knobGradient;
            ctx.beginPath();
            ctx.arc(477, 218, 12, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(475, 216, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(473, 214, 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(150, 280, 70, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ff6b00';
            ctx.lineWidth = 4;
            ctx.stroke();
            
            ctx.fillStyle = '#d4af37';
            ctx.beginPath();
            ctx.ellipse(150, 280, 35, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(140, 275, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(155, 285, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(145, 290, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(138, 43, 226, 0.3)';
            ctx.beginPath();
            ctx.arc(150, 280, 60, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#ff6b00';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('ΙΧΝΗ ΛΑΤΕΞ', 150, 365);
            ctx.fillText('(UV ΦΩΤΙΣΜΟΣ)', 150, 380);
            
			ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
			ctx.fillRect(0, 0, canvas.width, 40 * scale);
			ctx.fillStyle = '#ff0000';
			ctx.font = `bold ${14 * scale}px monospace`;
			ctx.textAlign = 'left';
			ctx.fillText('● REC', 10 * scale, 25 * scale);
			ctx.fillStyle = '#fff';
			ctx.fillText('31/10/2025  08:32:40  |  ΓΡΑΦΕΙΟ ΘΥΝΑΤΟΣ - ΠΟΡΤΑ', 80 * scale, 25 * scale);
			ctx.textAlign = 'right';
			ctx.fillText('ΤΕΚ #006', (canvas.width - 10 * scale), 25 * scale);
        }

        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(drawCrimeScene, 250);
        });

        window.onload = function() {
            drawCrimeScene();
        };