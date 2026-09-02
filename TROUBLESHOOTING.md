# 🔧 Troubleshooting Guide - પ્રશ્નો લોડ નથી થતા

## Problem 1: Questions Load થતા નથી (Blank Screen)

### Quick Check:
```
Browser Console (F12) → Console Tab → Errors જુઓ?
```

### Solutions:

#### Solution A: Cache Clear કરો
```
Chrome: Ctrl+Shift+Delete → Clear browsing data
Firefox: Ctrl+Shift+Delete → Clear Everything
Safari: Safari → Preferences → Privacy → Manage Website Data
```

#### Solution B: Vercel Deploy Redeploy કરો
1. Vercel.com પર જાઓ
2. Project પર ક્લિક કરો
3. "Deployments" tab
4. Latest deployment પર click કરો
5. "Redeploy" બટન દબાવો

#### Solution C: data/questions.json Check કરો
```bash
# Local પર test કરો
cd Multi-exam-fixed/data
ls -lh questions.json

# File size સાધારણ હોવો જોઈએ (1MB આસપાસ)
```

---

## Problem 2: "Error loading questions" Message

### Step 1: Console Errors વાંચો
```javascript
// Console માં આ command ચલાવો
fetch('data/questions.json')
  .then(r => console.log('Status:', r.status))
  .then(r => r.json())
  .then(d => console.log('Questions:', d.length || d.questions?.length))
  .catch(e => console.error('Error:', e))
```

### Step 2: Network Tab Check
```
F12 → Network → Refresh Page
data/questions.json લાઇન જુઓ
Status: 200 હોવો જોઈએ (not 404 or 500)
```

### Step 3: Vercel Logs Check
1. Vercel Dashboard પર જાઓ
2. Project → Deployments → Latest
3. "Runtime logs" જુઓ
4. Errors highlight કરો

---

## Problem 3: File Not Found (404 Error)

### Reason: Path Issue

### Fix:
**Option 1: vercel.json Update કરો** (આપણે પહેલાથી કર્યું છે)

**Option 2: Folder Structure Verify**
```bash
# આ command ચલાવો:
ls -la data/questions.json

# Output આવશે:
# -rw-r--r-- ... 1.1M ... questions.json ✅
```

**Option 3: Check GitHub Upload**
```bash
git status
git add .
git commit -m "Fix: Add vercel.json and data folder"
git push
```

---

## Problem 4: CORS Error ("No 'Access-Control-Allow-Origin' header")

### Solution: Already Fixed! ✅

vercel.json માં headers configured છે:
```json
{
  "headers": [
    {
      "source": "/data/:path*",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

---

## Problem 5: Slow Loading (પ્રશ્નો ધીમે લોડ થાય છે)

### Reasons:
1. Network slow છે
2. Questions.json ખુબ મોટો છે (1.1MB)
3. Browser cache issue

### Solutions:
```javascript
// script.js માં આ add કરવું (Performance improvement)
// Uncomment લાઇન 19-40 ખોલો અને આ add કરો:

// Add timeout
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), 10000)
);

const response = await Promise.race([
  fetch(path),
  timeoutPromise
]);
```

---

## Problem 6: Mobile પર Display થતો નથી

### Fix:
```css
/* style.css માં check કરો */
/* Responsive design already configured છે */
```

### Mobile Test:
1. F12 → Device toolbar (mobile view)
2. Different screen sizes test કરો
3. Rotate phone (portrait/landscape)

---

## Complete Debug Process:

### Step 1: Browser Console
```
F12 → Console Tab
```

આ commands ચલાવો:
```javascript
// Check if fetch works
fetch('/data/questions.json').then(r => console.log('Status:', r.status))

// Check file exists
fetch('/data/questions.json').then(r => r.json()).then(d => console.log('Data:', d))

// Check script variable
console.log('allQuestions:', allQuestions)
```

### Step 2: Network Tab
```
F12 → Network Tab
Page Refresh (F5)

જુઓ:
- data/questions.json → Status 200? (હા હોવો જોઈએ)
- Size > 1MB? (હા હોવો જોઈએ)
```

### Step 3: Vercel Logs
```
Vercel Dashboard → Project → Deployments
Latest deployment click કરો
Runtime Logs જુઓ
```

---

## Emergency Fix (If Everything Fails):

### Option A: Redeploy with Fresh Build
```bash
git add .
git commit -m "Emergency redeploy"
git push

# Vercel automatically redeploy થશે
```

### Option B: Check Vercel Build Config
1. Project Settings → Git
2. "Root Directory" = `.` (current)
3. "Framework Preset" = `Other`
4. Save & Redeploy

### Option C: Use Alternative Data Path
Edit script.js line 23-25:
```javascript
const paths = [
  '/data/questions.json',
  './data/questions.json',
  'https://raw.githubusercontent.com/YOUR_USERNAME/multi-exam-reporitry/main/data/questions.json'
];
```

---

## Test Commands (Local):

```bash
# Navigate to project
cd Multi-exam-fixed

# Start local server
python3 -m http.server 8000

# Open browser
# http://localhost:8000

# Check if everything works locally first!
```

---

## Summary Checklist:

- [ ] vercel.json exists
- [ ] data/questions.json exists (1MB+)
- [ ] GitHub push થયું
- [ ] Vercel redeploy થયું
- [ ] Browser cache clear કર્યું
- [ ] F12 Console check કર્યું
- [ ] Network tab Status 200 છે
- [ ] Local test થયું

**એક પણ failure પછી હલ થવું જોઈએ!** ✅

---

## Still Not Working?

Share Console Error Message અને આ information:
1. Error text (screenshot/copy)
2. Network tab screenshot
3. Your Vercel project URL
4. Browser type & version
