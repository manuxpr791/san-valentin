/**
 * SISTEMA: Colorados Valcro
 * SCRIPT: script.js (Index)
 */

const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
let w, h;
const hearts = [];
const petals = [];

const colors = ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f7cad0', '#ee6055'];

// --- LÓGICA DE AUDIO (Mantenida en HTML para evitar conflictos) ---
/* Nota: La función manejarAudioIndex se ha movido al bloque <script> del index.html 
  para asegurar la sincronización con el LocalStorage del servidor Valcro.
*/

function init() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    hearts.length = 0;
    petals.length = 0;
    
    // Generamos los corazones del árbol
    for(let i=0; i < 3000; i++) {
        hearts.push(new Heart());
    }
    // Generamos los pétalos que caen
    for(let i=0; i < 40; i++) {
        petals.push(new Petal());
    }
}

class Heart {
    constructor() { this.reset(); }

    reset() {
        const t = Math.random() * Math.PI * 2;
        const r = Math.pow(Math.random(), 0.5); 
        
        const rawX = 16 * Math.pow(Math.sin(t), 3);
        const rawY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        const heartScaleX = 9; 
        const heartScaleY = 10; 

        this.tx = (rawX * heartScaleX * r) + (w / 2);
        this.ty = (rawY * heartScaleY * r) + (h * 0.40); 

        const limiteTroncoSolido = h * 0.70; 
        
        if (this.ty > limiteTroncoSolido) {
            this.ty = limiteTroncoSolido - (Math.random() * 5);
            this.tx = (this.tx - w/2) * 0.3 + w/2;
        }

        this.delay = r * 300 + Math.random() * 250; 
        this.size = Math.random() * 5 + 2; 
        this.scale = 0; 
        this.alpha = 0;         
        this.growth = Math.random() * 0.03 + 0.015;
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        if(this.delay > 0) { this.delay--; return; }
        if (this.scale < 1) {
            this.scale += this.growth;
            this.alpha = Math.min(1, this.alpha + 0.04);
        }
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.translate(this.tx, this.ty);
        ctx.scale(this.scale, this.scale);
        this.drawHeartShape();
        ctx.restore();
    }

    drawHeartShape() {
        ctx.beginPath();
        const s = this.size;
        ctx.moveTo(0, 0); 
        ctx.bezierCurveTo(-s / 2, -s / 2, -s, s / 3, 0, s);
        ctx.bezierCurveTo(s, s / 3, s / 2, -s / 2, 0, 0);
        ctx.fill();
    }
}

class Petal {
    constructor() { this.reset(); }
    reset() {
        this.x = (w / 2) + (Math.random() * 200 - 100);
        this.y = h * 0.35; 
        this.size = Math.random() * 4 + 2;
        this.speedY = Math.random() * 1.2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.alpha = 1;
        this.delay = Math.random() * 800;
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    draw() {
        if(this.delay > 0) { this.delay--; return; }
        this.y += this.speedY;
        this.x += Math.sin(this.y / 30) * 1.1 + this.speedX;
        if (this.y > h * 0.92) {
            this.alpha -= 0.02;
            if (this.alpha <= 0) this.reset();
        }
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        const s = this.size;
        ctx.moveTo(0, 0); 
        ctx.bezierCurveTo(-s / 2, -s / 2, -s, s / 3, 0, s);
        ctx.bezierCurveTo(s, s / 3, s / 2, -s / 2, 0, 0);
        ctx.fill();
        ctx.restore();
    }
}

function animate() {
    ctx.clearRect(0, 0, w, h);
    hearts.forEach(h => h.draw());
    petals.forEach(p => p.draw());
    requestAnimationFrame(animate);
}

// Contador (Fecha: 14 de Marzo de 2022)
const startDate = new Date(2022, 2, 14, 0, 0, 0); 

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const min = Math.floor((diff / 1000 / 60) % 60);
    const sec = Math.floor((diff / 1000) % 60);
    const pad = (n) => n.toString().padStart(2, '0');
    const el = document.getElementById('counter');
    if(el) el.innerText = `${d} días ${pad(hours)}:${pad(min)}:${pad(sec)}`;
}

// --- EJECUCIÓN ---
window.addEventListener('resize', init);
init();
animate();

// El audio se maneja desde el HTML para mayor estabilidad
setInterval(updateCounter, 1000);
updateCounter();