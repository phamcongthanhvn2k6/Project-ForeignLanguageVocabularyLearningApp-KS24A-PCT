let categoriesList = [];
let currentPage = 1; // Trang hiện tại
const itemsPerPage = 5; // Số mục trên mỗi trang

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
    updateCountPage(); // Cập nhật số trang
    renderData();
    renderPagin();
    formAddEL.reset();
}

const urlParams = new URLSearchParams(window.location.search);
let curPage = parseInt(urlParams.get('page')) || 1; // Lấy trang hiện tại từ URL, mặc định là 1
const maxItem = 5; // Số mục trên mỗi trang
let countPage = Math.ceil(categoriesList.length / maxItem); // Tổng số trang

const paginBoxEL = document.querySelector(".pagin_box");

function renderPagin() {
    let paginHtml = ``;

    for (let i = 1; i <= countPage; i++) {
        paginHtml += `
            <button onclick="setPage(${i})" style="color: ${i == curPage ? "red" : ""}">${i}</button>
        `;
    }

    paginBoxEL.innerHTML = `
        <button onclick="setPage(${curPage - 1})" ${curPage === 1 ? "disabled" : ""}>Pre</button>
        ${paginHtml}
        <button onclick="setPage(${curPage + 1})" ${curPage === countPage ? "disabled" : ""}>Next</button>
    `;
}

function renderData(danhSach = categoriesList) {
    const startIndex = (curPage - 1) * maxItem;
    const endIndex = startIndex + maxItem;
    const data = danhSach.slice(startIndex, endIndex); // Lấy dữ liệu cho trang hiện tại

    const categoriesData = document.querySelector('#data');
    let dataHTML = "";

    for (let i = 0; i < data.length; i++) {
        dataHTML += `
        <tr>
            <td>${data[i].name}</td>
            <td>${data[i].description}</td>
            <td>
                <button id="addNewBtn" onclick="LoadCategory(${startIndex + i})">Sửa</button>
                <button id="logout" onclick="showDeleteModal(${startIndex + i})">Xóa</button>
            </td>
        </tr>
        `;
    }

    categoriesData.innerHTML = dataHTML;
}

function setPage(pageNumber) {
    if (pageNumber < 1) {
        pageNumber = 1;
    }

    if (pageNumber > countPage) {
        pageNumber = countPage;
    }

    curPage = pageNumber;

    // Cập nhật URL mà không tải lại trang
    window.history.pushState({}, '', `?page=${curPage}`);

    renderData();
    renderPagin();
}

// Gọi hàm khi trang tải
renderData();
renderPagin();

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

function showDeleteModal(index) {
    deleteIndex = index;
    document.getElementById("deleteModal").style.display = "block";
}

function closeDeleteModal() {
    document.getElementById("deleteModal").style.display = "none";
    deleteIndex = -1;
}

function confirmDelete() {
    if (deleteIndex >= 0) {
        categoriesList.splice(deleteIndex, 1);
        SaveDataToLocal();
        updateCountPage(); // Cập nhật số trang
        renderData();
        renderPagin();
        closeDeleteModal();
    }
}

function searchCategories() {
    const searchTerm = document.getElementById("ip_search").value.toLowerCase();
    const filteredList = categoriesList.filter(category => 
        category.name.toLowerCase().includes(searchTerm) || 
        category.description.toLowerCase().includes(searchTerm)
    );

    curPage = 1; // Đặt lại trang hiện tại về 1
    countPage = Math.ceil(filteredList.length / maxItem); // Cập nhật số trang
    renderData(filteredList);
    renderPagin();
}

function paginateData(danhSach = categoriesList) {
    const startIndex = (currentPage - 1) * itemsPerPage; // Vị trí bắt đầu
    const endIndex = startIndex + itemsPerPage; // Vị trí kết thúc
    const paginatedList = danhSach.slice(startIndex, endIndex); // Lấy dữ liệu cho trang hiện tại

    renderData(paginatedList); // Hiển thị dữ liệu đã phân trang
    renderPagination(danhSach.length); // Hiển thị các nút phân trang
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Tổng số trang
    const paginationContainer = document.getElementById("pagination");
    let paginationHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button 
                class="btn ${i === currentPage ? 'btn-primary' : 'btn-secondary'}" 
                onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page; // Cập nhật trang hiện tại
    paginateData(); // Hiển thị dữ liệu cho trang mới
}

function updateCountPage() {
    countPage = Math.ceil(categoriesList.length / maxItem);
}