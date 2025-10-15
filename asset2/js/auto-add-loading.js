/**
 * Auto-add Loading Screen to All Pages
 * This script automatically adds the loading screen CSS and JS to any HTML page
 */

(function() {
    'use strict';
    
    // Check if loading screen CSS and JS are already added
    if (document.querySelector('link[href*="loading-screen.css"]') || 
        document.querySelector('script[src*="loading-screen.js"]')) {
        return; // Already added
    }
    
    // Add loading screen CSS
    const loadingCSS = document.createElement('link');
    loadingCSS.rel = 'stylesheet';
    loadingCSS.href = 'asset2/css/loading-screen.css';
    document.head.appendChild(loadingCSS);
    
    // Add loading screen JavaScript
    const loadingJS = document.createElement('script');
    loadingJS.src = 'asset2/js/loading-screen.js';
    document.head.appendChild(loadingJS);
    
})();