# 🔄 Clear Browser Cache - Complete Guide

## Method 1: Hard Refresh (Quick)
1. Open `informasi.html` in your browser
2. Press **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
3. This forces the browser to reload all CSS and JS files

## Method 2: Clear Cache via DevTools (Recommended)
1. Open `informasi.html`
2. Press **F12** to open Developer Tools
3. Right-click the **Refresh button** (next to address bar)
4. Select **"Empty Cache and Hard Reload"**

## Method 3: Clear All Browser Cache
### Chrome:
1. Press **Ctrl + Shift + Delete** (or **Cmd + Shift + Delete** on Mac)
2. Select **"Cached images and files"**
3. Time range: **"All time"**
4. Click **"Clear data"**

### Firefox:
1. Press **Ctrl + Shift + Delete**
2. Select **"Cache"**
3. Click **"Clear Now"**

### Edge:
1. Press **Ctrl + Shift + Delete**
2. Select **"Cached images and files"**
3. Click **"Clear now"**

## Method 4: Disable Cache (For Development)
1. Open Developer Tools (**F12**)
2. Go to **Network** tab
3. Check **"Disable cache"** checkbox
4. Keep DevTools open while testing

## Method 5: Incognito/Private Mode
1. Open a new **Incognito/Private Window**:
   - Chrome: **Ctrl + Shift + N**
   - Firefox: **Ctrl + Shift + P**
2. Navigate to `informasi.html`
3. Test with mobile view (**Ctrl + Shift + M**)

---

## 📱 Mobile View Testing Checklist:
- [ ] DevTools open (**F12**)
- [ ] Device mode enabled (**Ctrl + Shift + M**)
- [ ] Screen width set to **≤480px**
- [ ] Hard refresh completed (**Ctrl + Shift + R**)
- [ ] Scroll to the news carousel section
- [ ] Look at the bottom of the carousel container

---

## ✅ Expected Result:
You should see:
- White text: **"Geser untuk melihat"**
- Three animated white arrows pointing right
- Smooth pulsing animation
- Indicator fades when scrolling
- Indicator reappears after 3 seconds

---

## 🔍 Still Not Working?
Check browser console for errors:
1. Press **F12**
2. Go to **Console** tab
3. Look for any red error messages
4. Share the error messages for further help