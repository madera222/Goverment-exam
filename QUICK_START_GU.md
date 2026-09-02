# 🚀 ઝટપટ શરુ કરો (Quick Start Guide)

## પ્રથમ પગલું: Files Download કરો

1. **GitHub થી ZIP download કરો** અથવા `git clone` કરો
2. **ZIP extract કરો** → `exam-system` folder મળશે

---

## બીજું પગલું: Server શરુ કરો

### Option 1: Python (સરળતમ)
```bash
cd exam-system
python -m http.server 8000
```

### Option 2: Node.js
```bash
cd exam-system
npx http-server
```

### Option 3: Live Server (VS Code)
- VS Code માં folder ખોલો
- `index.html` પર right-click → "Open with Live Server"

---

## ત્રીજું પગલું: Browser ખોલો
```
http://localhost:8000
```

**બસ! તમારો exam system તૈયાર છે! ✅**

---

## પ્રશ્નો કેવી રીતે ઉમેરવા

### 150 પ્રશ્ના માટે:

**`data/questions.json`** ખોલો અને structure અનુસાર પ્રશ્નો ઉમેરો:

```json
{
  "id": 999,
  "question": "તમારો પ્રશ્ન",
  "options": ["વિકલ્પ 1", "વિકલ્પ 2", "વિકલ્પ 3", "વિકલ્પ 4"],
  "correctAnswer": 0,
  "category": "category"
}
```

**ધ્યાન:** `correctAnswer` index છે (0 = પ્રથમ વિકલ્પ)

---

## 15-20 Exams કેવી રીતે કામ કરે છે

```
Exam Set 1 → પ્રશ્નો order 1 (પણ unique shuffle)
Exam Set 2 → પ્રશ્નો order 2 (અલગ shuffle)
...
Exam Set 20 → પ્રશ્નો order 20 (પણ અલગ order)
```

દરેક exam unique પણ reproducible છે (ફરી run કર્યા તો સમાન આવશે)

---

## સ્કોર્સ જણાવતી જવાબ

| જવાબ | પોઈન્ટ |
|------|---------|
| ✓ સાચો | +1.00 |
| ✗ ખોટો | -1.33 |
| ⊘ ખાલી | 0.00 |

---

## Customization આઈડિયા

### ✏️ Timer બદલવો
`index.html` માં:
```html
<input type="number" id="timeInput" value="30">
```
30 બદલીને તમારો સમય લખો (મિનિટમાં)

### 🎨 Color બદલવો
`style.css` માં:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
તમારા પોતાના colors વાપરો

### 📝 Negative marking બદલવો
`script.js` માં `calculateScore()` માં:
```javascript
totalScore -= 1.33;  // આ નંબર બદલો
```

---

## Troubleshooting

❌ **Questions લોડ નથી થતા?**
- Browser console (F12) માં error જોવો
- `data/questions.json` ચેક કરો (valid JSON છે?)

❌ **Exam start નથી થતો?**
- Exam Set પસંદ કર્યો છે?
- Time valuable છે?

❌ **Scores calculate નથી થતા?**
- JavaScript enable છે?
- Console errors ચેક કરો

---

## GitHub પર Push કરવું

```bash
git add .
git commit -m "Exam System"
git push origin main
```

---

## 🎉 તમારો Exam System તૈયાર છે!

હવે તમે:
- ✅ 150 પ્રશ્નો ઉમેરી શકો
- ✅ 20 અલગ exam sets બના શકો
- ✅ Negative marking લાગુ છે
- ✅ Gujarati interface છે
- ✅ Results download કરી શકો

**Happy Testing! 📚✨**
