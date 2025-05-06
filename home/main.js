document.addEventListener("DOMContentLoaded", () => {
    checkAuthen();
    renderHeaderAndBody();
});

function saveToLocalStorage(key, value) {
    if (!key || value === undefined) {
        console.error("Key hoặc value không hợp lệ!");
        return;
    }
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`Dữ liệu đã được lưu vào localStorage với key: ${key}`);
}

function getFormData(formEL) {
    let data = {};
    for (element of formEL.elements) {
        if (element.name !== "") {
            data[element.name] = element.value;
        }
    }
    return data;
}

function redirectToQuizPage(){
    window.location.href = "/quizz/index.html";
}

// Chuyển hướng tới trang đăng nhập
function redirectToFileSignIn() {
    window.location.href = "/authen/sign-in.html";
}

// Chuyển hướng tới trang đăng ký
function redirectToFileSignUp() {
    window.location.href = "/authen/sign-up.html";
}

// Chuyển hướng tới trang quản trị
function redirectToAdminPage() {
    window.location.href = "/admin/index.html";
}

// Kiểm tra trạng thái đăng nhập
let userLogin = null;

function checkAuthen() {
    const userData = localStorage.getItem("userLogin");
    userLogin = userData ? JSON.parse(userData) : null;
}

// Hiển thị thông tin trên header và body
function renderHeaderAndBody() {
    const userBoxEL = document.querySelector("#userBox");
    const bodyDivEL = document.querySelector("#textCenter"); // Thẻ div trong body

    if (!userBoxEL) {
        console.log("Phần tử #userBox không được tìm thấy!");
        return;
    }

    if (!bodyDivEL) {
        console.log("Phần tử #textCenter không được tìm thấy!");
        return;
    }

    if (userLogin) {
        const firstName = userLogin.firstName || "First";
        const lastName = userLogin.lastName || "Last";

        userBoxEL.innerHTML = `
        <div id="headerUser">
            <p id=userName>Hello ${firstName} ${lastName}!</p>
            <div id="buttonUser">
                <button id="logout" onclick="logout()">Logout</button>
                <button id="adminButton" onclick="redirectToAdminPage()">Go to Admin page</button>
            </div>
        </div>
        `;

        bodyDivEL.innerHTML = `
        <div id="contentCenter">
            <h1>Chào Mừng bạn đã quay lại học, ${firstName} ${lastName}!</h1>
            <p>Tiếp Tục học từ vụng và cải thiện kỹ năng của bạn ngày hôm nay.</p>
            <button onclick="redirectToQuizPage()" id="buttonQuiz">Làm Quiz</button>
        </div>
        `;
    } else {
        userBoxEL.innerHTML = `
            
        `;

        bodyDivEL.innerHTML = `
            <h1>Welcome to our VocabApp!</h1>
            <p>Learn and practice vocabulary with flashcards and quizzes.</p>
            <div>
                <button id="getStartedButton" onclick="redirectToFileSignIn()">Get Started</button>
                <button id="CreateAccountButton" onclick="redirectToFileSignUp()">Create Account</button>
            </div>
        `;
    }
}

// Hàm đăng xuất
function logout() {
    if(confirm("Bạn Có Muốn Đăng Xuất Không?")){
        localStorage.removeItem("userLogin"); // Xóa thông tin đăng nhập
        alert("Đã Đăng Xuất Thành Công")
        redirectToFileSignIn();
        }
}

// Kiểm tra định dạng email hợp lệ
function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email) && (email.match(/@/g) || []).length === 1;
}