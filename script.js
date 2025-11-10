// ===== STARFIELD ANIMATION =====
let starfieldInstances = [];

function createStarfield(canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationId;

    function resizeCanvas() {
        const parent = canvas.parentElement;
        if (!parent) return; // Adicionado para segurança
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        initStars();
    }

    function initStars() {
        stars = [];
        // Otimiza a quantidade de estrelas baseada no tamanho do canvas
        const numStars = Math.min(1000, (canvas.width * canvas.height) / 2000);
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    function drawStars() {
        if (!ctx) return; // Adicionado para segurança
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 165, 116, ${star.opacity})`;
            ctx.fill();

            if (star.radius > 1) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 165, 116, ${star.opacity * 0.2})`;
                ctx.fill();
            }
        });
    }

    function updateStars() {
        stars.forEach(star => {
            star.x += star.vx;
            star.y += star.vy;

            star.opacity += (Math.random() - 0.5) * 0.02;
            star.opacity = Math.max(0.1, Math.min(0.8, star.opacity));

            // Ajustado para manter as estrelas na tela
            if (star.x < 0) star.x = canvas.width;
            if (star.x > canvas.width) star.x = 0;
            if (star.y < 0) star.y = canvas.height;
            if (star.y > canvas.height) star.y = 0;
        });
    }

    function animate() {
        drawStars();
        updateStars();
        animationId = requestAnimationFrame(animate);
    }

    function start() {
        resizeCanvas();
        animate();
    }

    function stop() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }

    return { start, stop, resizeCanvas };
}

function initAllStarfields() {
    starfieldInstances.forEach(instance => instance.stop());
    starfieldInstances = [];

    const canvases = document.querySelectorAll('.starfield-canvas');
    canvases.forEach(canvas => {
        const instance = createStarfield(canvas);
        instance.start();
        starfieldInstances.push(instance);
    });
}

// ===== CAROUSEL =====
let currentSlide = 0;
const totalSlides = 5;

function moveCarousel(direction) {
    currentSlide += direction;
    
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const wrapper = document.getElementById('carouselWrapper');
    if (wrapper) {
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startCarouselAutoPlay() {
    setInterval(() => {
        moveCarousel(1);
    }, 5000);
}

// ===== LIKE POST FUNCTION =====
function likePost(button) {
    const likeCountSpan = button.querySelector('.like-count');
    if (!likeCountSpan) return;
    let currentCount = parseInt(likeCountSpan.textContent);
    
    button.classList.toggle('liked');

    if (button.classList.contains('liked')) {
        likeCountSpan.textContent = currentCount + 1;
        button.innerHTML = `❤️ <span class="like-count">${currentCount + 1}</span>`;
        button.style.background = 'var(--accent-gold)';
        button.style.color = 'var(--dark-bg)';
        
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    } else {
        likeCountSpan.textContent = currentCount - 1;
        button.innerHTML = `👍 <span class="like-count">${currentCount - 1}</span>`;
        // Limpa os estilos inline para voltar ao padrão da classe CSS
        button.style.background = '';
        button.style.color = '';
    }
}

// ===== FUNÇÕES DE TAB (Perfil, Recompensas, Configurações) =====
function showProfileTab(tabId) {
    const tabs = document.querySelectorAll('#profile .tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    const contents = document.querySelectorAll('.profile-tab-content');
    contents.forEach(content => content.style.display = 'none');
    
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.style.display = 'block';
    }
}

function showRewardsTab(tabId) {
    const tabs = document.querySelectorAll('#recompensas .tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    const contents = document.querySelectorAll('.rewards-tab-content');
    contents.forEach(content => content.style.display = 'none');
    
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.style.display = 'block';
    }
}

function showSettingsTab(tabId) {
    const tabs = document.querySelectorAll('#configuracoes .tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    const contents = document.querySelectorAll('.settings-tab-content');
    contents.forEach(content => content.style.display = 'none');
    
    const targetContent = document.getElementById(tabId);
    if (targetContent) {
        targetContent.style.display = 'block';
    }
}

// ===== INICIALIZAÇÃO QUANDO O DOM ESTÁ PRONTO =====
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Inicializa todos os starfields
    initAllStarfields();
    
    // 2. Reinicializa starfields ao redimensionar a janela
    window.addEventListener('resize', () => {
        starfieldInstances.forEach(instance => instance.resizeCanvas());
    });

    // 3. Lógica do Menu Mobile (Hambúrguer)
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('.nav');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav-active');
        });
    }

    // 4. Inicializa o Carrossel (somente se estiver na página)
    const dotsContainer = document.getElementById('carouselDots');
    if (dotsContainer) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.onclick = () => goToSlide(i);
            dotsContainer.appendChild(dot);
        }
        startCarouselAutoPlay();
    }
    
    // 5. Simulação de Chat (somente se estiver na página)
    const chatPage = document.getElementById('chat');
    if (chatPage) {
        const chatInput = chatPage.querySelector('.chat-input');
        const sendButton = chatPage.querySelector('.chat-input-container .btn');
        
        if (sendButton && chatInput) {
            sendButton.addEventListener('click', function() {
                const messageText = chatInput.value.trim();
                if (messageText) {
                    const messagesContainer = chatPage.querySelector('.chat-messages');
                    const newMessage = document.createElement('div');
                    newMessage.className = 'message';
                    // Sanitiza o input para evitar HTML injection
                    const sanitizedText = messageText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    newMessage.innerHTML = `
                        <div class="message-avatar">👤</div>
                        <div class="message-content">
                            <div class="message-author">@joao_silva <span style="color: var(--text-muted); font-weight: normal; font-size: 0.85rem;">Agora</span></div>
                            <div>${sanitizedText}</div>
                        </div>
                    `;
                    messagesContainer.appendChild(newMessage);
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    chatInput.value = '';
                }
            });

            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendButton.click();
                }
            });
        }
    }

    // 6. Animação de Estrelas de Avaliação (somente se estiver na página)
    const mediaPage = document.getElementById('media');
    if (mediaPage) {
        const stars = mediaPage.querySelectorAll('.info-card .rating .star[style*="cursor"]');
        stars.forEach((star, index) => {
            star.addEventListener('click', function() {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.style.color = 'var(--accent-gold)';
                        s.textContent = '★';
                    } else {
                        s.style.color = 'var(--text-muted)';
                        s.textContent = '☆';
                    }
                });
            });
        });
    }
});