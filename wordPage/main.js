let vocabularyList = [
    // Fruits
    { word: "Apple", meaning: "Một loại trái cây ngọt và giòn", categorySelect: "Fruits" },
    { word: "Banana", meaning: "Một loại trái cây dài, cong với vỏ màu vàng", categorySelect: "Fruits" },
    { word: "Orange", meaning: "Một loại trái cây họ cam với vỏ cứng", categorySelect: "Fruits" },

    // Animals
    { word: "Dog", meaning: "Một loài động vật có vú ăn thịt được thuần hóa", categorySelect: "Animals" },
    { word: "Cat", meaning: "Một loài động vật có vú ăn thịt nhỏ được thuần hóa", categorySelect: "Animals" },
    { word: "Elephant", meaning: "Một loài động vật có vú lớn với vòi", categorySelect: "Animals" },

    // Vehicles
    { word: "Car", meaning: "Một phương tiện đường bộ có bốn bánh", categorySelect: "Vehicles" },
    { word: "Bicycle", meaning: "Một phương tiện hai bánh chạy bằng cách đạp", categorySelect: "Vehicles" },
    { word: "Airplane", meaning: "Một phương tiện bay có cánh chạy bằng động cơ", categorySelect: "Vehicles" },

    // Colors
    { word: "Red", meaning: "Màu của máu", categorySelect: "Colors" },
    { word: "Blue", meaning: "Màu của bầu trời", categorySelect: "Colors" },
    { word: "Green", meaning: "Màu của cỏ", categorySelect: "Colors" },

    // Countries
    { word: "Vietnam", meaning: "Một quốc gia ở Đông Nam Á", categorySelect: "Countries" },
    { word: "France", meaning: "Một quốc gia ở Tây Âu", categorySelect: "Countries" },
    { word: "Japan", meaning: "Một quốc gia đảo ở Đông Á", categorySelect: "Countries" },

    // Sports
    { word: "Soccer", meaning: "Một môn thể thao chơi bởi hai đội, mỗi đội 11 người", categorySelect: "Sports" },
    { word: "Basketball", meaning: "Một môn thể thao chơi bởi hai đội, mỗi đội 5 người", categorySelect: "Sports" },
    { word: "Tennis", meaning: "Một môn thể thao chơi bằng vợt và bóng", categorySelect: "Sports" },

    // Technology
    { word: "Computer", meaning: "Một thiết bị điện tử để lưu trữ và xử lý dữ liệu", categorySelect: "Technology" },
    { word: "Smartphone", meaning: "Một chiếc điện thoại di động với các tính năng tiên tiến", categorySelect: "Technology" },
    { word: "Internet", meaning: "Một mạng lưới toàn cầu kết nối hàng triệu mạng riêng", categorySelect: "Technology" },

    // Music
    { word: "Guitar", meaning: "Một nhạc cụ có dây", categorySelect: "Music" },
    { word: "Piano", meaning: "Một nhạc cụ bàn phím lớn", categorySelect: "Music" },
    { word: "Drum", meaning: "Một nhạc cụ gõ", categorySelect: "Music" },

    // Movies
    { word: "Action", meaning: "Một thể loại phim với các cảnh hành động hấp dẫn", categorySelect: "Movies" },
    { word: "Comedy", meaning: "Một thể loại phim nhằm mục đích làm người xem cười", categorySelect: "Movies" },
    { word: "Drama", meaning: "Một thể loại phim với cốt truyện nghiêm túc", categorySelect: "Movies" },

    // Books
    { word: "Novel", meaning: "Một câu chuyện hư cấu dài", categorySelect: "Books" },
    { word: "Biography", meaning: "Một mô tả chi tiết về cuộc đời của ai đó", categorySelect: "Books" },
    { word: "Dictionary", meaning: "Một cuốn sách liệt kê các từ và nghĩa của chúng", categorySelect: "Books" },
];
let deleteIndex = -1;
let categoriesList = [];
// Kiểm tra nếu chưa có dữ liệu trong localStorage
if (!localStorage.getItem("categoriesList")) {
    categoriesList = ["Noun", "Verb", "Adjective"];
    localStorage.setItem("categoriesList", JSON.stringify(categoriesList));
} else {
    categoriesList = JSON.parse(localStorage.getItem("categoriesList"));
}

if (!localStorage.getItem("vocabularyList")) {
    localStorage.setItem("vocabularyList", JSON.stringify(vocabularyList)); // Lưu từ vựng mẫu vào localStorage
} else {
    vocabularyList = JSON.parse(localStorage.getItem("vocabularyList")); // Lấy từ vựng từ localStorage
}

