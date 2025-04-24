let userList = [];

if (!localStorage.getItem("userList")) {
    localStorage.setItem("userList", JSON.stringify(userList));
} else {
    userList = JSON.parse(localStorage.getItem("userList"));
}

function isValidEmail(email) {
    // Check if email has exactly one '@'
    if ((email.match(/@/g) || []).length !== 1) {
        return false;
    }
    
    // Email format validation using regex
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

function isValidPassword(password) {
    // Password must be at least 8 characters
    if (password.length < 8) {
        return false;
    }
    
    // Password must contain uppercase, lowercase, and number
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumber;
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

function SaveDataToLocal() {
    localStorage.setItem("userList", JSON.stringify(userList));
}

function register(event) {
    event.preventDefault();
    if (!confirm("Bạn Có Muốn Đăng Kí hay Không?")) return;
    
    let formRegisterEL = event.target;
    let data = getFormData(formRegisterEL);

    // Validation: First Name and Last Name must not be empty
    if (!data.firstName || !data.firstName.trim()) {
        alert("Vui lòng nhập First Name!");
        return;
    }
    if (!data.lastName || !data.lastName.trim()) {
        alert("Vui lòng nhập Last Name!");
        return;
    }

    // Validation: Email must be valid
    if (!isValidEmail(data.email)) {
        alert("Vui lòng nhập email hợp lệ!");
        return;
    }

    // Validation: Check for duplicate email
    if (userList.find((userF) => userF.email === data.email)) {
        alert("Email đã tồn tại!");
        return;
    }

    // Validation: Password must meet requirements
    if (!isValidPassword(data.password)) {
        alert("Mật khẩu phải có ít nhất 8 ký tự, chứa chữ hoa, chữ thường và số!");
        return;
    }

    // Validation: Confirm Password must match Password
    if (data.password !== data.confirmPassword) {
        alert("Confirm Password không khớp với Password!");
        return;
    }

    // Add user to userList (excluding confirmPassword)
    const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
    };
    userList.push(userData);

    SaveDataToLocal();

    alert("Đăng ký thành công!");
    window.location.href = "/authen/sign-in.html"; // Redirect to sign-in page

    formRegisterEL.reset();
}

function login(event) {
    event.preventDefault();
    let formLoginEL = event.target;
    let data = getFormData(formLoginEL);

    // Validation: Email and Password must not be empty
    if (!data.email || !data.email.trim()) {
        alert("Vui lòng nhập Email!");
        return;
    }
    if (!data.password || !data.password.trim()) {
        alert("Vui lòng nhập Mật Khẩu!");
        return;
    }

    // Check email and password
    let user = userList.find((userF) => userF.email === data.email && userF.password === data.password);

    if (user) {
        alert("Đăng Nhập Thành Công!");
        window.location.href = "/home/index.html";
        localStorage.setItem("userLogin", JSON.stringify(user));
        formLoginEL.reset();
    } else {
        alert("Email hoặc Mật Khẩu Không Chính Xác!");
    }
}