function createHeart() {
    const heart = document.createElement('div');
    const hearts = ['❤️', '💖', '💗', '💓', '💕', '💝', '', '✨'];
    const colors = ['#DB2777', '#6B21A8', '#9333EA', '#EC4899', '#F472B6', '#FF1493', '#C71585'];

    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.className = 'heart-particle';

    // Random position across the width
    heart.style.left = Math.random() * 100 + 'vw';

    // Random size for depth - some small, some large
    const size = Math.random() * 20 + 8; // 8px to 28px
    heart.style.fontSize = size + 'px';

    // Random color from the palette
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];

    // Add subtle glow based on color
    const color = colors[Math.floor(Math.random() * colors.length)];
    heart.style.textShadow = `0 0 10px ${color}80`;

    // Random duration for natural feel
    const duration = Math.random() * 4 + 4; // 4s to 8s
    heart.style.animationDuration = duration + 's';

    // Slight horizontal sway using dynamic keyframes or just random starting rotation
    const rotation = Math.random() * 360;
    heart.style.transform = `rotate(${rotation}deg)`;

    document.body.appendChild(heart);

    // Remove heart after animation completes
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// Create hearts periodically - adjusted for density
setInterval(createHeart, 250);

// Initial burst to populate the screen immediately
for (let i = 0; i < 15; i++) {
    setTimeout(createHeart, Math.random() * 3000);
}

// Valentine Modal Logic
function showValentineModal() {
    const modal = document.getElementById('valentineModal');
    if (modal) {
        modal.classList.add('active');
        burstHearts();
    }
}

window.closeValentineModal = function () {
    const modal = document.getElementById('valentineModal');
    if (modal) {
        modal.classList.remove('active');
    }
};

function burstHearts() {
    const hearts = ['❤️', '💖', '💗', '💓', '💕', '💝', '✨', '🌹', '💟', '💘'];
    const count = 80; // More hearts for a bigger impact

    for (let i = 0; i < count; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.className = 'burst-heart';

        // Random direction for burst - wider spread
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 500 + 150;
        const tx = Math.cos(angle) * velocity + 'px';
        const ty = Math.sin(angle) * velocity + 'px';
        const rot = Math.random() * 720 + 'deg';

        heart.style.setProperty('--tx', tx);
        heart.style.setProperty('--ty', ty);
        heart.style.setProperty('--rot', rot);

        // Varying sizes
        heart.style.fontSize = (Math.random() * 30 + 20) + 'px';

        document.body.appendChild(heart);

        // Clean up
        setTimeout(() => heart.remove(), 1500);
    }
}

// Show modal after 1 second - ONLY ON HOME PAGE
document.addEventListener('DOMContentLoaded', () => {
    const isHomePage = window.location.pathname.endsWith('index.html') ||
        window.location.pathname.endsWith('/') ||
        window.location.pathname === '';

    if (isHomePage) {
        setTimeout(showValentineModal, 1000);
    }
});

// Update close to just hide the modal
window.closeValentineModal = function () {
    const modal = document.getElementById('valentineModal');
    if (modal) {
        modal.classList.remove('active');
    }
};
