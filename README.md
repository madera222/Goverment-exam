# 💻 Computer Based Exam System

**ગુજરાતી માં કમ્પ્યુટર આધારિત પરીક્ષા સિસ્ટમ**

આ એક સંપૂર્ણ **Online Exam Platform** છે જ્યાં તમે અલગ અલગ exam sets બના શકો અને ખૂબ જ સરળતાથી પ્રશ્નો બદલી શકો.

## ✨ ફીચર્સ

✅ **15-20 અલગ અલગ Exam Sets** - દરેક વખતે પ્રશ્નો શફલ થાય છે  
✅ **Negative Marking System:**
   - ✓ સાચો જવાબ: **+1**
   - ✗ ખોટો જવાબ: **-1.33**
   - ⊘ ખાલી: **0**

✅ **Real-time Timer** - સમય સુધી પરીક્ષા ચાલે છે  
✅ **Detailed Results** - બધા પ્રશ્નો અને તમારો પ્રતિક્રિયા  
✅ **Download Results** - CSV format માં પરિણામ ડાઉનલોડ કરો  
✅ **Gujarati Interface** - આખો Gujarati માં  
✅ **Responsive Design** - Mobile, Tablet, Desktop પર કામ કરે છે  

---

## 📁 Folder Structure

```
exam-system/
├── index.html          # Main HTML
├── style.css           # Styling
├── script.js           # JavaScript logic
├── README.md           # આ ફાઈલ
└── data/
    └── questions.json  # તમામ પ્રશ્નો અને જવાબો
```

---

## 🚀 શરુ કરવું

### 1. **Files Download કરો**
GitHub થી આ repo ને download કરો અથવા clone કરો:
```bash
git clone https://github.com/your-username/exam-system.git
cd exam-system
```

### 2. **Web Server શરુ કરો**
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000

# Node.js (http-server install કરવાનું પડશે)
http-server
```

### 3. **Browser માં ખોલો**
```
http://localhost:8000
```

---

## ❓ પ્રશ્નો કેવી રીતે સેટ અપ કરવા

### `data/questions.json` Structure:

```json
{
  "questions": [
    {
      "id": 1,
      "question": "પ્રશ્ન લખો",
      "options": [
        "વિકલ્પ 1",
        "વિકલ્પ 2",
        "વિકલ્પ 3",
        "વિકલ્પ 4"
      ],
      "correctAnswer": 0,  // 0-indexed (0 = પ્રથમ વિકલ્પ)
      "category": "category-name"
    }
  ]
}
```

### 150 પ્રશ્નો ઉમેરવા માટે:

1. **`questions.json`** ખોલો
2. દરેક પ્રશ્ન માટે object ઉમેરો
3. File સેવ કરો
4. Browser refresh કરો - બસ થઈ ગયું! ✓

#### Example - 3 પ્રશ્નો:
```json
{
  "questions": [
    {
      "id": 1,
      "question": "HTML નો full form શું છે?",
      "options": ["Hyper Text Markup Language", "High Tech Modern", "Home Tool", "Other"],
      "correctAnswer": 0,
      "category": "web"
    },
    {
      "id": 2,
      "question": "CPU નો કાર્ય શું છે?",
      "options": ["Storage", "Processing", "Graphics", "Network"],
      "correctAnswer": 1,
      "category": "hardware"
    },
    {
      "id": 3,
      "question": "Python કયો language છે?",
      "options": ["Compiled", "Interpreted", "Assembly", "Machine"],
      "correctAnswer": 1,
      "category": "programming"
    }
  ]
}
```

---

## 🎯 Scoring System સમજાવણી

| સ્થિતિ | ગુણ |
|-------|-----|
| ✓ સાચો જવાબ | +1.00 |
| ✗ ખોટો જવાબ | -1.33 |
| ⊘ ખાલી છોડ્યો | 0.00 |

### Example:
```
Total Questions: 30
Correct: 20  → 20 × 1 = 20
Wrong: 7     → 7 × -1.33 = -9.31
Unattempted: 3 → 3 × 0 = 0

