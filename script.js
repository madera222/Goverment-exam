// Global variables
let allQuestions = {};
let examQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let questionStatus = {};
let examDuration = 105;
let examStartTime = null;
let timerInterval = null;
let examSubmitted = false;
let currentDay = 1;
let attemptData = {};

// Configuration
const TOTAL_DAYS = 20;
const QUESTIONS_PER_DAY = 150;

// Load questions from JSON (Day-wise)
async function loadQuestions() {
    try {
        // Try multiple paths for Vercel compatibility
        let response;
        let data;
        const paths = [
            '/data/questions.json',
            './data/questions.json',
            'data/questions.json'
        ];
        
        for (const path of paths) {
            try {
                response = await fetch(path, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    data = await response.json();
                    console.log(`Successfully loaded from: ${path}`);
                    break;
                }
            } catch (e) {
                console.log(`Failed to load from ${path}, trying next...`);
                continue;
            }
        }
        
        if (!data) {
            throw new Error('Could not load questions from any path');
        }
        
        // Handle both array and object formats
        const questionsArray = Array.isArray(data) ? data : (data.questions || []);
        
        if (questionsArray.length === 0) {
            throw new Error('No questions found in data');
        }
        
        // Initialize questions by day
        for (let day = 1; day <= TOTAL_DAYS; day++) {
            const startIdx = (day - 1) * QUESTIONS_PER_DAY;
            const endIdx = Math.min(day * QUESTIONS_PER_DAY, questionsArray.length);
            allQuestions[day] = questionsArray.slice(startIdx, endIdx);
        }
        
        loadAttemptData();
        renderDaySelection();
        console.log(`Loaded ${questionsArray.length} questions for ${TOTAL_DAYS} days`);
    } catch (error) {
        console.error('Error loading questions:', error);
        console.error('Full error details:', error.message);
        alert('પ્રશ્નો લોડ કરવામાં ભૂલ આવી: ' + error.message);
    }
}

// Attempt Data Management (localStorage)
function loadAttemptData() {
    const stored = localStorage.getItem('examAttempts');
    attemptData = stored ? JSON.parse(stored) : {};
    
    // Initialize for each day
    for (let day = 1; day <= TOTAL_DAYS; day++) {
        if (!attemptData[day]) {
            attemptData[day] = {
                attempts: 0,
                bestScore: 0,
                latestAttempt: null,
                allAttempts: []
            };
        }
    }
    saveAttemptData();
}

function saveAttemptData() {
    localStorage.setItem('examAttempts', JSON.stringify(attemptData));
}

// Day Selection Screen
function renderDaySelection() {
    const dayGrid = document.getElementById('dayGrid');
    dayGrid.innerHTML = '';
    
    for (let day = 1; day <= TOTAL_DAYS; day++) {
        const dayBtn = document.createElement('button');
        dayBtn.className = 'day-button';
        
        const data = attemptData[day] || {};
        const attempts = data.attempts || 0;
        const bestScore = data.bestScore || 0;
        
        dayBtn.innerHTML = `
            <div class="day-label">દિવસ ${day}</div>
            <div class="day-stats">
                <small>પ્રયાસ: ${attempts}</small>
                <small>શ્રેષ્ઠ: ${bestScore.toFixed(1)}</small>
            </div>
        `;
        
        dayBtn.onclick = () => selectDay(day);
        dayGrid.appendChild(dayBtn);
    }
}

