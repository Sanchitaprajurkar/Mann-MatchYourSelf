# Testing Checklist - Performance Fixes

## 🧪 How to Test the Fixes

### Step 1: Clear Browser Cache
```
1. Open Chrome DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
```

### Step 2: Test Scroll Position (CRITICAL)

#### Test A: Homepage Load
1. Open website in new tab: `http://localhost:5173/`
2. ✅ **VERIFY**: Page opens at the very top (hero section visible)
3. ❌ **FAIL IF**: Page opens at footer or middle section

#### Test B: Navigation from Homepage
1. Start at homepage
2. Scroll down to footer
3. Click "Shop" in navbar
4. ✅ **VERIFY**: Shop page opens at top
5. ❌ **FAIL IF**: Shop page opens at bottom

#### Test C: Browser Back Button
1. Navigate: Home → Shop → Product Detail
2. Click browser back button twice
3. ✅ **VERIFY**: Each back action shows page at top
4. ❌ **FAIL IF**: Pages restore old scroll positions

#### Test D: Direct URL Navigation
1. Scroll to bottom of homepage
2. Type new URL in address bar: `http://localhost:5173/blogs`
3. Press Enter
4. ✅ **VERIFY**: Blogs page opens at top
5. ❌ **FAIL IF**: Blogs page opens at bottom

### Step 3: Test Performance

#### Test A: Network Tab Analysis
1. Open DevTools → Network tab
2. Hard reload page (Ctrl+Shift+R)
3. Check "Disable cache" checkbox
4. Reload again
5. ✅ **VERIFY**: 
   - Initial page load < 5MB
   - Video shows "pending" until scrolled near
   - Images below fold show "pending" until scrolled
6. ❌ **FAIL IF**: 
   - Initial load > 10MB
   - All images load immediately

#### Test B: Video Lazy Loading
1. Open homepage
2. Don't scroll - stay at hero section
3. Open Network tab → Filter by "media"
4. ✅ **VERIFY**: Video shows small size (metadata only)
5. Scroll down to video section
6. ✅ **VERIFY**: Video starts loading full content
7. ❌ **FAIL IF**: Full 14MB video loads immediately

#### Test C: Image Lazy Loading
1. Open homepage
2. Open Network tab → Filter by "img"
3. ✅ **VERIFY**: Only hero images load initially
4. Scroll down slowly
5. ✅ **VERIFY**: Images load as you scroll near them
6. ❌ **FAIL IF**: All images load at once

### Step 4: Test Mobile Performance

#### Test A: Mobile Simulation
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select "Slow 3G" throttling
4. Reload page
5. ✅ **VERIFY**: 
   - Page renders within 5 seconds
   - Hero section visible quickly
   - Video doesn't block rendering
6. ❌ **FAIL IF**: 
   - Page takes > 10 seconds
   - Blank screen for long time

### Step 5: Test All Routes

Test scroll-to-top on these routes:
- [ ] `/` (Home)
- [ ] `/shop` (Shop)
- [ ] `/new` (New Arrivals)
- [ ] `/blogs` (Blogs)
- [ ] `/our-story` (Our Story)
- [ ] `/cart` (Cart)
- [ ] `/wishlist` (Wishlist)
- [ ] `/login` (Login)

For each route:
1. Navigate to route
2. ✅ **VERIFY**: Page opens at top
3. Scroll to bottom
4. Navigate to different route
5. ✅ **VERIFY**: New page opens at top

---

## 📊 Performance Metrics to Check

### Before Fixes (Expected):
- Initial load: ~18MB
- Time to interactive: 8-12s (slow 3G)
- Largest Contentful Paint: 6-8s
- First Contentful Paint: 3-5s

### After Fixes (Target):
- Initial load: ~4MB
- Time to interactive: 2-4s (slow 3G)
- Largest Contentful Paint: 2-3s
- First Contentful Paint: 1-2s

### How to Measure:
1. Open DevTools → Lighthouse tab
2. Select "Mobile" device
3. Click "Analyze page load"
4. Check Performance score (target: 80+)

---

## 🐛 Common Issues & Solutions

### Issue: Page still opens at footer
**Solution:**
1. Clear browser cache completely
2. Check browser console for errors
3. Verify ScrollToTop component is imported in main.tsx
4. Try incognito mode

### Issue: Video still loads immediately
**Solution:**
1. Check WhyMannVideo.tsx has `preload="metadata"`
2. Clear cache and hard reload
3. Check Network tab - should show small initial size

### Issue: Images load all at once
**Solution:**
1. Verify `loading="lazy"` attribute exists
2. Test in Chrome (best lazy loading support)
3. Scroll slowly to see progressive loading

### Issue: Performance not improved
**Solution:**
1. Verify all fixes are applied (check git diff)
2. Image files themselves need optimization (see IMAGE_OPTIMIZATION_GUIDE.md)
3. Check for other heavy resources in Network tab

---

## ✅ Success Criteria

All tests pass if:
1. ✅ Page always opens at top (never at footer)
2. ✅ Navigation scrolls to top consistently
3. ✅ Initial page load < 5MB
4. ✅ Video lazy loads (metadata only initially)
5. ✅ Images lazy load (progressive loading)
6. ✅ Mobile performance acceptable (< 5s load)
7. ✅ No broken functionality
8. ✅ No console errors

---

## 📞 If Issues Persist

If after testing you still see issues:

1. **Check browser console** for errors
2. **Verify all files were saved** correctly
3. **Restart dev server**: `npm run dev`
4. **Try different browser** (Chrome recommended)
5. **Check git status**: `git diff` to see changes

---

## 🎯 Quick Test Command

Run this in browser console to verify scroll position:
```javascript
console.log('Scroll position:', window.scrollY);
// Should be 0 on page load
```

Run this to check lazy loading:
```javascript
document.querySelectorAll('img[loading="lazy"]').length;
// Should return number > 0
```

---

## 📝 Report Template

After testing, report results:

```
✅ Scroll Position Tests: PASS/FAIL
✅ Performance Tests: PASS/FAIL
✅ Video Lazy Loading: PASS/FAIL
✅ Image Lazy Loading: PASS/FAIL
✅ Mobile Performance: PASS/FAIL

Issues Found:
- [List any issues]

Performance Metrics:
- Initial Load: [X]MB
- Time to Interactive: [X]s
- Lighthouse Score: [X]/100
```
