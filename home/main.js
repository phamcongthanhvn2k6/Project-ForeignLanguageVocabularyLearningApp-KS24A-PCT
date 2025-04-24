document.addEventListener("DOMContentLoaded", () => {
    checkAuthen();
    renderHeaderAndBody();
});

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
        console.error("Phần tử #userBox không được tìm thấy!");
        return;
    }

    if (!bodyDivEL) {
        console.error("Phần tử #textCenter không được tìm thấy!");
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
            <button id="buttonQuiz">Làm Quiz</button>
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
    localStorage.removeItem("userLogin"); // Xóa thông tin đăng nhập
    window.location.href = "/home/index.html"; // Chuyển hướng về trang chủ
}

// Kiểm tra định dạng email hợp lệ
function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email) && (email.match(/@/g) || []).length === 1;
}