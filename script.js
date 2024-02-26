let quizzData;

function startQuizz() {

    if(!isValidInfor()) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    loadData();
}

function isValidInfor() {
    const fullName = document.getElementById('fullName').value;
    const dob = document.getElementById('dob').value;
    const studentId = document.getElementById('studentId').value;
    const classValue = document.getElementById('class').value;

    return fullName && dob && studentId && classValue;
}

function loadData() {
    const jsonFilePath = 'data.json';
    

    fetch('data.json') // Đường dẫn đến file JSON
        .then(response => response.json())
        .then(data => showQuestions(data))
        .catch(error => console.error('Error fetching questions:', error));
}

function showQuestions(data) {
    quizzData = data;

    document.getElementById('student-info').style.display = 'none';

    const quizzContainer = document.getElementById('quizzContainer');
    quizzContainer.style.display = 'block';

    quizzContainer.innerHTML += showTrueFalseQuestions(data.trueFalseQuestions, 1);
    quizzContainer.innerHTML += showOneChoiceQuestions(data.oneChoiceQuestions, 11);
    quizzContainer.innerHTML += showMultipleChoiceQuestions(data.multipleChoiceQuestions, 21);
    quizzContainer.innerHTML += showEssayQuestions(data.essayQuestions, 31);

    quizzContainer.innerHTML += '<button onclick="submitQuizz()">Nộp bài</button>';
}

function showTrueFalseQuestions(data, startIndex = 1) {
    let html = '';

    for (let i = 0; i < data.length; i++) {
        const questionData = data[i];
        const key = i + startIndex;

        html += `<div class="question">Câu hỏi ${key} : ${questionData.question}</div>`;
        html += `<div class="options">`;
        html += `<input type="radio" name="q${key}" value="1"> Đúng`;
        html += `<input type="radio" name="q${key}" value="0"> Sai`;
        html += `</div>`;
    }

    return html;
}

function showOneChoiceQuestions(data, startIndex = 1) {
    let html = '';

    for (let i = 0; i < data.length; i++) {
        const questionData = data[i];
        const key = i + startIndex;

        html += `<div class="question">Câu hỏi ${key}: ${questionData.question}</div>`;
        html += `<div class="options">`;
        questionData.answers.forEach((option, index) => {
            html += `<input type="radio" name="q${key}" value="${index}"> ${option}`;
        });
        html += `</div>`;
    }

    return html;
}

function showMultipleChoiceQuestions(data, startIndex = 1) {
    let html = '';

    for (let i = 0; i < data.length; i++) {
        const questionData = data[i];
        const key = i + startIndex;

        html += `<div class="question">Câu hỏi ${key}: ${questionData.question}</div>`;
        html += `<div class="options">`;
        questionData.answers.forEach((option, index) => {
            html += `<input type="checkbox" name="q${key}" value="${index}"> ${option}`;
        });
        html += `</div>`;
    }

    return html;
}

function showEssayQuestions(data, startIndex = 1) {
    let html = '';

    for (let i = 0; i < data.length; i++) {
        const questionData = data[i];
        const key = i + startIndex;

        html += `<div class="question">Câu hỏi ${key}: ${questionData.question}</div>`;
        html += `<div class="options">`;
        html += `<textarea name="q${key}" rows="4" cols="50"></textarea>`;
        html += `</div>`;
    }

    return html;
}

function isFinishQuizz() {
    const trueFalseQuestions = document.querySelectorAll('input[type="radio"]');
    const oneChoiceQuestions = document.querySelectorAll('input[type="radio"]');
    const multipleChoiceQuestions = document.querySelectorAll('input[type="checkbox"]');
    const essayQuestions = document.querySelectorAll('textarea');

    const totalQuestions = trueFalseQuestions.length + oneChoiceQuestions.length + multipleChoiceQuestions.length + essayQuestions.length;
    let answeredQuestions = 0;

    trueFalseQuestions.forEach((question) => {
        if (question.checked) {
            answeredQuestions++;
        }
    });

    oneChoiceQuestions.forEach((question) => {
        if (question.checked) {
            answeredQuestions++;
        }
    });

    multipleChoiceQuestions.forEach((question) => {
        if (question.checked) {
            answeredQuestions++;
        }
    });

    essayQuestions.forEach((question) => {
        if (question.value) {
            answeredQuestions++;
        }
    });

    return totalQuestions === answeredQuestions;
}

function getScoreTrueFalseQuestions(startIndex = 1) {
    let score = 0;
    const data = quizzData.trueFalseQuestions;

    for (let i = 0; i < data.length; i++) {
        const questionData = data[i];
        const key = i + startIndex;

        const answer = document.querySelector(`input[name="q${key}"]:checked`);

        if (answer !== null) {
            if(parseInt(answer.value) === questionData.correctAnswer) {
                score++;
            }
        }
    }

    return score;
}

function getScoreOneChoiceQuestions(startIndex = 1) {
    let score = 0;
    const data = quizzData.oneChoiceQuestions;

    for (let i = 0; i < data.length; i++) {
        const questionData = data[i];
        const key = i + startIndex;

        const answer = document.querySelector(`input[name="q${key}"]:checked`);

        if (answer !== null) {
            if(parseInt(answer.value) === questionData.correctAnswer) {
                score++;
            }
        }
    }

    return score;
}

function getScoreMultipleChoiceQuestions(startIndex = 1) {
    let score = 0;
    const data = quizzData.multipleChoiceQuestions;

    for (let i = 0; i < data.length; i++) {
        const questionData = data[i];
        const key = i + startIndex;

        const answers = document.querySelectorAll(`input[name="q${key}"]:checked`);

        if (answers.length === questionData.correctAnswer.length) {
            let isCorrect = true;

            answers.forEach((answer) => {
                if (!questionData.correctAnswer.includes(parseInt(answer.value))) {
                    isCorrect = false;
                }
            });

            if (isCorrect) {
                score++;
            }
        }
    }

    return score;
}

function submitQuizz() {
    if(!isFinishQuizz()) {
        alert('Vui lòng hoàn thành tất cả câu hỏi');
        return;
    }

    const score = getScoreTrueFalseQuestions(1) + getScoreOneChoiceQuestions(11) + getScoreMultipleChoiceQuestions(21);

    alert(`Số câu trắc nghiệm trả lời đúng là : ${score}`);
}
 