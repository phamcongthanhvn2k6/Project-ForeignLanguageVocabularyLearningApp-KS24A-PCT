let learnedCount = 0; // Biến lưu số từ đã học
let learnedWords = []; // Mảng lưu trạng thái các từ đã học
let filteredVocabulary = []; // Biến toàn cục lưu danh sách đã lọc

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


function renderCategoryOptions() {
    const categorySelect = document.querySelector("#categorySelect");
    const categoriesList = JSON.parse(localStorage.getItem("categoriesList")) || [];
    console.log(categoriesList);
    // Xóa các option cũ (nếu có)
    categorySelect.innerHTML = '<option value="0">ALL Category</option>';

    // Thêm các option từ categoriesList
    categoriesList.forEach((category, index) => {
        const option = document.createElement("option");
        option.value = index + 1; // Giá trị của option
        option.textContent = category.name; // Tên danh mục
        categorySelect.appendChild(option);
    });
}

// Gọi hàm khi trang tải
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#categorySelect").addEventListener("change", filterVocabularyByCategory);

    // Gọi hàm render danh mục và hiển thị từ vựng mặc định
    renderCategoryOptions(); // Render danh mục vào <select>
    filterVocabularyByCategory(); // Hiển thị tất cả từ vựng ban đầu
    renderFlashcard();// Hiển thị từ vựng đầu tiên trên flashcard
    updateProgressBar();    // Cập nhật thanh tiến độ
});

document.querySelector("#card").addEventListener("click", function () {
    this.classList.toggle("flipped"); // Thêm hoặc xóa class "flipped" để quay thẻ
});

function filterVocabularyByCategory() {
    const categorySelect = document.querySelector("#categorySelect");
    if (!categorySelect) {
        console.error("Không tìm thấy phần tử #categorySelect");
        return;
    }

    const selectedCategory = categorySelect.options[categorySelect.selectedIndex].text; // Lấy tên danh mục được chọn
    const vocabularyList = JSON.parse(localStorage.getItem("vocabularyList")) || [];

    // Lọc từ vựng theo danh mục
    filteredVocabulary = selectedCategory === "ALL Category"
        ? vocabularyList // Nếu chọn "ALL Category", hiển thị tất cả
        : vocabularyList.filter(vocab => vocab.categorySelect === selectedCategory);

    console.log("Danh sách từ vựng sau khi lọc:", filteredVocabulary);

    // Reset trạng thái từ đã học
    learnedWords = [];

    // Cập nhật thanh tiến độ
    updateProgressBar(filteredVocabulary);

    // Hiển thị từ đầu tiên trong danh sách đã lọc
    currentIndex = 0;
    renderFlashcard(filteredVocabulary);
    renderData(filteredVocabulary); // Hiển thị danh sách từ vựng đã lọc
}

function renderData(danhSach = vocabularyList) {
    const vocabularyData = document.querySelector("#data");
    let dataHTML = "";

    for (let index = 0; index < danhSach.length; index++) {
        const word = danhSach[index];
        const isLearned = learnedWords.includes(index); // Kiểm tra trạng thái học

        dataHTML += `
        <tr>
            <td>${word.word}</td>
            <td>${word.meaning}</td>
            <td>${word.categorySelect}</td>
            <td class="${isLearned ? "text-success" : "text-danger"}">
                ${isLearned ? "Learned" : "Not Learned"}
            </td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${index})">Delete</button>
            </td>
        </tr>
        `;
    }

    vocabularyData.innerHTML = dataHTML;
}

let currentIndex = 0; // Chỉ số từ vựng hiện tại

function renderFlashcard(danhSach = vocabularyList) {
    if (!danhSach || danhSach.length === 0) {
        // Hiển thị thông báo nếu danh sách trống
        document.querySelector("#front h2").textContent = "No words available";
        document.querySelector("#back h2").textContent = "";
        return;
    }

    // Lấy từ vựng hiện tại
    const currentWord = danhSach[currentIndex];

    // Hiển thị từ vựng lên flashcard
    document.querySelector("#front h2").textContent = currentWord.word;
    document.querySelector("#back h2").textContent = currentWord.meaning;
}

