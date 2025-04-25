let vocabularyList = [];
let categoriesList = [];
let deleteIndex = -1;

if (!localStorage.getItem("categoriesList")) {
    categoriesList = ["Noun", "Verb", "Adjective"];
    localStorage.setItem("categoriesList", JSON.stringify(categoriesList));
} else {
    categoriesList = JSON.parse(localStorage.getItem("categoriesList"));
}

if (!localStorage.getItem("vocabularyList")) {
    localStorage.setItem("vocabularyList", JSON.stringify(vocabularyList));
} else {
    vocabularyList = JSON.parse(localStorage.getItem("vocabularyList"));
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
    const select = document.querySelector("#wordModal select[name='categorySelect']");
    if (!select) {
        console.error("Không tìm thấy phần tử select.");
        return;
    }
    let DataHTML = "";
    for(let i=0; i<categoriesList.length; i++){
        DataHTML += `<option value="${categoriesList[i].name}">${categoriesList[i].name}</option>`;
    }
    select.innerHTML = DataHTML;
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

renderData();
populateCategories();