let vocabularyList = [];
let categoriesList = [];

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

function renderData(danhSach = vocabularyList ) {
    const vocabularyData = document.querySelector('#data');
    let dataHTML = "";

    for (let i = 0; i < vocabularyList.length; i++) {
        dataHTML += `
        <tr>
            <td>${danhSach[i].word}</td>
            <td>${danhSach[i].meaning}</td>
            <td>${danhSach[i].categorySelect}</td>
            <td>
                <button onclick="LoadCategory(${i})">Sửa</button>
                <button onclick="deleteVocabularyData(${i})">Xóa</button>
            </td>
        </tr>
        `;
    }
    vocabularyData.innerHTML = dataHTML;
    populateCategories();
}
renderData();

function deleteVocabularyData(index) {
    if (confirm("Bạn có chắc muốn xóa từ này không?")) {
        vocabularyList.splice(index, 1);
        SaveDataToLocal();
        renderData();
    }
}

function showModal() {
    document.getElementById("wordModal").classList.remove("hidden");
}

function LoadCategory(index) {
    const voca = vocabularyList[index];
    document.querySelector("[name='editIndex']").value = index;
    document.querySelector("[name='word']").value = voca.word;
    document.querySelector("[name='meaning']").value = voca.meaning;
    document.querySelector("[name='categorySelect']").value = voca.categorySelect;

    document.getElementById("wordModal").classList.remove("hidden");
}

function closeEditModal() {
    document.getElementById("wordModal").classList.add("hidden");
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
    form.editIndex.value = "";

    document.getElementById("wordModal").classList.add("hidden");
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

function showModal() {
    populateCategories();
    document.getElementById("wordModal").classList.remove("hidden");
}

function searchProduct() {
    let contentSearch = document.querySelector('#ip_search').value.toLowerCase()

    let arrayResult = []
    for(let i = 0; i < vocabularyList.length; i++) {
        if(vocabularyList[i].word.toLowerCase().includes(contentSearch.toLowerCase())) {
            arrayResult.push(vocabularyList[i])
        }
    }
    renderData(arrayResult)
}
