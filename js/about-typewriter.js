(function () {
    const quote = document.getElementById('aboutQuote');
    if (!quote) return;

    const lines = Array.from(quote.querySelectorAll('.type-line'));
    const initialTypingDelay = 500;
    const typingSpeed = 85;
    const lineDelay = 450;
    const bloodDelay = 500;
    const fireDelay = 500;

    function randomBetween(min, max) {
        return min + Math.random() * (max - min);
    }

    function typeLine(line, done) {
        const text = line.dataset.text || '';
        let index = 0;

        line.textContent = '';
        line.classList.add('is-typing');

        function tick() {
            line.textContent = text.slice(0, index);
            index += 1;

            if (index <= text.length) {
                window.setTimeout(tick, typingSpeed);
                return;
            }

            line.classList.remove('is-typing');
            done();
        }

        tick();
    }

    function wrapCharacters() {
        const chars = [];

        lines.forEach((line) => {
            const text = line.textContent;
            line.textContent = '';

            Array.from(text).forEach((character) => {
                const char = document.createElement('span');
                char.className = 'quote-char';
                char.textContent = character === ' ' ? '\u00a0' : character;
                char.style.setProperty('--ash-x', `${randomBetween(-18, 18)}px`);
                char.style.setProperty('--ash-y', `${randomBetween(18, 54)}px`);
                char.style.setProperty('--ash-r', `${randomBetween(-16, 16)}deg`);
                line.appendChild(char);

                if (character !== ' ') {
                    chars.push(char);
                }
            });
        });

        return chars;
    }

    function createFireCanvas(chars, onComplete) {
        const canvas = document.createElement('canvas');
        canvas.className = 'quote-fire-canvas';
        quote.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const flames = [];
        const embers = [];
        const padX = 95;
        const padY = 70;
        let width = 0;
        let height = 0;
        let dpr = 1;
        let quoteRect = null;
        let charRects = [];
        let frameId = null;
        let stopping = false;
        let startTime = 0;

        function resize() {
            quoteRect = quote.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = Math.ceil(quoteRect.width + padX * 2);
            height = Math.ceil(quoteRect.height + padY * 2);

            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            canvas.width = Math.ceil(width * dpr);
            canvas.height = Math.ceil(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            charRects = chars.map((char) => {
                const rect = char.getBoundingClientRect();
                return {
                    x: rect.left - quoteRect.left + padX + rect.width / 2,
                    y: rect.top - quoteRect.top + padY + rect.height * 0.72,
                    width: rect.width,
                    height: rect.height
                };
            });
        }

        function pickCharRect() {
            if (charRects.length === 0) {
                return {
                    x: randomBetween(padX, width - padX),
                    y: height * 0.62,
                    width: 18,
                    height: 44
                };
            }

            return charRects[Math.floor(Math.random() * charRects.length)];
        }

        function spawnFlame(intensity) {
            const rect = pickCharRect();
            const size = randomBetween(10, 30) * intensity;

            flames.push({
                x: rect.x + randomBetween(-rect.width * 0.7, rect.width * 0.7),
                y: rect.y + randomBetween(-4, 14),
                vx: randomBetween(-0.55, 0.55),
                vy: randomBetween(-3.4, -1.65),
                size,
                life: 1,
                decay: randomBetween(0.018, 0.035),
                hue: randomBetween(10, 38),
                tilt: randomBetween(-0.45, 0.45),
                sway: randomBetween(0.02, 0.08),
                phase: randomBetween(0, Math.PI * 2)
            });
        }

        function spawnEmber(intensity) {
            if (Math.random() > 0.38 * intensity) return;

            const rect = pickCharRect();
            embers.push({
                x: rect.x + randomBetween(-rect.width, rect.width),
                y: rect.y + randomBetween(-2, 12),
                vx: randomBetween(-1.5, 1.5),
                vy: randomBetween(-4.5, -1.7),
                life: 1,
                decay: randomBetween(0.018, 0.042),
                size: randomBetween(0.8, 2.6)
            });
        }

        function drawFlame(flame) {
            const alpha = Math.max(flame.life, 0);
            const radius = Math.max(flame.size * alpha, 0);
            if (radius <= 0) return;

            const gradient = ctx.createRadialGradient(
                flame.x,
                flame.y,
                0,
                flame.x,
                flame.y,
                radius
            );

            gradient.addColorStop(0, `rgba(255, 250, 190, ${0.92 * alpha})`);
            gradient.addColorStop(0.16, `hsla(${flame.hue + 30}, 100%, 58%, ${0.86 * alpha})`);
            gradient.addColorStop(0.42, `hsla(${flame.hue}, 100%, 44%, ${0.68 * alpha})`);
            gradient.addColorStop(0.72, `rgba(110, 0, 0, ${0.24 * alpha})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(
                flame.x,
                flame.y,
                radius * 0.42,
                radius * 1.55,
                flame.tilt + Math.sin(flame.phase) * 0.25,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        function drawEmber(ember) {
            const alpha = Math.max(ember.life, 0);
            ctx.fillStyle = `rgba(255, ${Math.floor(randomBetween(130, 220))}, 60, ${alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 80, 0, 0.85)';
            ctx.beginPath();
            ctx.arc(ember.x, ember.y, ember.size * alpha, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        function animate(time) {
            if (!startTime) startTime = time;
            const elapsed = time - startTime;
            const intensity = stopping ? 0 : Math.max(0.25, 1 - elapsed / 4200);

            ctx.clearRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'lighter';

            if (!stopping) {
                const spawnCount = Math.ceil(18 * intensity);
                for (let i = 0; i < spawnCount; i++) {
                    spawnFlame(intensity);
                }
                for (let i = 0; i < 4; i++) {
                    spawnEmber(intensity);
                }
            }

            for (let i = flames.length - 1; i >= 0; i--) {
                const flame = flames[i];
                flame.phase += flame.sway;
                flame.x += flame.vx + Math.sin(flame.phase) * 0.42;
                flame.y += flame.vy;
                flame.vy -= 0.018;
                flame.life -= flame.decay;
                flame.size *= 0.989;

                drawFlame(flame);

                if (flame.life <= 0) {
                    flames.splice(i, 1);
                }
            }

            for (let i = embers.length - 1; i >= 0; i--) {
                const ember = embers[i];
                ember.x += ember.vx;
                ember.y += ember.vy;
                ember.vy += 0.018;
                ember.life -= ember.decay;

                drawEmber(ember);

                if (ember.life <= 0) {
                    embers.splice(i, 1);
                }
            }

            if (stopping && flames.length === 0 && embers.length === 0) {
                canvas.classList.add('is-fading');
                window.setTimeout(() => {
                    canvas.remove();
                    if (typeof onComplete === 'function') {
                        onComplete();
                    }
                }, 650);
                return;
            }

            frameId = window.requestAnimationFrame(animate);
        }

        resize();
        frameId = window.requestAnimationFrame(animate);
        window.addEventListener('resize', resize);

        return {
            stop() {
                stopping = true;
                quote.classList.remove('is-burning');
                quote.classList.add('is-extinguished');
            },
            destroy() {
                if (frameId) {
                    window.cancelAnimationFrame(frameId);
                }
                window.removeEventListener('resize', resize);
                canvas.remove();
            }
        };
    }

    function burnCharacters(chars, fire) {
        chars.forEach((char, index) => {
            const delay = index * 34 + randomBetween(0, 120);

            window.setTimeout(() => {
                char.classList.add('is-scorched');
            }, delay);

            window.setTimeout(() => {
                char.classList.add('is-ash');
            }, delay + randomBetween(650, 980));
        });

        const totalDuration = chars.length * 34 + 2000;
        window.setTimeout(() => fire.stop(), totalDuration);
        window.addEventListener('beforeunload', fire.destroy);
    }

    function beginBurn() {
        const chars = wrapCharacters();
        quote.classList.add('is-burning');
        const fire = createFireCanvas(chars, () => {
            document.dispatchEvent(new CustomEvent('quote:burn-complete'));
        });
        burnCharacters(chars, fire);
    }

    function afterTypingComplete() {
        window.setTimeout(() => {
            quote.classList.add('is-blood');
            window.setTimeout(beginBurn, fireDelay);
        }, bloodDelay);
    }

    function typeNext(index) {
        if (!lines[index]) {
            afterTypingComplete();
            return;
        }

        typeLine(lines[index], () => {
            window.setTimeout(() => typeNext(index + 1), lineDelay);
        });
    }

    window.setTimeout(() => typeNext(0), initialTypingDelay);
})();
