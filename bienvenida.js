/**
 * SISTEMA: Colorados Valcro
 * SCRIPT: bienvenida.js
 */

const btnNo = document.getElementById('btn-no');
const btnSi = document.getElementById('btn-si');
const heartTrigger = document.getElementById('heart-trigger');
const overlay = document.getElementById('invitation-overlay');
const carouselContainer = document.getElementById('carousel-container');
const envelopeWrapper = document.querySelector('.envelope-wrapper');
const musica = document.getElementById('musica');

// --- NUEVA LÓGICA DE PERSISTENCIA CONSTANTE ---
// Esto asegura que la música no se corte al cambiar de página
setInterval(() => {
    if (musica && !musica.paused) {
        localStorage.setItem('musica_posicion', musica.currentTime);
        localStorage.setItem('musica_sonando', 'true');
    }
}, 1000);

// 1. Lógica del sobre con Fade In Progresivo
envelopeWrapper.addEventListener('click', () => {
    if (!envelopeWrapper.classList.contains('open')) {
        envelopeWrapper.classList.add('open');
        
        if (musica) {
            musica.volume = 0; 
            musica.play().then(() => {
                let vol = 0;
                const fadeIn = setInterval(() => {
                    if (vol < 0.5) { 
                        vol += 0.05;
                        musica.volume = Math.min(vol, 0.5);
                    } else {
                        clearInterval(fadeIn);
                    }
                }, 200); 
            }).catch(error => {
                console.log("El navegador bloqueó el audio.");
            });
        }

        setTimeout(() => {
            const letter = document.querySelector('.letter');
            if(letter) {
                letter.style.visibility = "visible";
                letter.style.opacity = "1";
                letter.style.zIndex = "20";
            }
        }, 300);
    }
});

// 2. Botón NO evasivo
btnNo.addEventListener('mouseover', () => {
    if (btnNo.parentElement.classList.contains('btn-group')) {
        document.body.appendChild(btnNo);
    }
    const padding = 50;
    const maxX = window.innerWidth - btnNo.offsetWidth - padding;
    const maxY = window.innerHeight - btnNo.offsetHeight - padding;
    const randomX = Math.max(padding, Math.random() * maxX);
    const randomY = Math.max(padding, Math.random() * maxY);
    
    btnNo.style.position = 'fixed';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
    btnNo.style.zIndex = '10000';
});

// 3. Botón SÍ
btnSi.addEventListener('click', (e) => {
    e.stopPropagation();
    if(btnNo) btnNo.remove();
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.classList.add('hidden');
        carouselContainer.classList.remove('hidden');
        iniciarCarrusel();
    }, 500);
});

// 4. Carrusel
let currentSlide = 0;
let carruselInterval;

function iniciarCarrusel() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-arrow');
    const nextBtn = document.getElementById('next-arrow');

    function update() {
        slides.forEach(s => {
            s.classList.remove('active', 'prev', 'next');
            s.style.opacity = "0";
        });
        const prevIdx = (currentSlide - 1 + slides.length) % slides.length;
        const nextIdx = (currentSlide + 1) % slides.length;
        slides[prevIdx].classList.add('prev');
        slides[prevIdx].style.opacity = "0.5";
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.opacity = "1";
        slides[nextIdx].classList.add('next');
        slides[nextIdx].style.opacity = "0.5";
    }

    nextBtn.addEventListener('click', () => {
        clearInterval(carruselInterval);
        currentSlide = (currentSlide + 1) % slides.length;
        update();
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(carruselInterval);
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        update();
    });

    update();
    carruselInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        update();
    }, 4000);
}

// 5. Corazón y Redirección
heartTrigger.addEventListener('click', () => {
    heartTrigger.classList.add('heart-fall');
    
    // Guardado final de seguridad
    if (musica) {
        localStorage.setItem('musica_posicion', musica.currentTime);
        localStorage.setItem('musica_sonando', 'true');
    }

    setTimeout(() => {
        window.location.href = "index.html?animate=true";
    }, 1100);
});