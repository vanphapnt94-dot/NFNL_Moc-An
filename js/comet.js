// Xử lý hiệu ứng thu nhỏ, sao băng và tách nút download
window.startShrinkAndFly = function(sceneWrapper, shadowFloor) {
    // Lấy vị trí hiện tại của logo trên màn hình
    const rect = sceneWrapper.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Vị trí đích: chính giữa cạnh dưới màn hình
    const endX = window.innerWidth / 2;
    const endY = window.innerHeight - 70; // Trục Y của tâm container nút bấm

    // Tạo đốm sáng
    const comet = document.createElement('div');
    comet.className = 'comet';
    comet.style.left = startX + 'px';
    comet.style.top = startY + 'px';
    comet.style.opacity = '0';
    comet.style.transform = 'translate(-50%, -50%) scale(0.5)';
    document.body.appendChild(comet);

    // Kích hoạt hiệu ứng "Cánh cổng kim cương"
    sceneWrapper.style.transition = 'none'; 
    sceneWrapper.style.animation = 'diamondGateShrink 1.2s cubic-bezier(0.42, 0, 0.58, 1) forwards';
    
    shadowFloor.style.animation = 'none';
    shadowFloor.style.transition = 'opacity 0.6s ease';
    shadowFloor.style.opacity = '0';

    // Fade-in đốm sáng
    setTimeout(() => {
        comet.style.transition = 'opacity 0.4s ease-in, transform 0.4s ease-in';
        comet.style.opacity = '1';
        comet.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 800);

    // Logo biến mất -> bay sao băng
    setTimeout(() => {
        sceneWrapper.style.display = 'none';
        launchComet(comet, startX, startY, endX, endY);
    }, 1200);
};

function launchComet(comet, startX, startY, endX, endY) {
    comet.style.transition = 'none'; 

    const duration = 1500; // 1.5s bay
    const startTime = performance.now();
    let lastTrailTime = 0;

    function animateComet(currentTime) {
        const elapsed = currentTime - startTime;
        let t = Math.min(elapsed / duration, 1);
        
        const eased = t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const currentX = startX + (endX - startX) * eased;
        const currentY = startY + (endY - startY) * eased;

        const arcHeight = -120; 
        const arcOffset = arcHeight * Math.sin(Math.PI * t);
        const finalY = currentY + arcOffset;

        comet.style.left = currentX + 'px';
        comet.style.top = finalY + 'px';

        if (currentTime - lastTrailTime > 15) {
            createTrailParticle(currentX, finalY);
            lastTrailTime = currentTime;
        }

        if (t < 1) {
            requestAnimationFrame(animateComet);
        } else {
            cometArrived(comet, endX, endY);
        }
    }

    requestAnimationFrame(animateComet);
}

function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'trail-particle';

    const size = 3 + Math.random() * 6;
    const colors = [
        'rgba(255, 68, 68, 0.9)',
        'rgba(255, 100, 50, 0.8)',
        'rgba(255, 150, 50, 0.7)',
        'rgba(200, 0, 0, 0.9)',
        'rgba(255, 200, 100, 0.6)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const offsetX = (Math.random() - 0.5) * 12;
    const offsetY = (Math.random() - 0.5) * 12;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = (x + offsetX) + 'px';
    particle.style.top = (y + offsetY) + 'px';
    particle.style.background = `radial-gradient(circle, ${color}, transparent)`;
    particle.style.boxShadow = `0 0 ${size}px ${color}`;
    
    const homeSection = document.getElementById('home') || document.body;
    homeSection.appendChild(particle);

    const fadeTime = 300 + Math.random() * 500;
    particle.style.transition = `opacity ${fadeTime}ms ease-out, transform ${fadeTime}ms ease-out`;
    
    requestAnimationFrame(() => {
        particle.style.opacity = '0';
        particle.style.transform = `translate(-50%, -50%) scale(0.1)`;
    });

    setTimeout(() => particle.remove(), fadeTime + 50);
}

function cometArrived(comet, x, y) {
    comet.style.transition = 'transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease';
    comet.style.transform = 'translate(-50%, -50%) scale(3)';
    comet.style.boxShadow = '0 0 40px 20px rgba(255, 50, 50, 0.9), 0 0 80px 40px rgba(255, 50, 50, 0.4)';
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createBurstParticle(x, y), i * 20);
    }

    setTimeout(() => {
        comet.style.transform = 'translate(-50%, -50%) scale(0)';
        comet.style.opacity = '0';
    }, 200);

    setTimeout(() => {
        comet.remove();
        document.getElementById('btnLeft').classList.add('show');
        document.getElementById('btnRight').classList.add('show');
        
        const topNav = document.getElementById('topNav');
        if (topNav) topNav.classList.add('show');
        
        // Kích hoạt hiệu ứng nước cuốn trôi nền đen để lộ video
        const darkBg = document.getElementById('darkBg');
        if (darkBg) darkBg.classList.add('wash');
        
        setTimeout(() => {
            // Đổi vị trí: Nút Download (btnLeft) văng sang PHẢI, nút Playtest (btnRight) văng sang TRÁI
            document.getElementById('btnLeft').classList.add('split-right');
            document.getElementById('btnRight').classList.add('split-left');
        }, 700);
    }, 500);
}

function createBurstParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'trail-particle';
    
    const size = 4 + Math.random() * 8;
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 60;
    const tx = x + Math.cos(angle) * distance;
    const ty = y + Math.sin(angle) * distance;
    const color = `rgba(255, ${Math.floor(50 + Math.random() * 100)}, ${Math.floor(Math.random() * 50)}, 0.9)`;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.background = `radial-gradient(circle, ${color}, transparent)`;
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    
    document.body.appendChild(particle);

    particle.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    requestAnimationFrame(() => {
        particle.style.left = tx + 'px';
        particle.style.top = ty + 'px';
        particle.style.opacity = '0';
        particle.style.transform = 'translate(-50%, -50%) scale(0)';
    });

    setTimeout(() => particle.remove(), 700);
}
