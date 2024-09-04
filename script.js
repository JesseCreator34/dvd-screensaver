const dvdLogo = document.getElementById('dvd-logo');
const menu = document.getElementById('menu');
const statistics = document.getElementById('statistics');
const welcomeMenu = document.getElementById('welcome-menu');
const closeWelcomeButton = document.getElementById('closeWelcomeButton');
const dontShowAgainCheckbox = document.getElementById('dontShowAgainCheckbox');
const speedCheckbox = document.getElementById('speedCheckbox');
const colorCheckbox = document.getElementById('colorCheckbox');
const backgroundCheckbox = document.getElementById('backgroundCheckbox');
const logoUploadCheckbox = document.getElementById('logoUploadCheckbox');
const backgroundUpload = document.getElementById('backgroundUpload');
const logoUpload = document.getElementById('logoUpload');
const livePixelsTraveled = document.getElementById('live-pixels-traveled');
const liveSidesHit = document.getElementById('live-sides-hit');
const liveGoldLogosShown = document.getElementById('live-gold-logos-shown');
const liveSpeed = document.getElementById('live-speed');
const liveElapsedTime = document.getElementById('live-elapsed-time');
const showPixelsTraveledCheckbox = document.getElementById('showPixelsTraveled');
const showSidesHitCheckbox = document.getElementById('showSidesHit');
const showGoldLogosShownCheckbox = document.getElementById('showGoldLogosShown');
const showSpeedCheckbox = document.getElementById('showSpeed');
const showElapsedTimeCheckbox = document.getElementById('showElapsedTime');
const cursorHider = document.querySelector('.cursor-hider');
let paused = false;
let speed = 2;
let speedIncreaseFactor = 1.05;
let x = Math.random() * (window.innerWidth - dvdLogo.clientWidth);
let y = Math.random() * (window.innerHeight - dvdLogo.clientHeight);
let dx = speed * 1.35;
let dy = speed;
let prevColor = 'Red';
let pixelsTraveled = 0;
let sidesHit = 0;
let goldLogosShown = 0;
let startTime = Date.now();
let customLogoUploaded = false;
let showPopup = true;

function updatePosition() {
    if (!paused) {
        const prevX = x;
        const prevY = y;
        x += dx;
        y += dy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        pixelsTraveled += distance;
        if (x <= 0 || x >= window.innerWidth - dvdLogo.clientWidth) {
            x = Math.min(Math.max(x, 0), window.innerWidth - dvdLogo.clientWidth);
            dx = -dx;
            sidesHit++;
            if (speedCheckbox.checked) {
                dx *= speedIncreaseFactor;
                dy *= speedIncreaseFactor;
                speed += 0.01;
            }
            if (colorCheckbox.checked && !customLogoUploaded) {
                changeLogo();
            }
        }
        if (y <= 0 || y >= window.innerHeight - dvdLogo.clientHeight) {
            y = Math.min(Math.max(y, 0), window.innerHeight - dvdLogo.clientHeight);
            dy = -dy;
            sidesHit++;
            if (speedCheckbox.checked) {
                dy *= speedIncreaseFactor;
                dx *= speedIncreaseFactor;
                speed += 0.01;
            }
            if (colorCheckbox.checked && !customLogoUploaded) {
                changeLogo();
            }
        }
        dvdLogo.style.left = x + 'px';
        dvdLogo.style.top = y + 'px';
    }
    requestAnimationFrame(updatePosition);
}

function changeLogo() {
    const colors = [
        'Red',
        'Green',
        'Blue',
        'Yellow',
        'Dark_Blue',
        'Orange',
        'Pink',
        'Purple',
        'Turquoise'
    ];
    let randomColor;
    if (Math.random() < 0.001) {
        randomColor = 'gold';
        goldLogosShown++;
    } else {
        do {
            randomColor = colors[Math.floor(Math.random() * colors.length)];
        } while (randomColor === prevColor);
    }
    prevColor = randomColor;
    dvdLogo.src = `colors/${randomColor}.png`;
}

updatePosition();

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        toggleMenu('menu');
    }
    if (event.key === 's') {
        toggleMenu('statistics');
        updateStats();
    }
});

