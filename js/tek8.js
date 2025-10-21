window.goBackToCaseFile = function() {
            const teamCode = sessionStorage.getItem('teamCode');
            console.log('🔙 Button clicked! Team:', teamCode);
            
            if (teamCode) {
                window.location.href = `../index.html?team=${teamCode}&tab=evidence`;
            } else {
                window.location.href = '../index.html?tab=evidence';
            }
        };

        // 3D Viewer toggle functionality
        const view3DButton = document.getElementById('view3DButton');
        const close3DButton = document.getElementById('close3DButton');
        const modelViewerContainer = document.getElementById('modelViewerContainer');
        const modelViewer = document.getElementById('mainModelViewer');

        view3DButton.addEventListener('click', function() {
            console.log('🎯 View 3D button clicked!');
            modelViewerContainer.classList.add('active');
            view3DButton.style.display = 'none';
            
            // Scroll to the 3D viewer
            modelViewerContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        close3DButton.addEventListener('click', function() {
            console.log('❌ Close 3D button clicked!');
            modelViewerContainer.classList.remove('active');
            view3DButton.style.display = 'flex';
            
            // Scroll back to the button
            view3DButton.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        function drawCrimeScene() {
            const canvas = document.getElementById('crimeSceneCanvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = 800;
            canvas.height = 400;

            const floorGradient = ctx.createLinearGradient(0, 0, 0, 400);
            floorGradient.addColorStop(0, '#8b7355');
            floorGradient.addColorStop(1, '#6b5345');
            ctx.fillStyle = floorGradient;
            ctx.fillRect(0, 0, 800, 400);
			
			ctx.strokeStyle = 'rgba(101, 67, 33, 0.3)';
			ctx.lineWidth = 2;
			for (let i = 0; i < 400; i += 40) {
				ctx.beginPath();
				ctx.moveTo(0, i);
				ctx.lineTo(800, i);
				ctx.stroke();
			}

            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.ellipse(400, 345, 200, 25, 0, 0, Math.PI * 2);
            ctx.fill();

            const folderGradient = ctx.createLinearGradient(200, 140, 200, 340);
            folderGradient.addColorStop(0, '#d4a574');
            folderGradient.addColorStop(0.5, '#c49563');
            folderGradient.addColorStop(1, '#b58552');
            ctx.fillStyle = folderGradient;
            ctx.fillRect(200, 140, 400, 200);
            ctx.fillStyle = '#c49563';
            ctx.beginPath();
            ctx.moveTo(200, 140);
            ctx.lineTo(250, 100);
            ctx.lineTo(550, 100);
            ctx.lineTo(600, 140);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(200, 140, 400, 15);
            ctx.strokeStyle = 'rgba(101, 67, 33, 0.6)';
            ctx.lineWidth = 3;
            ctx.strokeRect(200, 140, 400, 200);
            ctx.strokeStyle = 'rgba(101, 67, 33, 0.15)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 10; i++) {
                ctx.beginPath();
                ctx.moveTo(200, 160 + i * 18);
                ctx.lineTo(600, 160 + i * 18);
                ctx.stroke();
            }
            ctx.save();
            ctx.translate(400, 240);
            ctx.rotate(-0.12);
            ctx.fillStyle = 'rgba(196, 30, 58, 0.1)';
            ctx.fillRect(-155, -55, 310, 110);
            ctx.strokeStyle = '#c41e3a';
            ctx.lineWidth = 10;
            ctx.strokeRect(-150, -50, 300, 100);
            ctx.lineWidth = 3;
            ctx.strokeRect(-140, -40, 280, 80);
            ctx.font = 'bold 38px Arial';
            ctx.fillStyle = '#c41e3a';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('ΕΜΠΙΣΤΕΥΤΙΚΟ', 0, 0);
            ctx.restore();
            ctx.fillStyle = 'rgba(101, 67, 33, 0.3)';
            ctx.beginPath();
            ctx.moveTo(200, 140);
            ctx.lineTo(220, 140);
            ctx.lineTo(200, 160);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(600, 340);
            ctx.lineTo(580, 340);
            ctx.lineTo(600, 320);
            ctx.closePath();
            ctx.fill();
			
			ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
			ctx.fillRect(0, 0, 800, 40);
			ctx.fillStyle = '#ff0000';
			ctx.font = 'bold 14px monospace';
			ctx.textAlign = 'left';
			ctx.fillText('● REC', 10, 25);
			ctx.fillStyle = '#fff';
			ctx.fillText('31/10/2025  09:03:20  |  ΣΚΗΝΗ ΕΓΚΛΗΜΑΤΟΣ - ΓΡΑΦΕΙΟ ΘΥΜΑΤΟΣ', 80, 25);
			ctx.textAlign = 'right';
			ctx.fillText('ΤΕΚ #008', 790, 25);
        }

        window.onload = function() {
            drawCrimeScene();
        };

        window.addEventListener('resize', function() {
            drawCrimeScene();
        });