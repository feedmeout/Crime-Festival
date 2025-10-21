window.goBackToCaseFile = function() {
            const teamCode = sessionStorage.getItem('teamCode');
            console.log('🔙 Button clicked! Team:', teamCode);
            
            if (teamCode) {
                window.location.href = `../index.html?team=${teamCode}&tab=evidence`;
            } else {
                window.location.href = '../index.html?tab=evidence';
            }
        };

        const load3DBtn = document.getElementById('load3DBtn');
        const close3DBtn = document.getElementById('close3DBtn');
        const modelViewerContainer = document.getElementById('modelViewerContainer');

        load3DBtn.addEventListener('click', function() {
            modelViewerContainer.classList.add('active');
            load3DBtn.style.display = 'none';
            
            setTimeout(() => {
                modelViewerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });

        close3DBtn.addEventListener('click', function() {
            modelViewerContainer.classList.remove('active');
            load3DBtn.style.display = 'flex';
            load3DBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        function drawCrimeScene() {
            const canvas = document.getElementById('crimeSceneCanvas');
            const ctx = canvas.getContext('2d');
            const container = canvas.parentElement;
            const containerWidth = container.offsetWidth;
            const maxWidth = Math.min(containerWidth, 800);
            const dpr = window.devicePixelRatio || 1;
            canvas.width = maxWidth * dpr;
            canvas.height = maxWidth * 0.5 * dpr;
            canvas.style.width = maxWidth + 'px';
            canvas.style.height = (maxWidth * 0.5) + 'px';
            ctx.scale(dpr, dpr);
            
            const scale = maxWidth / 800;
            
            const bgGradient = ctx.createLinearGradient(0, 0, 0, maxWidth * 0.5);
            bgGradient.addColorStop(0, '#1a1a2e');
            bgGradient.addColorStop(1, '#0f0f1e');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, maxWidth, maxWidth * 0.5);
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1 * scale;
            for (let i = 0; i < maxWidth; i += (100 * scale)) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, maxWidth * 0.5);
                ctx.stroke();
            }

            for (let i = 0; i < 3; i++) {
                const x = (150 + i * 200) * scale;
                const y = 120 * scale;
                ctx.fillStyle = '#2d2d3d';
                ctx.fillRect(x, y, 160 * scale, 120 * scale);
                ctx.fillStyle = '#000';
                ctx.fillRect(x + (10 * scale), y + (10 * scale), 140 * scale, 90 * scale);
                for (let j = 0; j < 50; j++) {
                    ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`;
                    ctx.fillRect(
                        x + (10 * scale) + Math.random() * (140 * scale),
                        y + (10 * scale) + Math.random() * (90 * scale),
                        2 * scale, 
                        2 * scale
                    );
                }

                ctx.fillStyle = '#ff3333';
                ctx.font = `bold ${12 * scale}px monospace`;
                ctx.textAlign = 'center';
                ctx.fillText('NO SIGNAL', x + (80 * scale), y + (60 * scale));
                ctx.fillStyle = '#2d2d3d';
                ctx.fillRect(x + (65 * scale), y + (120 * scale), 30 * scale, 40 * scale);
                ctx.fillRect(x + (50 * scale), y + (160 * scale), 60 * scale, 10 * scale);
                ctx.fillStyle = '#ffaa00';
                ctx.font = `bold ${10 * scale}px monospace`;
                ctx.fillText(`CAM #${i === 0 ? '03' : i === 1 ? '07' : '12'}`, x + (80 * scale), y + (115 * scale));
            }

            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, maxWidth, 40 * scale);
            ctx.fillStyle = '#ff0000';
            ctx.font = `bold ${14 * scale}px monospace`;
            ctx.textAlign = 'left';
            ctx.fillText('● REC', 10 * scale, 25 * scale);
            ctx.fillStyle = '#fff';
            ctx.fillText('31/10/2025  09:42:50  |  ΣΚΗΝΗ ΕΓΚΛΗΜΑΤΟΣ - ΔΩΜΑΤΙΟ ΑΣΦΑΛΕΙΑΣ', 80 * scale, 25 * scale);
            ctx.textAlign = 'right';
            ctx.fillText('ΤΕΚ #011', (maxWidth - 10 * scale), 25 * scale);
        }

        window.onload = function() {
            drawCrimeScene();
            window.addEventListener('resize', drawCrimeScene);
        };