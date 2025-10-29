const SuspectsModule = {
  suspects: [
    {
      id: 'maria',
      canvasId: 'maria-portrait',
      name: 'ΠΑΠΑΔΟΠΟΥΛΟΥ ΜΑΡΙΑ του ΝΙΚΟΛΑΟΥ',
      role: 'Προσωπική Γραμματέας (8 έτη)',
      alibi: 'Έφυγε 18:00 για ραντεβού με γιατρό (Δρ. Κωστόπουλος, 18:30-19:30 επιβεβαιωμένο). Δείπνο με αδελφή στο «Ελληνικόν» 500μ από κτίριο (19:45-22:00, επιβεβαιωμένο από εστιατόριο)',
      motive: 'Ο Δημητρίου της χρωστούσε 3 μισθούς.',
	  notes: 'Σκεφτόταν να παραιτηθεί αλλά δεν ήθελε να αφήσει τον προϊστάμενό της λόγω των προβλημάτων υγείας του. Μοναδικό άτομο με πρόσβαση σε όλους τους κωδικούς και κλειδιά.',
	  relationship: '«Πατρική φιγούρα» - έκλαιγε στην ανάκριση. Γνώριζε για τον καρκίνο - έκλεινε ραντεβού με ογκολόγους για λογαριασμό του',
      other: 'Συνταγή για αλπραζολάμη (άγχος) - φυλάσσει φάρμακα στο συρτάρι γραφείου 7ου ορόφου'
    },
    {
      id: 'konstantinos',
      canvasId: 'konstantinos-portrait',
      name: 'ΑΝΑΓΝΩΣΤΟΥ ΚΩΝΣΤΑΝΤΙΝΟΣ του ΣΠΥΡΟΥ',
      role: 'Συνεταίρος (40% μετοχές), CFO εταιρείας',
	  alibi: 'Δείπνο με πελάτες 18:45-20:30 στο «Διόνυσος» (200μ από κτίριο), επέστρεψε 20:49 για ολοκλήρωση εργασιών',
	  motive: 'Φάκελος αποκαλύπτει οικονομικές ανωμαλίες',
	  notes: 'Προσπάθησε να αγοράσει μετοχές του Δημητρίου πριν 1 μήνα. Αποτυπώματά του στο μπουκάλι (λαιμός) και το κλειδί χρηματοκιβωτίου',
      financial: 'Απόκρυψη εσόδων €500.000 σε Ελβετία',
      other: 'Πρόσβαση σε όλους τους ορόφους. Γνωρίζει συνδυασμούς χρηματοκιβωτίων'
    },
    {
      id: 'eleni',
      canvasId: 'eleni-portrait',
      name: 'ΜΑΥΡΙΔΗ ΕΛΕΝΗ του ΜΙΧΑΗΛ',
      role: 'Συγγραφέας, Πρώην ερωμένη',
      alibi: 'Παρουσίαση βιβλίου 19:30-20:30. Επέστρεψε 20:40 για να αφήσει αντίτυπα',
	  motive: 'Ερωτικές φωτογραφίες στον φάκελο - απειλή δημοσιοποίησης και εκβιασμός €100.000. Θα κατέστρεφε την καριέρα και τον γάμο του',
	  notes: 'Αναφέρει ότι συναντήθηκε σύντομα με τον Δημητρίου για να συζητήσουν εκδοτικά θέματα. Τεχνικές γνώσεις πληροφορικής.',
      relationship: 'Διήρκεσε 2 χρόνια, τερματίστηκε άσχημα πριν 6 μήνες',
      other: 'Το βιβλίο της αφιερωμένο «Σε αυτόν που με πρόδωσε». Παράτησε την φαρμακευτική μετά το 2ο έτος'
    },
    {
      id: 'georgios',
      canvasId: 'georgios-portrait',
      name: 'ΠΕΤΡΟΠΟΥΛΟΣ ΓΕΩΡΓΙΟΣ του ΑΝΤΩΝΙΟΥ',
      role: 'Νυχτοφύλακας (προϊστάμενος βάρδιας)',
      alibi: 'Περιπολία κάθε 2 ώρες - καταγραφή αρχείου σε όλα τα σημεία ελέγχου',
      motive: 'Χρέη €60.000 σε τοκογλύφους. Αγόρασε το κυάνιο για «μυοκτονία»',
	  notes: 'Έλεγχος βάρδιας: Σάρωσε κάρτα στον 7ο όροφο 20:22 (ψηφιακό log). Μάρτυρας (καθαρίστρια) τον είδε στον 3ο όροφο περίπου στις 20.50. Το τυπικό μοτίβο περιπολίας είναι: 7ος → Ισόγειο (διάρκεια κύκλου: 30-40 λεπτά). Η παρουσία του στον 3ο όροφο στις 20.50 συνάδει με τη ρουτίνα του.',
      history: 'Απολύθηκε για κλοπή από χημικό εργοστάσιο (αθωώθηκε - έλλειψη αποδείξεων)',
      other: 'Πρόσβαση σε όλους τους ορόφους. Δικαιώματα διαχειριστή στο σύστημα ασφαλείας'
    },
    {
      id: 'alexandra',
      canvasId: 'alexandra-portrait',
      name: 'ΝΙΚΟΛΑΟΥ ΑΛΕΞΑΝΔΡΑ του ΓΕΩΡΓΙΟΥ',
      role: 'Προϊσταμένη Λογιστηρίου (3 μήνες)',
      alibi: 'Στο κτίριο από 09:00. Έφυγε 18:30 (κάμερες). Ισχυρίζεται πως ήταν στο «Μικρό Καφέ» (150m από κτίριο) μέχρι της 20.30. Στη πορεία επέστρεψε σπίτι της. Πλήρωσε με μετρητά, δεν κράτησε την απόδειξη πληρωμής',
	  motive: 'Έκλεβε χειρόγραφα συγγραφέων για ανταγωνιστικό εκδοτικό οίκο - ο Δημητρίου την ανακάλυψε και την απείλησε με απόλυση',
	  notes: 'Ζήτησε άδεια για 24/09 πριν 1 εβδομάδα. Συγγενής με γιατρό - θεωρητική πρόσβαση σε φάρμακα.',
      education: 'Οικονομικά (πτυχίο), Σεμινάριο πρώτων βοηθειών',
      other: 'Πρόσβαση σε εταιρική πιστωτική για αγορές. Συχνά έμενε αργά στο γραφείο για «απογραφές»'
    }
  ],

  drawMaria(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 75;
    canvas.height = 94;
    
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 94);
    bgGradient.addColorStop(0, '#f8f0e8');
    bgGradient.addColorStop(1, '#e8d8c8');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 75, 94);
    
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 2.7;
    
    const hairGradient = ctx.createLinearGradient(19, 10, 19, 56);
    hairGradient.addColorStop(0, '#3d2817');
    hairGradient.addColorStop(0.5, '#4a3426');
    hairGradient.addColorStop(1, '#2d1810');
    
    ctx.fillStyle = hairGradient;
    ctx.beginPath();
    ctx.moveTo(14, 33);
    ctx.quadraticCurveTo(10, 19, 23, 12);
    ctx.quadraticCurveTo(37, 8, 52, 12);
    ctx.quadraticCurveTo(65, 19, 61, 33);
    ctx.quadraticCurveTo(64, 47, 58, 54);
    ctx.lineTo(54, 42);
    ctx.quadraticCurveTo(51, 28, 37, 26);
    ctx.quadraticCurveTo(24, 28, 21, 42);
    ctx.lineTo(17, 54);
    ctx.quadraticCurveTo(11, 47, 14, 33);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#e8c8b5';
    ctx.beginPath();
    ctx.ellipse(21, 39, 3.7, 5.8, -0.2, 0, Math.PI * 2);
    ctx.ellipse(54, 39, 3.7, 5.8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    const skinGradient = ctx.createRadialGradient(37, 37, 9.5, 37, 37, 23);
    skinGradient.addColorStop(0, '#f5d5c5');
    skinGradient.addColorStop(1, '#e8c8b5');
    
    ctx.fillStyle = skinGradient;
    ctx.beginPath();
    ctx.moveTo(37, 21);
    ctx.quadraticCurveTo(52, 24, 50, 39);
    ctx.quadraticCurveTo(49, 50, 37, 54);
    ctx.quadraticCurveTo(26, 50, 24, 39);
    ctx.quadraticCurveTo(22, 24, 37, 21);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(200, 150, 130, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    ctx.fillStyle = '#fafafa';
    ctx.beginPath();
    ctx.ellipse(30, 33, 4.7, 3.7, -0.1, 0, Math.PI * 2);
    ctx.ellipse(45, 33, 4.7, 3.7, 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    const irisGradient = ctx.createRadialGradient(30, 33, 1, 30, 33, 3);
    irisGradient.addColorStop(0, '#2c5f2d');
    irisGradient.addColorStop(1, '#4a7c59');
    
    ctx.fillStyle = irisGradient;
    ctx.beginPath();
    ctx.ellipse(30, 33, 2.8, 3.2, -0.1, 0, Math.PI * 2);
    ctx.ellipse(45, 33, 2.8, 3.2, 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(30, 33, 1.1, 1.4, 0, 0, Math.PI * 2);
    ctx.ellipse(45, 33, 1.1, 1.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(29, 32, 0.7, 0, Math.PI * 2);
    ctx.arc(44, 32, 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#2a1810';
    ctx.lineWidth = 0.5;
    for(let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(26 + i*1.9, 33);
      ctx.lineTo(25 + i*1.9, 31);
      ctx.moveTo(40 + i*1.9, 33);
      ctx.lineTo(39 + i*1.9, 31);
      ctx.stroke();
    }
    
    ctx.strokeStyle = '#3a2416';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(25, 27);
    ctx.quadraticCurveTo(30, 25, 34, 27);
    ctx.moveTo(40, 27);
    ctx.quadraticCurveTo(45, 25, 50, 27);
    ctx.stroke();
    
    ctx.strokeStyle = '#d4a590';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(37, 34);
    ctx.quadraticCurveTo(35, 39, 35, 41);
    ctx.moveTo(37, 34);
    ctx.quadraticCurveTo(39, 39, 39, 41);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(150, 100, 80, 0.3)';
    ctx.beginPath();
    ctx.ellipse(35, 42, 1.4, 0.9, 0, 0, Math.PI);
    ctx.ellipse(39, 42, 1.4, 0.9, 0, 0, Math.PI);
    ctx.fill();
    
    const lipGradient = ctx.createLinearGradient(33, 48, 42, 48);
    lipGradient.addColorStop(0, '#d08080');
    lipGradient.addColorStop(0.5, '#cc6666');
    lipGradient.addColorStop(1, '#d08080');
    
    ctx.fillStyle = lipGradient;
    ctx.beginPath();
    ctx.moveTo(33, 48);
    ctx.quadraticCurveTo(37, 46, 42, 48);
    ctx.quadraticCurveTo(40, 50, 37, 49);
    ctx.quadraticCurveTo(35, 50, 33, 48);
    ctx.fill();
    
    ctx.fillStyle = '#f8f8f0';
    ctx.beginPath();
    ctx.arc(21, 42, 2.3, 0, Math.PI * 2);
    ctx.arc(54, 42, 2.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#d4d4d4';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(21, 42, 2.3, 0, Math.PI * 2);
    ctx.arc(54, 42, 2.3, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(20, 41, 0.8, 0, Math.PI * 2);
    ctx.arc(53, 41, 0.8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(23, 64, 28, 30);
    ctx.strokeStyle = '#e0e0e0';
    ctx.strokeRect(23, 64, 28, 30);

    ctx.beginPath();
    ctx.moveTo(23, 64);
    ctx.lineTo(33, 70);
    ctx.lineTo(37, 65);
    ctx.lineTo(42, 70);
    ctx.lineTo(51, 64);
    ctx.stroke();
  },

  drawKonstantinos(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 75;
    canvas.height = 94;
    
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 94);
    bgGradient.addColorStop(0, '#f0e8e0');
    bgGradient.addColorStop(1, '#d8c8b8');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 75, 94);
    
    const hairGradient = ctx.createLinearGradient(19, 10, 19, 33);
    hairGradient.addColorStop(0, '#5a5a5a');
    hairGradient.addColorStop(0.3, '#4a4a4a');
    hairGradient.addColorStop(0.7, '#6a6a6a');
    hairGradient.addColorStop(1, '#4a4a4a');
    
    ctx.fillStyle = hairGradient;
    ctx.beginPath();
    ctx.moveTo(23, 30);
    ctx.quadraticCurveTo(19, 17, 33, 12);
    ctx.quadraticCurveTo(47, 10, 56, 14);
    ctx.quadraticCurveTo(61, 19, 56, 30);
    ctx.lineTo(54, 26);
    ctx.quadraticCurveTo(47, 19, 37, 21);
    ctx.quadraticCurveTo(28, 19, 23, 26);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#5a5a5a';
    ctx.fillRect(17, 33, 3.7, 14);
    ctx.fillRect(54, 33, 3.7, 14);
    
    const skinGradient = ctx.createRadialGradient(37, 39, 14, 37, 39, 26);
    skinGradient.addColorStop(0, '#e8c8b5');
    skinGradient.addColorStop(1, '#d8b8a5');
    
    ctx.fillStyle = skinGradient;
    ctx.beginPath();
    ctx.ellipse(37, 39, 20, 23, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.roundRect(21, 30, 14, 12, 2);
    ctx.roundRect(40, 30, 14, 12, 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(35, 35);
    ctx.lineTo(40, 35);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(200, 200, 255, 0.1)';
    ctx.fillRect(22, 31, 12, 10);
    ctx.fillRect(41, 31, 12, 10);
    
    ctx.fillStyle = '#4a3a2a';
    ctx.beginPath();
    ctx.ellipse(27, 35, 2.4, 2.8, 0, 0, Math.PI * 2);
    ctx.ellipse(48, 35, 2.4, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(27, 35, 0.9, 0, Math.PI * 2);
    ctx.arc(48, 35, 0.9, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.moveTo(22, 26);
    ctx.lineTo(32, 26);
    ctx.moveTo(43, 26);
    ctx.lineTo(53, 26);
    ctx.stroke();

    ctx.strokeStyle = '#c8a895';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(37, 37);
    ctx.lineTo(35, 43);
    ctx.quadraticCurveTo(37, 45, 39, 43);
    ctx.lineTo(37, 37);
    ctx.stroke();
    
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.moveTo(30, 46);
    ctx.quadraticCurveTo(33, 45, 37, 46);
    ctx.quadraticCurveTo(42, 45, 45, 46);
    ctx.quadraticCurveTo(43, 49, 41, 49);
    ctx.lineTo(34, 49);
    ctx.quadraticCurveTo(31, 49, 30, 46);
    ctx.fill();
    
    ctx.strokeStyle = '#a66';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(34, 52);
    ctx.quadraticCurveTo(37, 53, 41, 52);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(150, 100, 80, 0.3)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(37, 56);
    ctx.lineTo(37, 59);
    ctx.stroke();
    
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(14, 67, 47, 27);
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(33, 64);
    ctx.lineTo(42, 64);
    ctx.lineTo(39, 80);
    ctx.lineTo(36, 80);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#8b0000';
    ctx.beginPath();
    ctx.moveTo(36, 64);
    ctx.lineTo(39, 64);
    ctx.lineTo(38, 82);
    ctx.lineTo(37, 82);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#6b0000';
    ctx.lineWidth = 0.5;
    for(let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(36, 67 + i*3.7);
      ctx.lineTo(39, 67 + i*3.7);
      ctx.stroke();
    }
    
    ctx.strokeStyle = '#0a0a1e';
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.moveTo(19, 67);
    ctx.lineTo(33, 64);
    ctx.moveTo(56, 67);
    ctx.lineTo(42, 64);
    ctx.stroke();
  },

  drawEleni(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 75;
    canvas.height = 94;
    
    const bgGradient = ctx.createRadialGradient(37, 47, 19, 37, 47, 47);
    bgGradient.addColorStop(0, '#f5e8e0');
    bgGradient.addColorStop(1, '#d8c0b0');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 75, 94);
    
    const hairGradient = ctx.createLinearGradient(10, 10, 65, 61);
    hairGradient.addColorStop(0, '#1a0a05');
    hairGradient.addColorStop(0.5, '#2a1510');
    hairGradient.addColorStop(1, '#0a0502');
    
    ctx.fillStyle = hairGradient;
    ctx.beginPath();
    ctx.moveTo(8, 42);
    ctx.quadraticCurveTo(5, 23, 19, 14);
    ctx.quadraticCurveTo(28, 8, 37, 10);
    ctx.quadraticCurveTo(47, 8, 56, 14);
    ctx.quadraticCurveTo(70, 23, 67, 42);
    ctx.quadraticCurveTo(70, 56, 64, 64);
    ctx.quadraticCurveTo(61, 51, 56, 47);
    ctx.quadraticCurveTo(54, 33, 51, 28);
    ctx.quadraticCurveTo(47, 21, 37, 19);
    ctx.quadraticCurveTo(28, 21, 23, 28);
    ctx.quadraticCurveTo(21, 33, 19, 47);
    ctx.quadraticCurveTo(14, 51, 11, 64);
    ctx.quadraticCurveTo(5, 56, 8, 42);
    ctx.fill();
    
    const skinGradient = ctx.createRadialGradient(37, 37, 11, 37, 37, 21);
    skinGradient.addColorStop(0, '#f5d5c5');
    skinGradient.addColorStop(0.7, '#f0d0c0');
    skinGradient.addColorStop(1, '#e8c8b8');
    
    ctx.fillStyle = skinGradient;
    ctx.beginPath();
    ctx.moveTo(37, 19);
    ctx.quadraticCurveTo(52, 22, 51, 35);
    ctx.quadraticCurveTo(50, 45, 45, 50);
    ctx.quadraticCurveTo(41, 54, 37, 54);
    ctx.quadraticCurveTo(33, 54, 30, 50);
    ctx.quadraticCurveTo(25, 45, 24, 35);
    ctx.quadraticCurveTo(23, 22, 37, 19);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 220, 200, 0.3)';
    ctx.beginPath();
    ctx.ellipse(26, 37, 3.7, 1.9, -0.3, 0, Math.PI * 2);
    ctx.ellipse(49, 37, 3.7, 1.9, 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(80, 40, 60, 0.2)';
    ctx.beginPath();
    ctx.ellipse(30, 31, 6.5, 4.7, -0.1, 0, Math.PI);
    ctx.ellipse(45, 31, 6.5, 4.7, 0.1, 0, Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#fafafa';
    ctx.beginPath();
    ctx.ellipse(30, 33, 5.2, 3.2, -0.15, 0, Math.PI * 2);
    ctx.ellipse(45, 33, 5.2, 3.2, 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    const eyeGradient = ctx.createRadialGradient(30, 33, 0.9, 30, 33, 2.8);
    eyeGradient.addColorStop(0, '#2a5434');
    eyeGradient.addColorStop(0.5, '#3a6a44');
    eyeGradient.addColorStop(1, '#2a4d3a');
    
    ctx.fillStyle = eyeGradient;
    ctx.beginPath();
    ctx.ellipse(30, 33, 2.8, 2.8, -0.15, 0, Math.PI * 2);
    ctx.fill();
    
    const eyeGradient2 = ctx.createRadialGradient(45, 33, 0.9, 45, 33, 2.8);
    eyeGradient2.addColorStop(0, '#2a5434');
    eyeGradient2.addColorStop(0.5, '#3a6a44');
    eyeGradient2.addColorStop(1, '#2a4d3a');
    
    ctx.fillStyle = eyeGradient2;
    ctx.beginPath();
    ctx.ellipse(45, 33, 2.8, 2.8, 0.15, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(30, 33, 1.2, 1.4, 0, 0, Math.PI * 2);
    ctx.ellipse(45, 33, 1.2, 1.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(29, 32, 0.6, 0, Math.PI * 2);
    ctx.arc(44, 32, 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(24, 33);
    ctx.quadraticCurveTo(30, 30, 35, 33);
    ctx.moveTo(35, 33);
    ctx.lineTo(37, 32);
    ctx.moveTo(40, 33);
    ctx.quadraticCurveTo(45, 30, 51, 33);
    ctx.moveTo(51, 33);
    ctx.lineTo(53, 32);
    ctx.stroke();
    
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(26, 35);
    ctx.quadraticCurveTo(30, 36, 33, 35);
    ctx.moveTo(42, 35);
    ctx.quadraticCurveTo(45, 36, 49, 35);
    ctx.stroke();
    
    ctx.strokeStyle = '#0a0502';
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.moveTo(24, 26);
    ctx.quadraticCurveTo(30, 24, 35, 26);
    ctx.moveTo(40, 26);
    ctx.quadraticCurveTo(45, 24, 51, 26);
    ctx.stroke();
    
    ctx.strokeStyle = '#d4a590';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(37, 34);
    ctx.lineTo(35, 40);
    ctx.quadraticCurveTo(37, 42, 39, 40);
    ctx.lineTo(37, 34);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(255, 220, 200, 0.5)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(37, 35);
    ctx.lineTo(37, 39);
    ctx.stroke();
    
    const lipGradient = ctx.createLinearGradient(33, 46, 42, 46);
    lipGradient.addColorStop(0, '#a41e3a');
    lipGradient.addColorStop(0.5, '#c41e3a');
    lipGradient.addColorStop(1, '#a41e3a');
    
    ctx.fillStyle = lipGradient;
    ctx.beginPath();
    ctx.moveTo(33, 47);
    ctx.quadraticCurveTo(35, 45, 37, 46);
    ctx.quadraticCurveTo(40, 45, 42, 47);
    ctx.quadraticCurveTo(40, 50, 37, 49);
    ctx.quadraticCurveTo(35, 50, 33, 47);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255, 200, 200, 0.3)';
    ctx.beginPath();
    ctx.ellipse(37, 47, 2.8, 0.9, 0, 0, Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#2a1510';
    ctx.beginPath();
    ctx.arc(47, 43, 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(17, 67);
    ctx.quadraticCurveTo(28, 64, 37, 65);
    ctx.quadraticCurveTo(47, 64, 58, 67);
    ctx.lineTo(58, 94);
    ctx.lineTo(17, 94);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#silver';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(26, 61);
    ctx.quadraticCurveTo(37, 65, 49, 61);
    ctx.stroke();
    
    ctx.fillStyle = '#e0e0f0';
    ctx.beginPath();
    ctx.moveTo(37, 66);
    ctx.lineTo(35, 69);
    ctx.lineTo(37, 72);
    ctx.lineTo(40, 69);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#c0c0d0';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  },

  drawGeorgios(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 75;
    canvas.height = 94;
    
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 94);
    bgGradient.addColorStop(0, '#e8e0d8');
    bgGradient.addColorStop(1, '#d0c0b0');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 75, 94);
    
    ctx.fillStyle = '#3a3a3a';
    ctx.beginPath();
    ctx.moveTo(21, 28);
    ctx.quadraticCurveTo(19, 17, 28, 12);
    ctx.quadraticCurveTo(37, 10, 47, 12);
    ctx.quadraticCurveTo(56, 17, 54, 28);
    ctx.lineTo(51, 24);
    ctx.quadraticCurveTo(47, 19, 37, 18);
    ctx.quadraticCurveTo(28, 19, 24, 24);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = 'rgba(120, 120, 120, 0.7)';
    for(let i = 0; i < 56; i++) {
      const x = 24 + Math.random() * 28;
      const y = 13 + Math.random() * 11;
      if (y < ( -0.05 * (x-37)*(x-37) + 24) ) {
         ctx.fillRect(x, y, 0.9, 0.9);
      }
    }
    
    const skinGradient = ctx.createRadialGradient(37, 39, 14, 37, 39, 24);
    skinGradient.addColorStop(0, '#ddbba0');
    skinGradient.addColorStop(0.7, '#d0aa90');
    skinGradient.addColorStop(1, '#c8a085');
    
    ctx.fillStyle = skinGradient;
    ctx.beginPath();
    ctx.ellipse(37, 39, 19, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(150, 100, 70, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(26, 25);
    ctx.quadraticCurveTo(37, 24, 49, 25);
    ctx.moveTo(28, 28);
    ctx.quadraticCurveTo(37, 27, 47, 28);
    ctx.moveTo(30, 31);
    ctx.quadraticCurveTo(37, 30, 45, 31);
    ctx.stroke();
    
    ctx.fillStyle = '#f8f8f8';
    ctx.beginPath();
    ctx.ellipse(30, 35, 3.7, 2.8, 0, 0, Math.PI * 2);
    ctx.ellipse(45, 35, 3.7, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(200, 100, 100, 0.2)';
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(27, 35);
    ctx.lineTo(29, 33);
    ctx.moveTo(28, 36);
    ctx.lineTo(30, 35);
    ctx.moveTo(47, 35);
    ctx.lineTo(46, 33);
    ctx.moveTo(47, 36);
    ctx.lineTo(45, 35);
    ctx.stroke();
    
    ctx.fillStyle = '#5a4030';
    ctx.beginPath();
    ctx.ellipse(30, 35, 2.3, 2.3, 0, 0, Math.PI * 2);
    ctx.ellipse(45, 35, 2.3, 2.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(30, 35, 0.9, 0, Math.PI * 2);
    ctx.arc(45, 35, 0.9, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(100, 70, 50, 0.5)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(26, 37);
    ctx.quadraticCurveTo(30, 39, 33, 37);
    ctx.moveTo(42, 37);
    ctx.quadraticCurveTo(45, 39, 49, 37);
    ctx.stroke();
    
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(25, 30, 9, 1.9);
    ctx.fillRect(40, 30, 9, 1.9);
    
    ctx.strokeStyle = '#c09580';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(37, 35);
    ctx.lineTo(35, 42);
    ctx.quadraticCurveTo(37, 44, 40, 42);
    ctx.lineTo(37, 35);
    ctx.stroke();
    
    ctx.fillStyle = 'rgba(100, 70, 50, 0.4)';
    ctx.beginPath();
    ctx.ellipse(35, 43, 1.9, 0.9, 0, 0, Math.PI);
    ctx.ellipse(40, 43, 1.9, 0.9, 0, 0, Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(50, 50, 50, 0.2)';
    for(let i = 0; i < 75; i++) {
      const x = 22 + Math.random() * 30;
      const y = 45 + Math.random() * 17;
      ctx.fillRect(x, y, 0.5, 0.7);
    }
    
    ctx.strokeStyle = '#966';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(32, 52);
    ctx.quadraticCurveTo(37, 54, 42, 52);
    ctx.stroke();
    
    ctx.strokeStyle = 'rgba(100, 70, 50, 0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(23, 33);
    ctx.lineTo(21, 31);
    ctx.moveTo(23, 35);
    ctx.lineTo(21, 33);
    ctx.moveTo(23, 36);
    ctx.lineTo(21, 36);
    ctx.moveTo(51, 33);
    ctx.lineTo(53, 31);
    ctx.moveTo(51, 35);
    ctx.lineTo(53, 33);
    ctx.moveTo(51, 36);
    ctx.lineTo(53, 36);
    ctx.stroke();
    
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(14, 67, 47, 27);
    
    ctx.fillStyle = '#34495e';
    ctx.fillRect(14, 67, 47, 2.7);
    ctx.fillRect(14, 80, 47, 2.7);
    
    const badgeGradient = ctx.createLinearGradient(19, 71, 24, 77);
    badgeGradient.addColorStop(0, '#ffd700');
    badgeGradient.addColorStop(1, '#ffed4e');
    
    ctx.fillStyle = badgeGradient;
    ctx.beginPath();
    ctx.moveTo(19, 72);
    ctx.lineTo(24, 72);
    ctx.lineTo(25, 75);
    ctx.lineTo(21, 77);
    ctx.lineTo(18, 75);
    ctx.closePath();
    ctx.fill();
    
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(33, 71, 23, 7);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(33, 71, 23, 7);
    
    ctx.strokeStyle = '#1c2e40';
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.moveTo(24, 67);
    ctx.lineTo(33, 64);
    ctx.lineTo(42, 64);
    ctx.lineTo(51, 67);
    ctx.stroke();
  },

  drawAlexandra(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 75;
    canvas.height = 94;
    
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 94);
    bgGradient.addColorStop(0, '#f5ede5');
    bgGradient.addColorStop(1, '#e5d5c5');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 75, 94);
    
    const hairGradient = ctx.createLinearGradient(14, 10, 61, 51);
    hairGradient.addColorStop(0, '#d4a574');
    hairGradient.addColorStop(0.3, '#e5c29f');
    hairGradient.addColorStop(0.7, '#c4956a');
    hairGradient.addColorStop(1, '#b8865a');
    
    ctx.fillStyle = hairGradient;
    ctx.beginPath();
    ctx.moveTo(17, 33);
    ctx.quadraticCurveTo(14, 19, 28, 12);
    ctx.quadraticCurveTo(42, 8, 56, 14);
    ctx.quadraticCurveTo(64, 21, 61, 33);
    ctx.quadraticCurveTo(62, 42, 58, 47);
    ctx.lineTo(54, 39);
    ctx.quadraticCurveTo(51, 30, 47, 26);
    ctx.quadraticCurveTo(37, 23, 28, 26);
    ctx.quadraticCurveTo(23, 30, 21, 39);
    ctx.lineTo(17, 47);
    ctx.quadraticCurveTo(14, 42, 17, 33);
    ctx.fill();
    
    ctx.strokeStyle = '#f5d5a5';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(23, 19);
    ctx.quadraticCurveTo(26, 28, 24, 37);
    ctx.moveTo(51, 19);
    ctx.quadraticCurveTo(49, 28, 51, 37);
    ctx.stroke();
    
    const skinGradient = ctx.createRadialGradient(37, 37, 11, 37, 37, 21);
    skinGradient.addColorStop(0, '#f5d5c5');
    skinGradient.addColorStop(1, '#e8c8b8');
    
    ctx.fillStyle = skinGradient;
    ctx.beginPath();
    ctx.moveTo(37, 21);
    ctx.quadraticCurveTo(50, 24, 49, 37);
    ctx.quadraticCurveTo(48, 47, 42, 52);
    ctx.quadraticCurveTo(37, 54, 32, 52);
    ctx.quadraticCurveTo(26, 47, 25, 37);
    ctx.quadraticCurveTo(24, 24, 37, 21);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(31, 33, 4.2, 2.8, -0.1, 0, Math.PI * 2);
    ctx.ellipse(44, 33, 4.2, 2.8, 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    const blueGradient = ctx.createRadialGradient(31, 33, 0.9, 31, 33, 2.3);
    blueGradient.addColorStop(0, '#4a7c9e');
    blueGradient.addColorStop(1, '#6a9cc4');
    
    ctx.fillStyle = blueGradient;
    ctx.beginPath();
    ctx.ellipse(31, 33, 2.3, 2.3, 0, 0, Math.PI * 2);
    ctx.ellipse(44, 33, 2.3, 2.3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(31, 33, 0.9, 0, Math.PI * 2);
    ctx.arc(44, 33, 0.9, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.arc(30, 32, 0.6, 0, Math.PI * 2);
    ctx.arc(43, 32, 0.6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#b8865a';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(26, 28);
    ctx.quadraticCurveTo(31, 26, 35, 28);
    ctx.moveTo(40, 28);
    ctx.quadraticCurveTo(44, 26, 49, 28);
    ctx.stroke();
    
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.ellipse(31, 33, 6, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(44, 33, 6, 6, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#d4a590';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(37, 34);
    ctx.lineTo(35, 40);
    ctx.moveTo(37, 34);
    ctx.lineTo(39, 40);
    ctx.moveTo(35, 41);
    ctx.quadraticCurveTo(37, 42, 39, 41);
    ctx.stroke();

    ctx.fillStyle = '#d08080';
    ctx.beginPath();
    ctx.moveTo(33, 47);
    ctx.quadraticCurveTo(37, 46, 42, 47);
    ctx.quadraticCurveTo(40, 49, 37, 48);
    ctx.quadraticCurveTo(35, 49, 33, 47);
    ctx.fill();
    
    ctx.fillStyle = '#404040';
    ctx.fillRect(19, 65, 37, 29);
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(28, 63);
    ctx.lineTo(47, 63);
    ctx.lineTo(42, 70);
    ctx.lineTo(37, 65);
    ctx.lineTo(33, 70);
    ctx.closePath();
    ctx.fill();
    
    ctx.fillStyle = '#f8f8f0';
    for(let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(24 + i*3.7, 61, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.3;
      ctx.stroke();
    }
  },

  renderSuspects(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    const html = `
      <div class="suspects-section">
        <h2 class="section-title">👥 ΚΑΤΑΛΟΓΟΣ ΥΠΟΠΤΩΝ</h2>
        <div class="suspects-grid">
          ${this.suspects.map((suspect, index) => `
            <div class="suspect-card">
              <div class="suspect-photo-container">
                <canvas id="${suspect.canvasId}" class="suspect-canvas"></canvas>
                <div class="suspect-number">ΥΠΟΠΤΟΣ #${index + 1}</div>
              </div>
              <div class="suspect-details">
                <h3>${suspect.name}</h3>
                <div class="suspect-field">
                  <strong>ΙΔΙΟΤΗΤΑ:</strong> ${suspect.role}
                </div>
                <div class="suspect-field">
                  <strong>ΑΛΛΟΘΙ:</strong> ${suspect.alibi}
                </div>
                <div class="suspect-field">
                  <strong>ΚΙΝΗΤΡΟ:</strong> ${suspect.motive}
                </div>
                ${suspect.notes ? `
                  <div class="suspect-field">
                    <strong>ΠΑΡΑΤΗΡΗΣΕΙΣ:</strong> ${suspect.notes}
                  </div>
                ` : ''}
                ${suspect.relationship ? `
                  <div class="suspect-field">
                    <strong>ΣΧΕΣΗ ΜΕ ΘΥΜΑ:</strong> ${suspect.relationship}
                  </div>
                ` : ''}
                ${suspect.financial ? `
                  <div class="suspect-field">
                    <strong>ΟΙΚΟΝΟΜΙΚΑ:</strong> ${suspect.financial}
                  </div>
                ` : ''}
                ${suspect.history ? `
                  <div class="suspect-field">
                    <strong>ΙΣΤΟΡΙΚΟ:</strong> ${suspect.history}
                  </div>
                ` : ''}
                ${suspect.education ? `
                  <div class="suspect-field">
                    <strong>ΕΚΠΑΙΔΕΥΣΗ:</strong> ${suspect.education}
                  </div>
                ` : ''}
                <div class="suspect-field">
                  <strong>ΑΛΛΟ:</strong> ${suspect.other}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
	
    setTimeout(() => {
      this.drawMaria('maria-portrait');
      this.drawKonstantinos('konstantinos-portrait');
      this.drawEleni('eleni-portrait');
      this.drawGeorgios('georgios-portrait');
      this.drawAlexandra('alexandra-portrait');
    }, 100);
  }
};

if (typeof window !== 'undefined') {
  window.SuspectsModule = SuspectsModule;
}