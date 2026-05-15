(function () {
    const page = document.body.dataset.page;
    const routes = {
        home: 'sections/home.html',
        lore: 'sections/lore.html'
    };

    let locked = false;
    const transitionDuration = 420;

    function getDirectionClass(nextPage) {
        if (page === 'home' && nextPage === 'lore') return 'page-slide-out-up';
        if (page === 'lore' && nextPage === 'home') return 'page-slide-out-down';
        return 'page-slide-out-up';
    }

    function transitionToUrl(url, directionClass) {
        if (locked) return;

        locked = true;
        try {
            sessionStorage.setItem(
                'pageTransitionDirection',
                directionClass === 'page-slide-out-down' ? 'down' : 'up'
            );
        } catch (error) {
            // Navigation still works if storage is unavailable.
        }
        document.body.classList.add(directionClass);

        window.setTimeout(() => {
            window.location.href = url;
        }, transitionDuration);
    }

    function go(nextPage) {
        if (!routes[nextPage] || locked) return;

        transitionToUrl(
            new URL(routes[nextPage], document.baseURI).href,
            getDirectionClass(nextPage)
        );
    }

    window.navigateWithPageTransition = function (url) {
        transitionToUrl(new URL(url, document.baseURI).href, 'page-slide-out-up');
    };

    const playtestButton = document.getElementById('btnRight');
    if (playtestButton) {
        playtestButton.addEventListener('click', () => {
            window.location.href = new URL('WebGame-main/WebGame-main/index.html', document.baseURI).href;
        });
    }

    const downloadButton = document.getElementById('btnLeft');
    const downloadPanel = document.getElementById('downloadPanel');

    function openDownloadPanel() {
        if (!downloadPanel) return;
        downloadPanel.hidden = false;
    }

    function closeDownloadPanel() {
        if (!downloadPanel) return;
        downloadPanel.hidden = true;
    }

    function downloadLogoImage() {
        const link = document.createElement('a');
        link.href = new URL('Images/Logo.png', document.baseURI).href;
        link.download = 'Logo.png';
        document.body.appendChild(link);
        link.click();
        link.remove();
        closeDownloadPanel();
    }

    if (downloadButton && downloadPanel) {
        downloadButton.addEventListener('click', openDownloadPanel);

        downloadPanel.querySelectorAll('[data-download-close]').forEach((button) => {
            button.addEventListener('click', closeDownloadPanel);
        });

        downloadPanel.querySelectorAll('.download-option').forEach((button) => {
            button.addEventListener('click', downloadLogoImage);
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !downloadPanel.hidden) {
                closeDownloadPanel();
            }
        });
    }

    document.querySelectorAll('a[href]').forEach((link) => {
        const href = link.getAttribute('href');
        const targetPage = Object.keys(routes).find((key) => routes[key] === href);

        if (!targetPage || targetPage === page) return;

        link.addEventListener('click', (event) => {
            event.preventDefault();
            go(targetPage);
        });
    });

    window.addEventListener('pageshow', () => {
        locked = false;
        document.body.classList.remove('page-slide-out-up', 'page-slide-out-down');
    });

    window.addEventListener('wheel', (event) => {
        if (Math.abs(event.deltaY) < 20) return;

        if (page === 'home' && event.deltaY > 0) {
            event.preventDefault();
            go('lore');
            return;
        }

        if (page === 'lore' && event.deltaY < 0 && window.scrollY <= 0) {
            event.preventDefault();
            go('home');
        }
    }, { passive: false });
})();
