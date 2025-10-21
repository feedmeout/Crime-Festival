window.goBackToCaseFile = function() {
            const teamCode = sessionStorage.getItem('teamCode');
            console.log('🔙 Button clicked! Team:', teamCode);
            
            if (teamCode) {
                window.location.href = `index.html?team=${teamCode}&tab=evidence`;
            } else {
                window.location.href = 'index.html?tab=evidence';
            }
        };

        function drawCrimeScene() {
            const canvas = document.getElementById('crimeSceneCanvas');
            const ctx = canvas.getContext('2d');
            const displayWidth = canvas.clientWidth;
            const displayHeight = displayWidth * 0.5;
            
            canvas.width = displayWidth * window.devicePixelRatio;
            canvas.height = displayHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            canvas.style.width = displayWidth + 'px';
            canvas.style.height = displayHeight + 'px';
            
            const scale = displayWidth / 800;
            const deskGradient = ctx.createLinearGradient(0, 0, 0, displayHeight);
            deskGradient.addColorStop(0, '#2d2d2d');
            deskGradient.addColorStop(1, '#1a1a1a');
            ctx.fillStyle = deskGradient;
            ctx.fillRect(0, 0, displayWidth, displayHeight);
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(150 * scale, 80 * scale, 500 * scale, 300 * scale);
            
            const screenGradient = ctx.createRadialGradient(
                400 * scale, 230 * scale, 50 * scale,
                400 * scale, 230 * scale, 250 * scale
            );
            screenGradient.addColorStop(0, '#4a90e2');
            screenGradient.addColorStop(1, '#2c5f8d');
            ctx.fillStyle = screenGradient;
            ctx.fillRect(170 * scale, 100 * scale, 460 * scale, 260 * scale);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(190 * scale, 120 * scale, 420 * scale, 35 * scale);
            ctx.fillStyle = '#000';
            ctx.font = `bold ${14 * scale}px Arial`;
            ctx.fillText('Οικογένεια, Προσωπικό, Φίλοι', 200 * scale, 143 * scale);
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillRect(190 * scale, 165 * scale, 420 * scale, 2 * scale);
            ctx.fillRect(190 * scale, 185 * scale, 420 * scale, 2 * scale);
            ctx.fillRect(190 * scale, 205 * scale, 420 * scale, 2 * scale);
            
            for(let i = 0; i < 6; i++) {
                ctx.fillRect(190 * scale, (225 + i*18) * scale, 420 * scale, 2 * scale);
            }
            
            ctx.fillStyle = '#ff6b00';
            ctx.fillRect(520 * scale, 330 * scale, 85 * scale, 25 * scale);
            ctx.fillStyle = '#fff';
            ctx.font = `bold ${13 * scale}px Arial`;
            ctx.fillText('ΚΛΕΙΣΙΜΟ', 532 * scale, 347 * scale);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, displayWidth, 40 * scale);
            ctx.fillStyle = '#ff0000';
            ctx.font = `bold ${14 * scale}px monospace`;
            ctx.textAlign = 'left';
            ctx.fillText('● REC', 10 * scale, 25 * scale);
            ctx.fillStyle = '#fff';
            ctx.fillText('23/09/2025  10:42:00  |  ΨΗΦΙΑΚΗ ΚΑΤΑΓΡΑΦΗ - ΑΙΘΟΥΣΑ ΣΥΣΚΕΨΕΩΝ', 80 * scale, 25 * scale);
            ctx.textAlign = 'right';
            ctx.fillText('ΤΕΚ #004', (displayWidth - 10) * scale, 25 * scale);
        }

        window.onload = function() {
            drawCrimeScene();
        };

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                drawCrimeScene();
            }, 250);
        });