function selectDay(day) {
    currentDay = day;
    document.getElementById('dayTitle').textContent = `દિવસ ${day} - પરીક્ષા`;
    
    // પ્રશ્નોની સંખ્યા set કરો
    const questionCount = allQuestions[day]?.length || QUESTIONS_PER_DAY;
    document.getElementById('poolCount').textContent = questionCount;
    document.getElementById('questionCountInput').max = questionCount;
    document.getElementById('questionCountInput').value = Math.min(150, questionCount);
    
    switchScreen('startScreen');
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Start exam
function startExam() {
    const timeInput = parseInt(document.getElementById('timeInput').value);
    const questionCountInput = parseInt(document.getElementById('questionCountInput').value);

    if (!allQuestions[currentDay] || allQuestions[currentDay].length === 0) {
        alert('પ્રશ્નો લોડ થયા નથી। પેજ ફરી લોડ કરો.');
        return;
    }

    if (isNaN(timeInput) || timeInput < 5) {
        alert('વાજબી સમય દાખલ કરો (ઓછામાં ઓછા 5 મિનિટ)');
        return;
    }

    if (isNaN(questionCountInput) || questionCountInput < 1) {
        alert('વાજબી પ્રશ્નોની સંખ્યા દાખલ કરો');
        return;
    }

    // Generate exam set
    examQuestions = shuffleArray([...allQuestions[currentDay]]);
    examQuestions = examQuestions.slice(0, Math.min(questionCountInput, examQuestions.length));
    
    // Initialize
    examDuration = timeInput;
    currentQuestionIndex = 0;
    userAnswers = {};
    questionStatus = {};
    examSubmitted = false;
    
    // Initialize question status
    examQuestions.forEach((_, index) => {
        questionStatus[index] = 'notVisited';
    });

    // Update attempt counter
    attemptData[currentDay].attempts++;
    
    switchScreen('examScreen');
    examStartTime = Date.now();
    startTimer();
    displayQuestion();
}

// Timer
function startTimer() {
    const endTime = examStartTime + (examDuration * 60 * 1000);
    
    timerInterval = setInterval(() => {
        const now = Date.now();
        const remaining = endTime - now;

        if (remaining <= 0) {
            clearInterval(timerInterval);
            submitExam();
            return;
        }

        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        document.getElementById('timerDisplay').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (remaining < 5 * 60 * 1000) {
            document.getElementById('timerDisplay').style.color = '#ff6b6b';
        }
    }, 1000);
}

// Display question
function displayQuestion() {
    const question = examQuestions[currentQuestionIndex];
    
    document.getElementById('questionNumber').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = examQuestions.length;
    
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    document.getElementById('nextBtn').disabled = currentQuestionIndex === examQuestions.length - 1;
    
    document.getElementById('questionText').textContent = question.question;
    
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        
        const inputId = `option_${currentQuestionIndex}_${index}`;
        const isSelected = userAnswers[currentQuestionIndex] === index;
        
        if (isSelected) {
            optionDiv.classList.add('selected');
        }
        
        optionDiv.innerHTML = `
            <input type="radio" id="${inputId}" name="options" value="${index}" 
                ${isSelected ? 'checked' : ''} onchange="selectAnswer(${index})">
            <label for="${inputId}">${option}</label>
        `;
        
        optionDiv.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(optionDiv);
    });
    
    updateStatusCounts();
    updateScore();
    
    if (questionStatus[currentQuestionIndex] === 'notVisited') {
        questionStatus[currentQuestionIndex] = 'attempt';
    }
}

// Select answer
function selectAnswer(answerIndex) {
    userAnswers[currentQuestionIndex] = answerIndex;
    if (questionStatus[currentQuestionIndex] !== 'review') {
        questionStatus[currentQuestionIndex] = 'attempt';
    }
    
    const options = document.querySelectorAll('.option');
    options.forEach((opt, index) => {
        if (index === answerIndex) {
            opt.classList.add('selected');
            opt.querySelector('input').checked = true;
        } else {
            opt.classList.remove('selected');
            opt.querySelector('input').checked = false;
        }
    });
    
    updateStatusCounts();
    updateScore();
}

// Mark for review
function markForReview() {
    questionStatus[currentQuestionIndex] = 'review';
    updateStatusCounts();
    alert('⭐ આ પ્રશ્ન review માટે marked થઇ ગયો');
}

// Navigate questions
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < examQuestions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

// Update status counts
function updateStatusCounts() {
    let attemptCount = 0, reviewCount = 0, notVisitedCount = 0;
    
    Object.values(questionStatus).forEach(status => {
        if (status === 'attempt') attemptCount++;
        else if (status === 'review') reviewCount++;
        else if (status === 'notVisited') notVisitedCount++;
    });
    
    document.getElementById('attemptCount').textContent = attemptCount;
    document.getElementById('reviewCount').textContent = reviewCount;
    document.getElementById('notVisitedCount').textContent = notVisitedCount;
}

// Calculate score
function calculateScore() {
    let totalScore = 0;
    let correct = 0, incorrect = 0, unattempted = 0;
    
    examQuestions.forEach((question, index) => {
        if (!(index in userAnswers)) {
            unattempted++;
        } else if (userAnswers[index] === question.correctAnswer) {
            totalScore += 1;
            correct++;
        } else {
            totalScore -= 1.33;
            incorrect++;
        }
    });
    
    return {
        totalScore: Math.round(totalScore * 100) / 100,
        correct,
        incorrect,
        unattempted,
        percentage: Math.round((correct / examQuestions.length) * 100)
    };
}

// Update score display
function updateScore() {
    const score = calculateScore();
    document.getElementById('scoreDisplay').textContent = score.totalScore.toFixed(2);
}

// Submit exam
function submitExam() {
    if (examSubmitted) return;
    
    clearInterval(timerInterval);
    examSubmitted = true;
    
    const score = calculateScore();
    
    // Update attempt data
    if (score.totalScore > attemptData[currentDay].bestScore) {
        attemptData[currentDay].bestScore = score.totalScore;
    }
    
    attemptData[currentDay].latestAttempt = {
        timestamp: new Date().toLocaleString('gu-IN'),
        score: score.totalScore,
        percentage: score.percentage,
        correct: score.correct,
        incorrect: score.incorrect
    };
    
    attemptData[currentDay].allAttempts.push(attemptData[currentDay].latestAttempt);
    saveAttemptData();
    
    // Display results
    document.getElementById('totalScore').textContent = score.totalScore.toFixed(2);
    document.getElementById('percentage').textContent = score.percentage + '%';
    document.getElementById('correctCount').textContent = score.correct;
    document.getElementById('incorrectCount').textContent = score.incorrect;
    document.getElementById('unattemptedCount').textContent = score.unattempted;
    
    displayDetailedResults();
    switchScreen('resultsScreen');
}

