window.initRoots = function() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '5';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width;
    let height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    let roots = [];
    let isHovering = false;

    class Root {
        constructor(x, y, angle, size) {
            this.x = x;
            this.y = y;
            this.angle = angle;
            this.size = size;
            this.speed = Math.random() * 1.5 + 0.8;

            const r = Math.floor(130 + Math.random() * 100);
            const g = Math.floor(Math.random() * 20);
            const b = Math.floor(Math.random() * 30);
            this.color = `rgba(${r}, ${g}, ${b}, 0.9)`;
            this.dead = false;
        }

        update() {
            if (this.dead) return;

            const oldX = this.x;
            const oldY = this.y;

            this.angle += (Math.random() - 0.5) * 0.35;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.size -= 0.006;

            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(150, 0, 0, 0.7)';

            ctx.beginPath();
            ctx.moveTo(oldX, oldY);
            ctx.lineTo(this.x, this.y);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.lineCap = 'round';
            ctx.stroke();

            ctx.shadowBlur = 0;

            if (this.size <= 0.2 || this.x < -100 || this.y < -100 || this.x > width + 100 || this.y > height + 100) {
                this.dead = true;
            }

            if (Math.random() < 0.015 && this.size > 2) {
                const branchAngle = this.angle + (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5);
                roots.push(new Root(this.x, this.y, branchAngle, this.size * 0.8));
            }
        }
    }

    function animate() {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = isHovering ? 'rgba(0, 0, 0, 0.01)' : 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';

        for (let i = 0; i < roots.length; i++) {
            roots[i].update();
        }

        requestAnimationFrame(animate);
    }

    animate();

    window.startRootsEffect = function(buttonEl) {
        if (!isHovering) {
            isHovering = true;
            ctx.clearRect(0, 0, width, height);
            roots = [];

            const rect = buttonEl.getBoundingClientRect();
            const startX = rect.left + 20;
            const startY = rect.top + 20;

            for (let i = 0; i < 5; i++) {
                const angle = -Math.PI / 2 - (Math.random() * Math.PI / 2) + (Math.random() * 0.2);
                roots.push(new Root(startX, startY, angle, 6 + Math.random() * 3));
            }
        }
    };

    window.stopRootsEffect = function() {
        isHovering = false;
    };
};

document.addEventListener('DOMContentLoaded', () => {
    window.initRoots();

    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');

    [btnLeft, btnRight].forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (this.classList.contains('show')) {
                window.startRootsEffect(this);
            }
        });

        btn.addEventListener('mouseleave', function() {
            window.stopRootsEffect();
        });
    });
});
