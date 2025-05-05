let vocabularyList = [];
let categoriesList = [];
let quizHistory = [];
let filteredVocabulary = []; // Biến toàn cục để lưu danh sách từ vựng đã lọc
let answeredQuestions = 0; // Biến toàn cục để theo dõi số câu hỏi đã trả lời
let currentQuestionIndex = 0; // Chỉ số câu hỏi hiện tại
let correctAnswers = 0; // Biến toàn cục để theo dõi số câu trả lời đúng
let selectedCategoryName = ""; // Biến toàn cục để lưu tên danh mục được chọn

if (!localStorage.getItem("categoriesList")) {
    localStorage.setItem("categoriesList", JSON.stringify(categoriesList));
} else {
    categoriesList = JSON.parse(localStorage.getItem("categoriesList"));
}

if (!localStorage.getItem("vocabularyList")) {
    localStorage.setItem("vocabularyList", JSON.stringify(vocabularyList));
} else {
    vocabularyList = JSON.parse(localStorage.getItem("vocabularyList"));
}

if (!localStorage.getItem("quizHistory")) {
    localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
} else {
    quizHistory = JSON.parse(localStorage.getItem("quizHistory"));
}

// dap an nhieu
const distractors = ["A fruit", "A vegetable", "A drink", "A tool", "To move quickly", "To sleep"]; // Đáp án nhiễu


console.log(vocabularyList);
console.log(quizHistory);
console.log(categoriesList);

document.addEventListener("DOMContentLoaded", () => {
    renderCategoryOptions();
    renderQuizHistory(quizHistory);
    console.log("Quiz history rendered successfully.", quizHistory);
});
    
function renderCategoryOptions() {
    const categoriesList = JSON.parse(localStorage.getItem("categoriesList")) || [];

    const categorySelect = document.getElementById("categorySelect");
    categorySelect.innerHTML = '<option value="0">ALL Category</option>';

    for (let i = 0; i < categoriesList.length; i++) {
        const option = document.createElement("option");
        option.value = categoriesList[i].name; // Sử dụng `name` làm giá trị
        option.textContent = categoriesList[i].name; // Hiển thị tên danh mục
        categorySelect.appendChild(option);
    }
}

function renderQuestion(vocabularyList, currentQuestionIndex) {
    if (!vocabularyList || currentQuestionIndex >= vocabularyList.length) {
        document.getElementById("quizQuestion").textContent = "Quiz Completed!";
        document.getElementById("quizOptions").innerHTML = ""; // Xóa các tùy chọn
        updateProgressBar(answeredQuestions, vocabularyList.length); // Cập nhật tiến độ khi hoàn thành
        return;
    }

    const currentWord = vocabularyList[currentQuestionIndex];

    // Hiển thị câu hỏi
    document.getElementById("quizQuestion").textContent = `What is the meaning of "${currentWord.word}"?`;

    // Tạo mảng đáp án
    const answers = [currentWord.meaning];
    while (answers.length < 4) {
        const randomDistractor = distractors[Math.floor(Math.random() * distractors.length)];
        if (!answers.includes(randomDistractor)) {
            answers.push(randomDistractor);
        }
    }

    // Đảo ngẫu nhiên mảng đáp án
    for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    // Hiển thị các đáp án
    for (let i = 0; i < 4; i++) {
        const optionElement = document.getElementById(`option${i}`);
        if (optionElement) {
            optionElement.textContent = answers[i];
            optionElement.parentElement.setAttribute(
                "onclick",
                `selectOption(${i}, ${currentQuestionIndex}, '${answers[i]}', '${currentWord.meaning}')`
            );
        }
    }

    // Cập nhật thanh tiến độ
    updateProgressBar(currentQuestionIndex, vocabularyList.length);
}

