document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const colorPicker = document.getElementById('colorPicker');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const brightnessValue = document.getElementById('brightnessValue');
    const screenBrightnessSlider = document.getElementById('screenBrightnessSlider');
    const screenBrightnessValue = document.getElementById('screenBrightnessValue');
    const lightingBackground = document.getElementById('lightingBackground');
    const brightnessOverlay = document.getElementById('brightnessOverlay');
    const fullscreenButton = document.getElementById('fullscreenButton');
    const presetColors = document.querySelectorAll('.preset-color');

    // Update lighting function
    function updateLighting() {
        const color = colorPicker.value;
        const brightness = brightnessSlider.value;
        
        // Convert hex to RGB for brightness adjustment
        const r = parseInt(color.substr(1,2), 16);
        const g = parseInt(color.substr(3,2), 16);
        const b = parseInt(color.substr(5,2), 16);
        
        // Apply color brightness
        const factor = brightness / 100;
        const adjustedR = Math.round(r * factor);
        const adjustedG = Math.round(g * factor);
        const adjustedB = Math.round(b * factor);
        
        lightingBackground.style.backgroundColor = 
            `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
        
        brightnessValue.textContent = brightness;
    }

    // Update screen brightness function
    function updateScreenBrightness() {
        const screenBrightness = screenBrightnessSlider.value;
        const overlayOpacity = (100 - screenBrightness) / 100;
        
        brightnessOverlay.style.opacity = overlayOpacity;
        screenBrightnessValue.textContent = screenBrightness;
    }

    // Fullscreen handling
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Keyboard shortcuts
    function handleKeyboardShortcuts(e) {
        const step = 5;
        let newBrightness;
        let newScreenBrightness;

        // Shift + Arrow keys for screen brightness
        if (e.shiftKey) {
            newScreenBrightness = parseInt(screenBrightnessSlider.value);
            if (e.key === 'ArrowUp') {
                newScreenBrightness = Math.min(100, newScreenBrightness + step);
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                newScreenBrightness = Math.max(0, newScreenBrightness - step);
                e.preventDefault();
            }
            if (newScreenBrightness !== parseInt(screenBrightnessSlider.value)) {
                screenBrightnessSlider.value = newScreenBrightness;
                updateScreenBrightness();
            }
        } 
        // Regular Arrow keys for color brightness
        else {
            newBrightness = parseInt(brightnessSlider.value);
            if (e.key === 'ArrowUp') {
                newBrightness = Math.min(100, newBrightness + step);
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                newBrightness = Math.max(0, newBrightness - step);
                e.preventDefault();
            }
            if (newBrightness !== parseInt(brightnessSlider.value)) {
                brightnessSlider.value = newBrightness;
                updateLighting();
            }
        }
    }

    // Event listeners
    colorPicker.addEventListener('input', updateLighting);
    brightnessSlider.addEventListener('input', updateLighting);
    screenBrightnessSlider.addEventListener('input', updateScreenBrightness);
    fullscreenButton.addEventListener('click', toggleFullscreen);
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Preset color buttons
    presetColors.forEach(button => {
        button.addEventListener('click', () => {
            const presetColor = button.dataset.color;
            colorPicker.value = presetColor;
            updateLighting();
        });
    });

    // Initialize with default values
    updateLighting();
    updateScreenBrightness();

    // Update fullscreen button text based on state
    document.addEventListener('fullscreenchange', () => {
        fullscreenButton.textContent = document.fullscreenElement 
            ? 'Exit Fullscreen' 
            : 'Toggle Fullscreen';
    });
});
