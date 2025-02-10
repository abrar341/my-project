document.addEventListener("DOMContentLoaded", () => {
    const gradientBackground = document.querySelector(".gradient-background");
    const blobContainer = document.querySelector(".blob-container");
    const blobCountInput = document.getElementById("blob-count");
    const blobCountValue = document.getElementById("blob-count-value");
    const gradientSpeedInput = document.getElementById("gradient-speed");
    const gradientSpeedValue = document.getElementById("gradient-speed-value");
    const blobOpacityInput = document.getElementById("blob-opacity");
    const blobOpacityValue = document.getElementById("blob-opacity-value");
    const menuOpacityInput = document.getElementById("menu-opacity");
    const menuOpacityValue = document.getElementById("menu-opacity-value");
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    const menuToggle = document.getElementById("menu-toggle");
    const controls = document.querySelector(".controls");
    const header = document.querySelector(".header");
    const blobToggle = document.getElementById("blob-toggle");
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    let darkMode = false;
    let blobCount = 5;
    let gradientSpeed = 60;
    let blobOpacity = 0.5;
    let menuOpacity = 0.4;
    let hideCursorTimeout;
    let hideControlsTimeout;

    const HIDE_CURSOR_DELAY = 3000;
    const HIDE_CONTROLS_DELAY = 3000;

    function createBlob(isGradient) {
        const blob = document.createElement("div");
        blob.classList.add("blob");
        const size = 200 * Math.random() + 150;
        blob.style.width = `${size}px`;
        blob.style.height = `${size}px`;
        blob.style.left = `${100 * Math.random()}%`;
        const floatDuration = 10 * Math.random() + 15;
        const deformDuration = 4 * Math.random() + 6;
        blob.style.animationDuration = `${floatDuration}s, ${deformDuration}s`;
        blob.style.animationDelay = `0s, ${5 * Math.random()}s`;
        const borderRadius = 10 * Math.random() + 45;
        blob.style.borderRadius = `${borderRadius}% ${100 - borderRadius}% ${borderRadius}% ${100 - borderRadius}%`;

        if (isGradient) {
            blob.classList.add("gradient-blob");
            const color1 = getRandomColor(darkMode, true);
            const color2 = getRandomColor(darkMode, true);
            blob.style.background = `radial-gradient(circle at center, ${color1}, ${color2})`;
        } else {
            blob.classList.add("normal-blob");
            // No need to set background color here, it's handled in CSS
        }

        blobContainer.appendChild(blob);
        blob.addEventListener("animationend", (e) => {
            if (e.animationName === "float") {
                blob.remove();
            }
        });
    }

    function getRandomColor(isDarkMode, isGradient) {
        if (!isGradient) {
            return isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.8)';
        }
        const hue = Math.floor(360 * Math.random());
        return `hsla(${hue}, ${isDarkMode ? "30%" : "70%"}, ${isDarkMode ? "20%" : "80%"}, 0.8)`;
    }

    function updateBlobCount() {
        const currentBlobCount = blobContainer.children.length;
        blobCount = parseInt(blobCountInput.value);
        blobCountValue.textContent = blobCount;
        const isGradient = blobToggle.checked;
        if (blobCount > currentBlobCount) {
            for (let i = 0; i < blobCount - currentBlobCount; i++) {
                createBlob(isGradient);
            }
        } else if (blobCount < currentBlobCount) {
            for (let i = 0; i < currentBlobCount - blobCount; i++) {
                if (blobContainer.firstChild) {
                    blobContainer.removeChild(blobContainer.firstChild);
                }
            }
        }
    }

    function updateGradientSpeed() {
        gradientSpeed = parseInt(gradientSpeedInput.value);
        gradientSpeedValue.textContent = `${gradientSpeed}s`;
        gradientBackground.style.animation = `gradientShift ${gradientSpeed}s ease infinite`;
    }

    function updateBlobOpacity() {
        blobOpacity = parseFloat(blobOpacityInput.value) / 100;
        blobOpacityValue.textContent = blobOpacity.toFixed(2);
        document.documentElement.style.setProperty("--blob-opacity-1", 0.8 * blobOpacity);
        document.documentElement.style.setProperty("--blob-opacity-2", 0.2 * blobOpacity);
    }

    function updateMenuOpacity() {
        if (menuOpacityInput && menuOpacityValue) {
            menuOpacity = parseFloat(menuOpacityInput.value) / 100;
            menuOpacityValue.textContent = menuOpacity.toFixed(2);
            document.documentElement.style.setProperty("--menu-opacity", menuOpacity);
        }
    }

    function toggleFullscreen() {
        if (document.fullscreenElement) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        }
    }

    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, delay);
        };
    }

    function resetHideControlsTimeout() {
        clearTimeout(hideControlsTimeout);
        if (controls.classList.contains("show")) {
            hideControlsTimeout = setTimeout(hideControls, HIDE_CONTROLS_DELAY);
        }
    }

    function showControls() {
        controls.classList.add("show");
        resetHideControlsTimeout();
    }

    function hideControls() {
        controls.classList.remove("show");
    }

    function showCursor() {
        document.body.classList.remove("cursor-hidden");
        fullscreenBtn.style.opacity = "1";
        fullscreenBtn.style.pointerEvents = "auto";
        menuToggle.style.opacity = "1";
        menuToggle.style.pointerEvents = "auto";
        darkModeToggle.style.opacity = "1";
        darkModeToggle.style.pointerEvents = "auto";
    }

    function hideCursor() {
        if (document.fullscreenElement) {
            document.body.classList.add("cursor-hidden");
            fullscreenBtn.style.opacity = "0";
            fullscreenBtn.style.pointerEvents = "none";
            menuToggle.style.opacity = "0";
            menuToggle.style.pointerEvents = "none";
            darkModeToggle.style.opacity = "0";
            darkModeToggle.style.pointerEvents = "none";
            hideControls();
        }
    }

    function toggleDarkMode() {
        darkMode = !darkMode;
        document.body.classList.toggle("dark-mode", darkMode);
        blobContainer.innerHTML = "";
        updateBlobCount();
    }

    const updateGradientPosition = debounce((e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        gradientBackground.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
    }, 10);

    blobCountInput.addEventListener("input", updateBlobCount);
    gradientSpeedInput.addEventListener("input", updateGradientSpeed);
    blobOpacityInput.addEventListener("input", updateBlobOpacity);
    menuOpacityInput.addEventListener("input", updateMenuOpacity);
    fullscreenBtn.addEventListener("click", toggleFullscreen);
    menuToggle.addEventListener("click", () => {
        controls.classList.contains("show") ? hideControls() : showControls();
    });
    darkModeToggle.addEventListener("click", toggleDarkMode);

    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) {
            fullscreenBtn.textContent = "Exit Fullscreen";
            header.style.display = "none";
            darkModeToggle.style.opacity = "1";
            showCursor();
            clearTimeout(hideCursorTimeout);
            hideCursorTimeout = setTimeout(hideCursor, HIDE_CURSOR_DELAY);
        } else {
            fullscreenBtn.textContent = "Enter Fullscreen";
            header.style.display = "block";
            darkModeToggle.style.opacity = "0";
            showCursor();
            clearTimeout(hideCursorTimeout);
        }
    });

    document.addEventListener("mousemove", (e) => {
        updateGradientPosition(e);
        if (document.fullscreenElement) {
            showCursor();
            clearTimeout(hideCursorTimeout);
            hideCursorTimeout = setTimeout(hideCursor, HIDE_CURSOR_DELAY);
        }
    });

    document.addEventListener("mousedown", showCursor);
    document.addEventListener("keypress", showCursor);

    blobToggle.addEventListener("change", () => {
        blobContainer.innerHTML = "";
        updateBlobCount();
    });

    // Initial setup
    updateBlobCount();
    updateGradientSpeed();
    updateBlobOpacity();
    updateMenuOpacity();

    // Initial blob creation
    for (let i = 0; i < blobCount; i++) {
        createBlob(blobToggle.checked);
    }
});