function renderQuizHistory(quizHistory) {
    const historyTableBody = document.getElementById("history-table-body");

    // Kiểm tra nếu không có lịch sử quiz
    if (!quizHistory || quizHistory.length === 0) {
        historyTableBody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center;">No quiz history available.</td>
            </tr>
        `;
        return;
    }

    // Tạo nội dung bảng lịch sử
    let historyHTML = "";
    for (let i = 0; i < quizHistory.length; i++) {
        historyHTML += `
            <tr>
                <td>${quizHistory[i].date}</td>
                <td>${quizHistory[i].category}</td>
                <td>${quizHistory[i].score}</td>
            </tr>
        `;
    }

    // Gắn nội dung vào bảng
    historyTableBody.innerHTML = historyHTML;
}

function saveQuizHistory(category, correctAnswers, totalQuestions) {
    // Lấy lịch sử quiz từ localStorage
    const quizHistory = JSON.parse(localStorage.getItem("quizHistory")) || [];

    // Tính điểm trên thang điểm 100
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

    // Tạo đối tượng kết quả mới
    const newHistory = {
        date: new Date().toISOString().split("T")[0], // Ngày hiện tại
        category: category || "General", // Danh mục (nếu không có, mặc định là "General")
        score: `${scorePercentage}%`,
    };

    // Thêm kết quả mới vào lịch sử
    quizHistory.push(newHistory);

    // Lưu lại vào localStorage
    localStorage.setItem("quizHistory", JSON.stringify(quizHistory));

    // Hiển thị thông báo
    alert(`Quiz completed! You scored ${scorePercentage}% (${correctAnswers}/${totalQuestions}).`);
}

function selectOption(selectedIndex, currentQuestionIndex, selectedAnswer, correctAnswer) {
    const selectedOption = document.getElementById(`option${selectedIndex}`).parentElement;

    // Kiểm tra đáp án và thêm viền màu
    if (selectedAnswer === correctAnswer) {
        correctAnswers++; // Tăng số câu trả lời đúng
        selectedOption.classList.add("correct"); // Thêm lớp "correct" cho ô đáp án
    } else {
        selectedOption.classList.add("wrong"); // Thêm lớp "wrong" cho ô đáp án
    }

    // Chuyển sang câu hỏi tiếp theo sau một khoảng thời gian ngắn
    setTimeout(() => {
        selectedOption.classList.remove("correct", "wrong"); // Xóa lớp màu
        currentQuestionIndex++;
        if (currentQuestionIndex < filteredVocabulary.length) {
            renderQuestion(filteredVocabulary, currentQuestionIndex);
        } else {
            // Lưu kết quả khi hoàn thành quiz
            updateProgressBar(filteredVocabulary.length, filteredVocabulary.length); // Cập nhật tiến độ khi hoàn thành
            saveQuizHistory(selectedCategoryName, correctAnswers, filteredVocabulary.length);
            document.getElementById("quizQuestion").textContent = "Quiz Completed!";
            document.getElementById("quizOptions").innerHTML = ""; // Xóa các tùy chọn
            renderQuizHistory(JSON.parse(localStorage.getItem("quizHistory")));
        }
    }, 500); // Thời gian chờ 500ms để hiển thị viền màu
}

function startQuiz() {
    const categorySelect = document.getElementById("categorySelect");
    const selectedCategory = categorySelect.value;

    if (selectedCategory === "0") {
        alert("Please select a category to start the quiz.");
        return;
    }

    // Lưu tên danh mục được chọn
    selectedCategoryName = categorySelect.options[categorySelect.selectedIndex].text;

    // Lọc từ vựng theo danh mục
    filteredVocabulary = vocabularyList.filter(
        (vocab) => vocab.categorySelect === selectedCategory
    );

    if (filteredVocabulary.length === 0) {
        alert("No words available for the selected category.");
        return;
    }

    // Đặt lại số câu hỏi đã trả lời
    answeredQuestions = 0;

    // Hiển thị phần quiz
    document.getElementById("quizContainer").hidden = false;

    // Bắt đầu quiz với câu hỏi đầu tiên
    currentQuestionIndex = 0;
    renderQuestion(filteredVocabulary, currentQuestionIndex);

    // Cập nhật thanh tiến độ ban đầu
    updateProgressBar(answeredQuestions, filteredVocabulary.length);
}

function updateProgressBar(answeredQuestions, totalQuestions) {
    const progressPercentage = Math.min((answeredQuestions / totalQuestions) * 100, 100);

    // Cập nhật chiều rộng của thanh tiến độ
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = `${progressPercentage}%`;

    // Cập nhật văn bản hiển thị tiến độ
    const progressText = document.getElementById("progress-text");
    progressText.textContent = `${answeredQuestions}/${totalQuestions}`;
}

function showNextQuestion() {
    if (currentQuestionIndex < filteredVocabulary.length - 1) {
        currentQuestionIndex++;
        renderQuestion(filteredVocabulary, currentQuestionIndex);
    } else {
        alert("You are already at the last question!");
    }
}

function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion(filteredVocabulary, currentQuestionIndex);
    } else {
        alert("You are already at the first question!");
    }
}