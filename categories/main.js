let categoriesList = [];

if (!localStorage.getItem("categoriesList")) {
    localStorage.setItem("categoriesList", JSON.stringify(categoriesList));
} else {
    categoriesList = JSON.parse(localStorage.getItem("categoriesList"));
}

// function addCategories(event){
//     event.preventDefault();
//     if(confirm("Bạn Có Muốn Thêm Danh Mục Mới Không?"));

//     let formAddEL = event.target;
//     let Data = getFormData(formAddEL);

//     if(!Data.name || !Data.name.trim()){
//         alert("Danh Mục Không Được Để Trống!");
//         return;
//     }

//     if(categoriesList.find(()))


// }