let categoriesList = [];

if (!localStorage.getItem("categoriesList")) {
    localStorage.setItem("categoriesList", JSON.stringify(categoriesList));
} else {
    categoriesList = JSON.parse(localStorage.getItem("categoriesList"));
}

function SaveDataToLocal() {
    localStorage.setItem("categoriesList", JSON.stringify(categoriesList));
}

function addCategories(event) {
    event.preventDefault();
    if (!confirm("Bạn Có Muốn Thêm Danh Mục Mới Không?")) return;

    let formAddEL = event.target;
    let Data = getFormData(formAddEL);

    if (!Data.name || !Data.name.trim()) {
        alert("Danh Mục Không Được Để Trống!");
        return;
    }

    if (categoriesList.find((cateEL) => cateEL.name === Data.name)) {
        alert("Danh Mục Đã Tồn Tại");
        return;
    }

    const categoriesData = {
        name: Data.name,
        description: Data.description || "Không có mô tả"
    };

    categoriesList.push(categoriesData);
    SaveDataToLocal();
    renderData();
    formAddEL.reset();
}

function renderData() {
    const table = document.querySelector("#data");
    table.innerHTML = "";

    categoriesList.forEach((cate, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cate.name}</td>
            <td>${cate.description}</td>
            <td>
                <button id="addNewBtn" onclick="LoadCategory(${index})">Sửa</button>
                <button id="logout" onclick="deleteCategory(${index})">Xóa</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function deleteCategory(index) {
    if (confirm("Bạn có chắc muốn xóa danh mục này không?")) {
        categoriesList.splice(index, 1);
        SaveDataToLocal();
        renderData();
    }
}

function LoadCategory(index) {
    const cate = categoriesList[index];
    document.getElementById("editIndex").value = index;
    document.getElementById("editName").value = cate.name;
    document.getElementById("editDescription").value = cate.description;

    document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

function saveEdit(event) {
    event.preventDefault();

    const index = document.getElementById("editIndex").value;
    const newName = document.getElementById("editName").value.trim();
    const newDesc = document.getElementById("editDescription").value.trim();

    if (!newName) {
        alert("Tên danh mục không được để trống.");
        return;
    }

    if (categoriesList.some((cate, i) => cate.name === newName && i != index)) {
        alert("Tên danh mục đã tồn tại.");
        return;
    }

    categoriesList[index] = {
        name: newName,
        description: newDesc || "Không có mô tả"
    };

    SaveDataToLocal();
    renderData();
    closeEditModal();
}

renderData();
