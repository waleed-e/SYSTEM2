let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let searchInput = document.getElementById('search'); // Added search input
let mood = 'create';
let currentIndex; // Changed variable name from `fake` to `currentIndex`

// Get total
function getTotal() {
    if (price.value) {
        let result = (parseInt(price.value) + parseInt(taxes.value) + parseInt(ads.value)) - parseInt(discount.value);
        total.innerHTML = result;
        total.style.background = '#040';
    } else {
        total.innerHTML = '0';
        total.style.background = '#a00d02';
    }
}

// Create product
let dataPro = localStorage.product ? JSON.parse(localStorage.product) : [];

submit.onclick = function () {
    let newPro = {
        title: title.value,
        price: price.value,
        taxes: taxes.value,
        ads: ads.value,
        discount: discount.value,
        total: total.innerHTML,
        count: count.value,
        category: category.value
    };

    if (mood === 'create') {
        if (newPro.count > 1) {
            for (let i = 0; i < newPro.count; i++) {
                dataPro.push(newPro);
            }
        } else {
            dataPro.push(newPro);
        }
    } else {
        dataPro[currentIndex] = newPro;
        mood = 'create';
        submit.innerHTML = 'Create';
        count.style.display = 'block';
    }

    // Save data
    localStorage.setItem('product', JSON.stringify(dataPro));
    clearData();
    showData();
};

// Clear inputs
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '0';
    total.style.background = '#a00d02';
    category.value = '';
    count.value = '';
}

// Read
function showData() {
    getTotal();
    let table = '';
    
    // Check if dataPro is an array
    if (Array.isArray(dataPro)) {
        for (let i = 0; i < dataPro.length; i++) {
            // Ensure that each item is a valid object and has the necessary properties
            if (dataPro[i] && dataPro[i].count !== undefined) {
                table += `
                <tr>
                    <td>${dataPro[i].count || 'N/A'}</td>
                    <td>${dataPro[i].title || 'N/A'}</td>
                    <td>${dataPro[i].price || 'N/A'}</td>
                    <td>${dataPro[i].taxes || 'N/A'}</td>
                    <td>${dataPro[i].ads || 'N/A'}</td>
                    <td>${dataPro[i].discount || 'N/A'}</td>
                    <td>${dataPro[i].total || 'N/A'}</td>
                    <td><button onclick="updateData(${i})">تحديث</button></td>
                    <td><button onclick="removeData(${i})">حذف</button></td>
                </tr>
                `;
            } else {
                console.warn(`Invalid product data at index ${i}:`, dataPro[i]);
            }
        }
    } else {
        console.warn('dataPro is not an array:', dataPro);
    }
    
    document.getElementById('tbody').innerHTML = table;
    
    let btnDelete = document.getElementById('deleteAll');
    if (dataPro.length > 0) {
        btnDelete.innerHTML = `<button onclick="deleteAll()">حذف الكل (${dataPro.length})</button>`;
    } else {
        btnDelete.innerHTML = `<button disabled>حذف الكل </button>`;
    }
}

// Delete
function removeData(i) {
    dataPro.splice(i, 1);
    localStorage.setItem('product', JSON.stringify(dataPro));
    showData();
}

// Delete All
function deleteAll() {
    localStorage.clear();
    dataPro = [];
    showData();
}

// Update
function updateData(i) {
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    getTotal();
    count.style.display = 'none';
    submit.innerHTML = 'Update';
    mood = 'update';
    currentIndex = i;
    scroll({
        top: 0,
        behavior: "smooth"
    });
}

// Search
searchInput.oninput = function () {
    let searchValue = searchInput.value.toLowerCase();
    let filteredData = dataPro.filter(pro => {
        return pro.title.toLowerCase().includes(searchValue) || pro.category.toLowerCase().includes(searchValue);
    });
    displayData(filteredData);
};

function displayData(data) {
    let table = '';
    for (let i = 0; i < data.length; i++) {
        table += `
        <tr>
            <td>${data[i].count}</td>
            <td>${data[i].title}</td>
            <td>${data[i].price}</td>
            <td>${data[i].taxes}</td>
            <td>${data[i].ads}</td>
            <td>${data[i].discount}</td>
            <td>${data[i].total}</td>
            <td><button onclick="updateData(${i})">تحديث</button></td>
            <td><button onclick="removeData(${i})">حذف</button></td>
        </tr>
        `;
    }
    document.getElementById('tbody').innerHTML = table;
}

// Initial data display
showData();