// Display detailed results
function displayDetailedResults() {
    const detailedResults = document.getElementById('detailedResults');
    detailedResults.innerHTML = '';
    
    examQuestions.forEach((question, index) => {
        const resultRow = document.createElement('div');
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        const isUnattempted = !(index in userAnswers);
        
        let statusClass = 'unattempted';
        let statusText = '⊘ ખાલી';
        
        if (!isUnattempted) {
            statusClass = isCorrect ? 'correct' : 'incorrect';
            statusText = isCorrect ? '✓ સાચો' : '✗ ખોટો';
        }
        
        resultRow.className = `result-row ${statusClass}`;
        resultRow.innerHTML = `
            <div class="result-row-question">
                Q${index + 1}. ${question.question} ${statusText}
            </div>
            <div class="result-row-answer">
                <strong>તમારો જવાબ:</strong> ${isUnattempted ? 'કોઈ નહીં' : question.options[userAnswer]}
                <br>
                <strong>સાચો જવાબ:</strong> ${question.options[question.correctAnswer]}
            </div>
        `;
        
        detailedResults.appendChild(resultRow);
    });
}

// Retake exam
function retakeExam() {
    switchScreen('startScreen');
}

// Download results
function downloadResults() {
    const score = calculateScore();
    const timestamp = new Date().toLocaleString('gu-IN');
    
    let csvContent = 'Multi-Day Exam System - પરીક્ષા પરિણામ\n';
    csvContent += `દિવસ,${currentDay}\n`;
    csvContent += `તારીખ,${timestamp}\n`;
    csvContent += `કુલ ગુણ,${score.totalScore.toFixed(2)}\n`;
    csvContent += `પ્રતિશત,${score.percentage}%\n`;
    csvContent += `સાચા,${score.correct}\n`;
    csvContent += `ખોટા,${score.incorrect}\n`;
    csvContent += `ખાલી,${score.unattempted}\n\n`;
    csvContent += `પ્રશ્ન નંબર,પ્રશ્ન,તમારો જવાબ,સાચો જવાબ,સ્થિતિ\n`;
    
    examQuestions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const status = !(index in userAnswers) ? 'ખાલી' : 
                      userAnswer === question.correctAnswer ? 'સાચો' : 'ખોટો';
        const userAnsText = !(index in userAnswers) ? 'કોઈ નહીં' : question.options[userAnswer];
        
        csvContent += `"${index + 1}","${question.question}","${userAnsText}","${question.options[question.correctAnswer]}","${status}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `exam-results-day${currentDay}-${Date.now()}.csv`);
    link.click();
}

// Menu Functions
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function showAttemptHistory() {
    const modal = document.getElementById('attemptHistoryModal');
    const content = document.getElementById('attemptHistoryContent');
    
    let html = `<table class="attempt-table">
        <tr>
            <th>દિવસ</th>
            <th>પ્રયાસ</th>
            <th>શ્રેષ્ઠ સ્કોર</th>
            <th>છેલ્લો પ્રયાસ</th>
        </tr>`;
    
    for (let day = 1; day <= TOTAL_DAYS; day++) {
        const data = attemptData[day];
        const lastAttempt = data.latestAttempt?.timestamp || 'N/A';
        
        html += `<tr>
            <td>દિવસ ${day}</td>
            <td>${data.attempts}</td>
            <td>${data.bestScore.toFixed(1)}</td>
            <td>${lastAttempt}</td>
        </tr>`;
    }
    
    html += '</table>';
    content.innerHTML = html;
    modal.style.display = 'block';
    toggleMenu();
}

function closeAttemptHistory() {
    document.getElementById('attemptHistoryModal').style.display = 'none';
}

function showDaySelection() {
    switchScreen('daySelectionScreen');
    toggleMenu();
}

function showSettings() {
    alert('⚙️ સેટિંગ્સ આપવામાં આવશે આગામી વર્ઝનમાં');
    toggleMenu();
}

function resetData() {
    if (confirm('શું તમે ખાતરી છો? તમાંરા બધા ડેટા delete થઇ જશે!')) {
        localStorage.removeItem('examAttempts');
        location.reload();
    }
}

// Switch screen
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    if (screenId === 'daySelectionScreen') {
        renderDaySelection();
    }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('menu');
    const menuBtn = document.querySelector('.menu-btn');
    if (!e.target.closest('.menu-container')) {
        menu.style.display = 'none';
    }
});