function SaveDataToLocal() {
    localStorage.setItem("vocabularyList", JSON.stringify(vocabularyList));
}

function getFormData(formEL) {
    let data = {};
    for (let element of formEL.elements) {
        if (element.name !== "") {
            data[element.name] = element.value;
        }
    }
    return data;
}

function renderData(danhSach = vocabularyList) {
    const vocabularyData = document.querySelector('#data');
    let dataHTML = "";

    for (let i = 0; i < danhSach.length; i++) {
        dataHTML += `
        <tr>
            <td>${danhSach[i].word}</td>
            <td>${danhSach[i].meaning}</td>
            <td>${danhSach[i].categorySelect}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="LoadCategory(${i})">Sửa</button>
                <button class="btn btn-sm btn-danger" onclick="showDeleteModal(${i})">Xóa</button>
            </td>
        </tr>
        `;
    }
    vocabularyData.innerHTML = dataHTML;
    populateCategories();
}

function showDeleteModal(index) {
    deleteIndex = index;
    document.getElementById("deleteModal").classList.remove("hidden");
}

function closeDeleteModal() {
    document.getElementById("deleteModal").classList.add("hidden");
    deleteIndex = -1;
}

function confirmDelete() {
    if (deleteIndex >= 0) {
        vocabularyList.splice(deleteIndex, 1);
        SaveDataToLocal();
        renderData();
        closeDeleteModal();
    }
}

function showModal() {
    populateCategories();
    document.getElementById("wordModal").classList.remove("hidden");
}

function LoadCategory(index) {
    const voca = vocabularyList[index];
    document.querySelector("[name='editIndex']").value = index;
    document.querySelector("[name='word']").value = voca.word;
    document.querySelector("[name='meaning']").value = voca.meaning;
    document.querySelector("#wordModal [name='categorySelect']").value = voca.categorySelect;
    showModal();
}

function closeEditModal() {
    document.getElementById("wordModal").classList.add("hidden");
    document.querySelector("#editForm").reset();
    document.querySelector("[name='editIndex']").value = "";
}

function handleSubmitVocabulary(event) {
    event.preventDefault();
    const form = event.target;
    const data = getFormData(form);

    if (!data.word || !data.word.trim()) {
        alert("Word không được để trống!");
        return;
    }
    if (!data.meaning || !data.meaning.trim()) {
        alert("Meaning không được để trống!");
        return;
    }
    if (!data.categorySelect) {
        alert("Category không được để trống!");
        return;
    }

    const newWord = data.word.trim();
    const index = data.editIndex !== "" ? parseInt(data.editIndex) : -1;

    const isDuplicate = vocabularyList.some((voca, i) => voca.word === newWord && i !== index);
    if (isDuplicate) {
        alert("Từ này đã tồn tại!");
        return;
    }

    const newVocabulary = {
        word: newWord,
        meaning: data.meaning.trim(),
        categorySelect: data.categorySelect,
    };

    if (index >= 0) {
        vocabularyList[index] = newVocabulary;
    } else {
        vocabularyList.push(newVocabulary);
    }

    SaveDataToLocal();
    renderData();
    form.reset();
    closeEditModal();
}

function populateCategories() {
    const selects = document.querySelectorAll('select[name="categorySelect"]');
    if (!selects.length) {
        console.error("Không tìm thấy phần tử select nào.");
        return;
    }

    // Lặp qua từng thẻ select và thêm các tùy chọn
    selects.forEach(select => {
        // Xóa nội dung cũ
        select.innerHTML = "";

        // Thêm tùy chọn "All Categories" nếu cần
        const allOption = document.createElement("option");
        allOption.value = ""; // Giá trị rỗng để đại diện cho "All Categories"
        allOption.textContent = "All Categories";
        select.appendChild(allOption);

        // Thêm các danh mục từ categoriesList
        categoriesList.forEach(category => {
            const option = document.createElement("option");
            option.value = category.name; // Đặt giá trị chính xác cho tùy chọn
            option.textContent = category.name; // Hiển thị tên danh mục
            select.appendChild(option);
        });
    });
}

populateCategories();

function searchProduct() {
    const searchTerm = document.querySelector('#ip_search').value.toLowerCase();
    const selectedCategory = document.querySelector("select[name='categorySelect']").value;

    let filteredList = vocabularyList.filter(voca => {
        const matchesWord = voca.word.toLowerCase().includes(searchTerm);
        const matchesCategory = !selectedCategory || voca.categorySelect === selectedCategory;
        return matchesWord && matchesCategory;
    });

    renderData(filteredList);
}

function filterByCategory(category) {
    searchProduct();
}

window.onload = function () {
    populateCategories();
    renderData();
};