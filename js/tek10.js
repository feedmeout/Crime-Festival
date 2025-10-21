window.goBackToCaseFile = function() {
            const teamCode = sessionStorage.getItem('teamCode');
            console.log('🔙 Button clicked! Team:', teamCode);
            
            if (teamCode) {
                window.location.href = `index.html?team=${teamCode}&tab=evidence`;
            } else {
                window.location.href = 'index.html?tab=evidence';
            }
        };

        // 3D Model Loading Control
        const load3DButton = document.getElementById('load3DButton');
        const close3DButton = document.getElementById('close3DButton');
        const modelViewerContainer = document.getElementById('modelViewerContainer');

        load3DButton.addEventListener('click', function() {
            modelViewerContainer.classList.add('active');
            load3DButton.style.display = 'none';
            
            setTimeout(() => {
                modelViewerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });

        close3DButton.addEventListener('click', function() {
            modelViewerContainer.classList.remove('active');
            load3DButton.style.display = 'flex';
            
            load3DButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

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
            floorGradient.addColorStop(0, '#9d8569');
            floorGradient.addColorStop(0.3, '#8b7355');
            floorGradient.addColorStop(0.6, '#6b5345');
            floorGradient.addColorStop(1, '#4a3525');
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

            const vignette = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 150 * scale, canvas.width/2, canvas.height/2, 550 * scale);
            vignette.addColorStop(0, 'rgba(0,0,0,0)');
            vignette.addColorStop(0.7, 'rgba(0,0,0,0.1)');
            vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const keyShadow = ctx.createRadialGradient(400 * scale, 240 * scale, 0, 400 * scale, 240 * scale, 90 * scale);
            keyShadow.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
            keyShadow.addColorStop(0.6, 'rgba(0, 0, 0, 0.2)');
            keyShadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = keyShadow;
            ctx.beginPath();
            ctx.ellipse(400 * scale, 240 * scale, 90 * scale, 20 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            const headOuterGradient = ctx.createRadialGradient(354 * scale, 194 * scale, 5 * scale, 360 * scale, 200 * scale, 28 * scale);
            headOuterGradient.addColorStop(0, '#ffd700');
            headOuterGradient.addColorStop(0.2, '#f4d03f');
            headOuterGradient.addColorStop(0.4, '#daa520');
            headOuterGradient.addColorStop(0.6, '#c9a629');
            headOuterGradient.addColorStop(0.8, '#b8860b');
            headOuterGradient.addColorStop(1, '#8b6914');
            ctx.fillStyle = headOuterGradient;
            ctx.beginPath();
            ctx.arc(360 * scale, 200 * scale, 26 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#5a4010';
            ctx.lineWidth = 2 * scale;
            ctx.stroke();
        
            const mainHighlight = ctx.createRadialGradient(353 * scale, 193 * scale, 0, 353 * scale, 193 * scale, 8 * scale);
            mainHighlight.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            mainHighlight.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
            mainHighlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = mainHighlight;
            ctx.beginPath();
            ctx.arc(353 * scale, 193 * scale, 8 * scale, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(356 * scale, 195 * scale, 3 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#f4d03f';
            ctx.lineWidth = 1.2 * scale;
            ctx.beginPath();
            ctx.arc(360 * scale, 200 * scale, 24 * scale, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(218, 165, 32, 0.6)';
            ctx.lineWidth = 0.8 * scale;
            ctx.beginPath();
            ctx.arc(360 * scale, 200 * scale, 20 * scale, 0, Math.PI * 2);
            ctx.stroke();
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(360 * scale, 200 * scale, 16 * scale, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            ctx.strokeStyle = '#3d2415';
            ctx.lineWidth = 2.5 * scale;
            ctx.beginPath();
            ctx.arc(360 * scale, 200 * scale, 16 * scale, 0, Math.PI * 2);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(100, 80, 40, 0.5)';
            ctx.lineWidth = 1.5 * scale;
            ctx.beginPath();
            ctx.arc(360 * scale, 200 * scale, 16.5 * scale, Math.PI * 1.2, Math.PI * 1.8);
            ctx.stroke();
            
            const shaftGradient = ctx.createLinearGradient(380 * scale, 184 * scale, 380 * scale, 216 * scale);
            shaftGradient.addColorStop(0, '#8b6914');
            shaftGradient.addColorStop(0.1, '#a67c1b');
            shaftGradient.addColorStop(0.25, '#daa520');
            shaftGradient.addColorStop(0.4, '#e8b840');
            shaftGradient.addColorStop(0.5, '#c9a629');
            shaftGradient.addColorStop(0.6, '#daa520');
            shaftGradient.addColorStop(0.75, '#b8860b');
            shaftGradient.addColorStop(0.9, '#9d7518');
            shaftGradient.addColorStop(1, '#7a5d12');
            ctx.fillStyle = shaftGradient;
            ctx.fillRect(386 * scale, 186 * scale, 100 * scale, 28 * scale);
            ctx.strokeStyle = '#5a4010';
            ctx.lineWidth = 2.5 * scale;
            ctx.strokeRect(386 * scale, 186 * scale, 100 * scale, 28 * scale);

            const topHighlight = ctx.createLinearGradient(386 * scale, 188 * scale, 386 * scale, 193 * scale);
            topHighlight.addColorStop(0, 'rgba(255, 245, 200, 0.8)');
            topHighlight.addColorStop(1, 'rgba(255, 245, 200, 0)');
            ctx.fillStyle = topHighlight;
            ctx.fillRect(388 * scale, 188 * scale, 96 * scale, 5 * scale);

            ctx.fillStyle = 'rgba(255, 235, 150, 0.5)';
            ctx.fillRect(388 * scale, 191 * scale, 96 * scale, 2 * scale);

            const bottomShadow = ctx.createLinearGradient(386 * scale, 207 * scale, 386 * scale, 212 * scale);
            bottomShadow.addColorStop(0, 'rgba(60, 45, 15, 0)');
            bottomShadow.addColorStop(1, 'rgba(60, 45, 15, 0.6)');
            ctx.fillStyle = bottomShadow;
            ctx.fillRect(388 * scale, 207 * scale, 96 * scale, 5 * scale);

            const teeth = [
                {x: 486, y: 189, h: 7, w: 3.5},
                {x: 490.5, y: 187, h: 10, w: 3.5},
                {x: 495, y: 185, h: 13, w: 3.5},
                {x: 499.5, y: 182, h: 17, w: 3.5},
                {x: 504, y: 179, h: 21, w: 3.5},
                {x: 508.5, y: 181, h: 18, w: 3.5},
                {x: 513, y: 184, h: 15, w: 3.5},
                {x: 517.5, y: 186, h: 12, w: 3.5},
                {x: 522, y: 188, h: 9, w: 3.5},
                {x: 526.5, y: 190, h: 6, w: 3.5}
            ];
            
            teeth.forEach((tooth, index) => {
                const grooveGradient = ctx.createLinearGradient(tooth.x * scale, tooth.y * scale, (tooth.x + tooth.w) * scale, tooth.y * scale);
                grooveGradient.addColorStop(0, '#0d0a08');
                grooveGradient.addColorStop(0.3, '#1a1410');
                grooveGradient.addColorStop(0.7, '#2c1810');
                grooveGradient.addColorStop(1, '#3d2415');
                
                ctx.fillStyle = grooveGradient;
                ctx.fillRect(tooth.x * scale, tooth.y * scale, tooth.w * scale, tooth.h * scale);

                ctx.fillStyle = 'rgba(220, 180, 100, 0.6)';
                ctx.fillRect(tooth.x * scale, tooth.y * scale, 0.7 * scale, tooth.h * scale);

                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect((tooth.x + tooth.w - 0.7) * scale, tooth.y * scale, 0.7 * scale, tooth.h * scale);

                const bottomDarkness = index >= 3 && index <= 6 ? 0.7 : 0.5;
                ctx.fillStyle = `rgba(0, 0, 0, ${bottomDarkness})`;
                ctx.fillRect(tooth.x * scale, (tooth.y + tooth.h - 1) * scale, tooth.w * scale, 1.5 * scale);

                if (tooth.h > 12) {
                    ctx.fillStyle = 'rgba(180, 140, 70, 0.3)';
                    ctx.fillRect((tooth.x + 0.5) * scale, tooth.y * scale, (tooth.w - 1) * scale, 0.8 * scale);
                }
            });

            ctx.beginPath();
            ctx.moveTo(486 * scale, 186 * scale);
            ctx.lineTo(531 * scale, 186 * scale);
            ctx.lineTo(540 * scale, 200 * scale);
            ctx.lineTo(531 * scale, 214 * scale);
            ctx.lineTo(486 * scale, 214 * scale);
            ctx.closePath();
            
            const tipGradient = ctx.createLinearGradient(486 * scale, 186 * scale, 486 * scale, 214 * scale);
            tipGradient.addColorStop(0, '#8b6914');
            tipGradient.addColorStop(0.15, '#a67c1b');
            tipGradient.addColorStop(0.3, '#daa520');
            tipGradient.addColorStop(0.5, '#e8b840');
            tipGradient.addColorStop(0.7, '#c9a629');
            tipGradient.addColorStop(0.85, '#b8860b');
            tipGradient.addColorStop(1, '#8b6914');
            ctx.fillStyle = tipGradient;
            ctx.fill();
            ctx.strokeStyle = '#5a4010';
            ctx.lineWidth = 2.5 * scale;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(488 * scale, 188 * scale);
            ctx.lineTo(529 * scale, 188 * scale);
            ctx.lineTo(536 * scale, 200 * scale);
            ctx.lineTo(529 * scale, 193 * scale);
            ctx.lineTo(488 * scale, 193 * scale);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 245, 200, 0.6)';
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(531 * scale, 188 * scale);
            ctx.lineTo(540 * scale, 200 * scale);
            ctx.lineTo(537 * scale, 200 * scale);
            ctx.lineTo(531 * scale, 192 * scale);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(488 * scale, 207 * scale);
            ctx.lineTo(529 * scale, 207 * scale);
            ctx.lineTo(536 * scale, 200 * scale);
            ctx.lineTo(529 * scale, 212 * scale);
            ctx.lineTo(488 * scale, 212 * scale);
            ctx.closePath();
            ctx.fillStyle = 'rgba(60, 45, 15, 0.4)';
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            for (let i = 0; i < 30; i++) {
                const x = (375 + i * 5 + (Math.random() * 5 - 2.5)) * scale;
                const y = (195 + (Math.random() * 12 - 6)) * scale;
                const size = (1.2 + Math.random() * 1.2) * scale;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = 'rgba(245, 245, 255, 0.5)';
            for (let i = 0; i < 18; i++) {
                const angle = (Math.PI * 2 / 18) * i;
                const distance = (30 + Math.random() * 10) * scale;
                const x = 360 * scale + Math.cos(angle) * distance;
                const y = 200 * scale + Math.sin(angle) * distance;
                ctx.beginPath();
                ctx.arc(x, y, (0.8 + Math.random() * 0.8) * scale, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let i = 0; i < 20; i++) {
                const x = (340 + Math.random() * 210) * scale;
                const y = (170 + Math.random() * 60) * scale;
                ctx.beginPath();
                ctx.arc(x, y, 0.5 * scale, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(570 * scale, 350 * scale, 110 * scale, 2 * scale); 
            ctx.fillRect(570 * scale, 345 * scale, 2 * scale, 12 * scale);
            ctx.fillRect(678 * scale, 345 * scale, 2 * scale, 12 * scale);
            
            for (let i = 1; i < 5; i++) {
                const x = (570 + (i * 22)) * scale;
                ctx.fillRect(x, 347 * scale, 1 * scale, 8 * scale);
            }
            
            ctx.font = `bold ${11 * scale}px monospace`;
            ctx.textAlign = 'center';
            ctx.fillText('5.2 cm', 624 * scale, 372 * scale);

            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(0, 0, canvas.width, 40 * scale);
            ctx.fillStyle = '#ff0000';
            ctx.font = `bold ${14 * scale}px monospace`;
            ctx.textAlign = 'left';
            ctx.fillText('● REC', 10 * scale, 25 * scale);
            ctx.fillStyle = '#ffffff';
            ctx.fillText('31/10/2025  09:29:15  |  ΣΚΗΝΗ ΕΓΚΛΗΜΑΤΟΣ - ΓΡΑΦΕΙΟ ΘΥΜΑΤΟΣ', 80 * scale, 25 * scale);
            ctx.textAlign = 'right';
            ctx.fillText('ΤΕΚ #010', (canvas.width - 10 * scale), 25 * scale);
        }

        function handleResize() {
            drawCrimeScene();
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        window.onload = function() {
            drawCrimeScene();
        };