Total Score = 20 - 9.31 = 10.69/30
Percentage = (20/30) × 100 = 66.67%
```

---

## 🔧 Exam Sets કેવી રીતે કામ કરે છે

- **Exam Set 1 to 20**: દરેક set અલગ પ્રશ્નો order માં આવે છે
- **Seeded Randomization**: દરેક exam હમેશા નિશ્ચિત ક્રમમાં આવે છે (એક વખતે Exam 5 કરો, બીજી વખતે ફરી Exam 5 કરો - સમાન પ્રશ્નો આવશે પણ અલગ ક્રમમાં)
- **Question Limit**: તમે જેટલા પ્રશ્નો કરવા માંગો તે બદલી શકો

---

## 📝 Customization

### Timer બદલવો:
**index.html** માં:
```html
<input type="number" id="timeInput" value="30" min="5" max="180">
```
- Default: 30 મિનિટ
- Minimum: 5 મિનિટ
- Maximum: 180 મિનિટ

### Negative Marking બદલવો:
**script.js** માં `calculateScore()` function:
```javascript
totalScore -= 1.33;  // આ નંબર બદલો
```

### Exam Sets સંખ્યા વધારવી:
**index.html** માં `examSelect` options ઉમેરો:
```html
<option value="exam21">Exam Set 21</option>
<option value="exam22">Exam Set 22</option>
```

---

## 🎨 UI Customization

### Colors બદલવો:
**style.css** માં primary color:
```css
/* આ colors બદલો */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
border-color: #667eea;
color: #667eea;
```

### Font બદલવો:
```css
font-family: 'તમારું Gujarati Font', sans-serif;
```

---

## 🐛 Troubleshooting

### 🔴 Questions load નથી થતા
- **Solution**: Browser Console (F12) માં errors જોવો
- `questions.json` ખરેખર `data/` folder માં છે કે નહીં તે ચેક કરો

### 🔴 Timer શરુ નથી થતો
- Browser refresh કરો અને exam फिर से start કરો

### 🔴 Scores calculate નથી થતા
- JavaScript console (F12) માં error messages જોવો

---

## 📤 GitHub પર Upload કરવું

```bash
# Repository initialize કરો (પહેલી વાર)
git init
git add .
git commit -m "Initial commit - Exam System"

# Remote add કરો
git remote add origin https://github.com/your-username/exam-system.git

# Push કરો
git push -u origin main
```

---

## 📊 Example Workflow

```
1. Start Browser → http://localhost:8000
2. Exam Set પસંદ કરો (Exam Set 1-20)
3. Time અને Questions set કરો
4. "પરીક્ષા શરુ કરો" બટન દબાવો
5. પ્રશ્નોના જવાબ આપો
6. Navigation અથવા "પરીક્ષા સમાપ્ત કરો" બટન વાપરો
7. Results જોવો અને Download કરો
```

---

## 🎓 Best Practices

✅ **Questions Structure**: JSON valid છે તે ચેક કરો (JSONLint વાપરો)  
✅ **Question Count**: 150 કરતાં વધુ પ્રશ્ના માટે `questions.json` અપડેટ કરો  
✅ **Backup**: Changes કરતાં પહેલા `questions.json` નો backup લો  
✅ **Testing**: થોડા exam sets સાથે test કરો પછી live કરો  

---

## 📧 Support

આમાં કોઈ bug અથવા suggestions માટે:
1. GitHub Issues ખોલો
2. Email કરો: your-email@example.com
3. PR submit કરો

---

## 📄 License

MIT License - Free to use and modify

---

## 🙏 ધન્યવાદ

આ exam system વાપરવા બદલ આભાર! 
આશા છે તમને પસંદ આવશે અને તમારી પરીક્ષાઓ સરળ થશે.

**Happy Studying! 📚✨**