speedCheckbox.addEventListener('change', function () {
    speedIncreaseFactor = this.checked ? 1.05 : 1;
});

colorCheckbox.addEventListener('change', function () {
    changeColor = this.checked;
    if (!customLogoUploaded) {
        changeLogo();
    }
});

backgroundCheckbox.addEventListener('change', function () {
    if (this.checked && !backgroundUpload.files.length) {
        backgroundUpload.click();
        this.checked = false;
    } else {
        resetBackground();
    }
});

backgroundUpload.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.body.style.backgroundImage = `url(${e.target.result})`;
            document.body.style.backgroundSize = 'cover';
            backgroundCheckbox.classList.add('custom-image');
            backgroundCheckbox.checked = true;
        };
        reader.readAsDataURL(file);
    }
});

logoUploadCheckbox.addEventListener('change', function () {
    if (this.checked && !logoUpload.files.length) {
        logoUpload.click();
        this.checked = false;
    } else {
        resetLogo();
    }
});

logoUpload.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            dvdLogo.src = e.target.result;
            logoUploadCheckbox.classList.add('custom-image');
            logoUploadCheckbox.checked = true;
            customLogoUploaded = true;
        };
        reader.readAsDataURL(file);
    }
});

showPixelsTraveledCheckbox.addEventListener('change', function () {
    livePixelsTraveled.style.display = this.checked ? 'block' : 'none';
});

showSidesHitCheckbox.addEventListener('change', function () {
    liveSidesHit.style.display = this.checked ? 'block' : 'none';
});

showGoldLogosShownCheckbox.addEventListener('change', function () {
    liveGoldLogosShown.style.display = this.checked ? 'block' : 'none';
});

showSpeedCheckbox.addEventListener('change', function () {
    liveSpeed.style.display = this.checked ? 'block' : 'none';
});

showElapsedTimeCheckbox.addEventListener('change', function () {
    liveElapsedTime.style.display = this.checked ? 'block' : 'none';
});

function resetBackground() {
    document.body.style.backgroundImage = 'none';
    backgroundCheckbox.classList.remove('custom-image');
    backgroundCheckbox.checked = false;
    customLogoUploaded = false;
    if (!logoUpload.files.length) {
        resetLogo();
    }
}

function resetLogo() {
    dvdLogo.src = 'colors/Red.png';
    logoUploadCheckbox.classList.remove('custom-image');
    logoUploadCheckbox.checked = false;
    customLogoUploaded = false;
    if (colorCheckbox.checked) {
        changeLogo();
    }
}

function toggleMenu(menuId) {
    if (menuId === 'menu') {
        menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
        statistics.style.display = 'none';
    } else if (menuId === 'statistics') {
        statistics.style.display = statistics.style.display === 'none' || statistics.style.display === '' ? 'block' : 'none';
        menu.style.display = 'none';
    }
    cursorHider.style.cursor = menu.style.display === 'none' && statistics.style.display === 'none' ? 'none' : 'auto';
}

function updateStats() {
    livePixelsTraveled.textContent = showPixelsTraveledCheckbox.checked ? `Pixels Traveled: ${Math.floor(pixelsTraveled)}` : '';
    liveSidesHit.textContent = showSidesHitCheckbox.checked ? `Sides Hit: ${sidesHit}` : '';
    liveGoldLogosShown.textContent = showGoldLogosShownCheckbox.checked ? `Gold Logos Shown: ${goldLogosShown}` : '';
    liveSpeed.textContent = showSpeedCheckbox.checked ? `Current Speed: ${speed.toFixed(2)}` : '';
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    liveElapsedTime.textContent = showElapsedTimeCheckbox.checked ? `Elapsed Time: ${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}` : '';
}

setInterval(updateStats, 1000);

// Welcome menu functionality
if (showPopup) {
    welcomeMenu.style.display = 'block';
}

closeWelcomeButton.addEventListener('click', function () {
    welcomeMenu.style.display = 'none';
    if (dontShowAgainCheckbox.checked) {
        showPopup = false;
    }
});
