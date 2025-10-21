window.goBackToCaseFile = function() {
            const teamCode = sessionStorage.getItem('teamCode');
            console.log('🔙 Button clicked! Team:', teamCode);
            
            if (teamCode) {
                window.location.href = `../index.html?team=${teamCode}&tab=evidence`;
            } else {
                window.location.href = '../../index.html?tab=evidence';
            }
        };

        const view3DBtn = document.getElementById('view3DBtn');
        const close3DBtn = document.getElementById('close3DBtn');
        const modelViewerContainer = document.getElementById('modelViewerContainer');
        const modelViewer = document.getElementById('bottleModel');
        const debugInfo = document.getElementById('debugInfo');

        view3DBtn.addEventListener('click', function() {
            console.log('Button clicked, showing container...');
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

        if (modelViewer) {
            modelViewer.addEventListener('progress', (event) => {
                const percent = Math.round(event.detail.totalProgress * 100);
                console.log('Loading progress:', percent + '%');
                debugInfo.style.display = 'block';
                debugInfo.innerHTML = `⏳ Φόρτωση: ${percent}%<br>`;
            });

            modelViewer.addEventListener('load', () => {
                console.log('✅ Model loaded successfully!');
                console.log('Model viewer dimensions:', modelViewer.getBoundingClientRect());
                debugInfo.innerHTML = '✅ 3D μοντέλο φορτώθηκε επιτυχώς!<br>';
                debugInfo.style.background = '#d4edda';
                debugInfo.style.borderColor = '#28a745';
                
                setTimeout(() => {
                    debugInfo.style.display = 'none';
                }, 2000);
            });
            
            modelViewer.addEventListener('error', (event) => {
                console.error('❌ Model loading error:', event);
                debugInfo.style.display = 'block';
                debugInfo.innerHTML = '❌ ΣΦΑΛΜΑ: Το αρχείο δεν μπορεί να φορτώσει<br>';
                debugInfo.innerHTML += 'Ελέγξτε:<br>';
                debugInfo.innerHTML += '1. Το αρχείο υπάρχει στον ίδιο φάκελο<br>';
                debugInfo.innerHTML += '2. Το όνομα είναι σωστό (με κεφαλαία/πεζά)<br>';
                debugInfo.innerHTML += '3. Το αρχείο είναι έγκυρο .glb<br>';
                debugInfo.style.background = '#f8d7da';
                debugInfo.style.borderColor = '#dc3545';
            });
        }

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

            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.beginPath();
            ctx.ellipse(canvas.width/2, 320 * scale, 35 * scale, 15 * scale, 0, 0, Math.PI * 2);
            ctx.fill();

            const bottleGradient = ctx.createLinearGradient(360 * scale, 150 * scale, 440 * scale, 150 * scale);
            bottleGradient.addColorStop(0, '#1a1a1a');
            bottleGradient.addColorStop(0.5, '#2d2d2d');
            bottleGradient.addColorStop(1, '#1a1a1a');

            ctx.fillStyle = bottleGradient;
            ctx.fillRect(365 * scale, 180 * scale, 70 * scale, 140 * scale);
            ctx.fillRect(385 * scale, 140 * scale, 30 * scale, 40 * scale);
            
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(382 * scale, 130 * scale, 36 * scale, 10 * scale);
            ctx.fillRect(385 * scale, 125 * scale, 30 * scale, 5 * scale);
            
            ctx.fillStyle = '#d4af37';
            ctx.fillRect(370 * scale, 220 * scale, 60 * scale, 60 * scale);

            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2 * scale;
            ctx.strokeRect(370 * scale, 220 * scale, 60 * scale, 60 * scale);

            ctx.fillStyle = '#000';
            ctx.font = `bold ${24 * scale}px serif`;
            ctx.textAlign = 'center';
            ctx.fillText('JD', 400 * scale, 255 * scale);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(375 * scale, 185 * scale, 8 * scale, 80 * scale);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, 40 * scale);

            ctx.fillStyle = '#ff0000';
            ctx.font = `bold ${14 * scale}px monospace`;
            ctx.textAlign = 'left';
            ctx.fillText('● REC', 10 * scale, 25 * scale);

            ctx.fillStyle = '#fff';
            ctx.fillText('31/10/2025  07:15:20  |  ΣΚΗΝΗ ΕΓΚΛΗΜΑΤΟΣ - ΓΡΑΦΕΙΟ ΘΥΜΑΤΟΣ', 80 * scale, 25 * scale);

            ctx.textAlign = 'right';
            ctx.fillText('ΤΕΚ #001', (canvas.width - 10 * scale), 25 * scale);
        }

        function handleResize() {
            drawCrimeScene();
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        window.onload = function() {
            drawCrimeScene();
        };