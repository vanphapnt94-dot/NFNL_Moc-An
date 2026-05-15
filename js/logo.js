document.addEventListener('DOMContentLoaded', () => {
    const video1 = document.getElementById('bgVideo1');
    const video2 = document.getElementById('bgVideo2');

    if (video1 && video2) {
        video1.playbackRate = 0.8;
        video2.playbackRate = 0.8;

        function switchVideo(fromVideo, toVideo) {
            toVideo.classList.add('active');
            toVideo.currentTime = 0;
            toVideo.play();
            toVideo.playbackRate = 0.8;

            fromVideo.classList.remove('active');
            fromVideo.classList.add('outgoing');

            setTimeout(() => {
                fromVideo.classList.remove('outgoing');
                fromVideo.pause();
            }, 1500);
        }

        video1.addEventListener('ended', () => switchVideo(video1, video2));
        video2.addEventListener('ended', () => switchVideo(video2, video1));
    }

    const container = document.getElementById('logoContainer');
    const sceneWrapper = document.querySelector('.scene-wrapper');
    const shadowFloor = document.querySelector('.shadow-floor');

    const numLayers = 10;
    const layerGap = 1;
    const totalThickness = (numLayers - 1) * layerGap;
    const centerOffset = totalThickness / 2;

    for (let i = 0; i < numLayers; i++) {
        const img = document.createElement('img');
        img.src = 'Images/Logo.png';
        img.className = 'logo-layer';
        const zPosition = centerOffset - (i * layerGap);

        if (i === 0) {
            img.style.filter = 'brightness(1.1) drop-shadow(0 0 15px rgba(255,255,255,0.15))';
            img.style.transform = `translateZ(${zPosition}px)`;
        } else if (i === numLayers - 1) {
            img.style.filter = 'brightness(1.1) drop-shadow(0 0 15px rgba(255,255,255,0.15))';
            img.style.transform = `translateZ(${zPosition}px) rotateY(180deg)`;
        } else {
            img.style.backfaceVisibility = 'visible';
            img.style.filter = 'brightness(0.15)';
            img.style.transform = `translateZ(${zPosition}px)`;
        }

        container.appendChild(img);
    }

    container.addEventListener('animationend', function(e) {
        if (e.animationName !== 'spin') return;

        setTimeout(() => {
            if (window.startShrinkAndFly) {
                window.startShrinkAndFly(sceneWrapper, shadowFloor);
            }
        }, 200);
    });
});