function showNextWord(danhSach = vocabularyList) {
    if (!danhSach || danhSach.length === 0) {
        console.error("No words available.");
        return;
    }
    currentIndex = (currentIndex + 1) % danhSach.length; // Chuyển sang từ tiếp theo
    renderFlashcard(danhSach);
}

function showPreviousWord(danhSach = vocabularyList) {
    if (!danhSach || danhSach.length === 0) {
        console.error("No words available.");
        return;
    }
    currentIndex = (currentIndex - 1 + danhSach.length) % danhSach.length; // Quay lại từ trước đó
    renderFlashcard(danhSach);
}

function updateProgressBar(danhSach = filteredVocabulary) {
    const totalWords = danhSach.length;

    // Đảm bảo learnedWords không vượt quá số lượng từ hiện tại
    const validLearnedWords = learnedWords.filter(index => index < totalWords);

    const progressPercentage = totalWords > 0 ? (validLearnedWords.length / totalWords) * 100 : 0;

    const progressBar = document.querySelector("#progress-bar");
    progressBar.style.width = `${progressPercentage}%`; // Cập nhật chiều rộng thanh tiến độ
    progressBar.textContent = `${Math.round(progressPercentage)}%`; // Hiển thị phần trăm

    // Cập nhật chỉ số từ đã học
    const progressText = document.querySelector("#progress-text");
    progressText.textContent = `${validLearnedWords.length}/${totalWords}`; // Hiển thị số từ đã học so với tổng số từ
}

function markAsLearned() {
    const danhSach = filteredVocabulary.length > 0 ? filteredVocabulary : vocabularyList;
    if (danhSach.length === 0) {
        console.error("No words available.");
        return;
    }

    // Kiểm tra nếu từ hiện tại chưa được đánh dấu là "đã học"
    if (!learnedWords.includes(currentIndex)) {
        learnedWords.push(currentIndex); // Thêm chỉ số từ hiện tại vào mảng learnedWords
    }

    // Cập nhật giao diện
    updateProgressBar(danhSach);
    renderData(danhSach);
}

function deleteWord() {
    const danhSach = filteredVocabulary.length > 0 ? filteredVocabulary : vocabularyList;

    if (wordToDeleteIndex !== null && wordToDeleteIndex >= 0 && wordToDeleteIndex < danhSach.length) {
        // Xóa từ khỏi danh sách đã lọc
        const deletedWord = danhSach.splice(wordToDeleteIndex, 1)[0]; // Lưu từ bị xóa để tìm trong danh sách gốc
        console.log(`Deleted word at index ${wordToDeleteIndex}`);
        wordToDeleteIndex = null; // Reset chỉ số từ cần xóa

        // Xóa từ khỏi danh sách gốc (vocabularyList)
        const originalIndex = vocabularyList.findIndex(word => word.word === deletedWord.word);
        if (originalIndex !== -1) {
            vocabularyList.splice(originalIndex, 1);
        }

        // Cập nhật mảng learnedWords
        learnedWords = learnedWords
            .filter(index => index !== wordToDeleteIndex) // Loại bỏ chỉ số từ đã xóa
            .map(index => (index > wordToDeleteIndex ? index - 1 : index)); // Điều chỉnh chỉ số còn lại

        // Lưu danh sách đã cập nhật vào localStorage
        localStorage.setItem("vocabularyList", JSON.stringify(vocabularyList));

        // Cập nhật danh sách đã lọc (filteredVocabulary)
        if (filteredVocabulary.length > 0) {
            filteredVocabulary = danhSach;
        }

        // Cập nhật giao diện
        renderData(danhSach);
        updateProgressBar(danhSach); // Gọi hàm cập nhật thanh tiến độ

        // Nếu từ bị xóa là từ hiện tại, cập nhật flashcard
        if (currentIndex >= danhSach.length) {
            currentIndex = 0; // Reset về từ đầu nếu vượt quá danh sách
        }
        hideDeleteModal();
        renderFlashcard(danhSach);
    }
}

function openDeleteModal(index) {
    wordToDeleteIndex = index; // Lưu chỉ số từ cần xóa
    const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
    deleteModal.show();
}

function hideDeleteModal() {
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
    if (deleteModal) {
        deleteModal.hide(); // Ẩn modal
    }
}


