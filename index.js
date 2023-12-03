const staffs = [
    {
        id: 101,
        userId: 1,
        name: "John",
        age: 30,
        gender: "male",
        salary: 50000,
        married: false,
        skills: ["html", "css", "js"],
        employment_at: "2020-01-01"
    },
    {
        id: 102,
        name: "Jane",
        age: 25,
        gender: "female",
        salary: 40000,
        married: true,
        skills: ["html", "css", "js", "php"],
        employment_at: "2023-06-21"
    },
    {
        id: 103,
        name: "Bob",
        age: 35,
        gender: "male",
        salary: 60000,
        married: false,
        skills: ["html", "css", "js", "python"],
        employment_at: "2021-03-15"
    },
    {
        id: 104,
        name: "Alice",
        age: 28,
        gender: "female",
        salary: 45000,
        married: true,
        skills: ["html", "css"],
        employment_at: "2022-09-01"
    },
    {
        id: 105,
        name: "Charlie",
        age: 40,
        gender: "male",
        salary: 70000,
        married: true,
        skills: ["html", "css", "js", "python", "java"],
        employment_at: "2020-07-10"
    },
    {
        id: 106,
        name: "Emily",
        age: 32,
        gender: "female",
        salary: 50000,
        married: true,
        skills: ["js", "C++"],
        employment_at: "2023-02-28"
    },
    {
        id: 107,
        name: "David",
        age: 29,
        gender: "male",
        salary: 55000,
        married: true,
        skills: ["html", "css", "js"],
        employment_at: "2021-11-05"
    },
    {
        id: 108,
        name: "Sophia",
        age: 27,
        gender: "female",
        salary: 40000,
        married: true,
        skills: ["html", "css", "js"],
        employment_at: "2022-08-15"
    }
]

let newStaffs = [];

const openModalButton = document.querySelector('.open-modal');
const modalWindow = document.querySelector('.modal');
const closeModalButton = document.querySelectorAll('.close-modal');

function toggleModal() {
    modalWindow.classList.toggle('show');
    const form = document.getElementById('form');
    if (modalWindow.classList.contains('show')) {
        form.reset();
    }
}

closeModalButton.forEach(function (button) {
    button.addEventListener('click', toggleModal);
});

openModalButton.addEventListener('click', toggleModal);

const tableBody = document.getElementById("table-body");

function createDeleteButton(staff) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';

    deleteButton.addEventListener('click', function () {
        const index = newStaffs.indexOf(staff);
        if (index !== -1) {
            newStaffs.splice(index, 1);
            updateTable(newStaffs);
        }
    });

    return deleteButton;
}

function createTableCell(content) {
    const td = document.createElement('td');
    td.textContent = content;
    return td;
}

function createTableRow(staff) {
    const tr = document.createElement('tr');

    tr.appendChild(createTableCell(staff.id));
    tr.appendChild(createTableCell(staff.userId));
    tr.appendChild(createTableCell(staff.name));

    // Проверяем, что поле skills существует и является массивом
    const skillsCell = Array.isArray(staff.skills) ? createTableCell(staff.skills.join(', ')) : createTableCell('');
    tr.appendChild(skillsCell);

    const date = staff.employment_at ? new Date(staff.employment_at) : null;
    tr.appendChild(createTableCell(date ? date.toLocaleDateString("ru-RU") : ''));

    const genderCell = staff.gender ? createTableCell(staff.gender === "male" ? "мужской" : "женский") : createTableCell('');
    tr.appendChild(genderCell);

    const ageCell = staff.age ? createTableCell(staff.age) : createTableCell('');
    tr.appendChild(ageCell);

    const salaryCell = staff.salary ? createTableCell(new Intl.NumberFormat("ru-RU", {
        currency: 'RUB',
        style: 'currency'
    }).format(staff.salary)) : createTableCell('');
    tr.appendChild(salaryCell);

    const titleCell = staff.title ? createTableCell(staff.title) : createTableCell('');
    tr.appendChild(titleCell);

    const bodyCell = staff.body ? createTableCell(staff.body) : createTableCell('');
    tr.appendChild(bodyCell);

    const deleteButtonCell = document.createElement('td');
    deleteButtonCell.setAttribute('valign', 'middle');
    deleteButtonCell.appendChild(createDeleteButton(staff));
    tr.appendChild(deleteButtonCell);

    return tr;
}

function updateTable(staffs) {
    tableBody.innerHTML = '';
    staffs.forEach((staff) => {
        tableBody.appendChild(createTableRow(staff));
    });
}

updateTable(newStaffs);

const saveBtnModal = document.querySelector('.save-modal');
let idLastStaff = Math.max(...staffs.map(staf => staf.id)) + 1;

function saveModal(event) {
    if (event.target === saveBtnModal) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.id = idLastStaff;
        data.skills = data.skills.split(/,\s|,|\s/);

        newStaffs.push(data);

        updateTable(newStaffs);

        toggleModal();
    }
}


document.addEventListener('click', saveModal);

//filter
const filterInput = document.getElementById('filter');
let filteredStaffs = newStaffs;

filterInput.addEventListener('input', function () {
    const inputValue = filterInput.value.toLowerCase().trim();
    filteredStaffs = staffs.filter(function (staff) {
        const nameMatch = staff.name.toLowerCase().includes(inputValue);
        const skillsMatch = staff.skills.some(skill => skill.toLowerCase().includes(inputValue));
        return nameMatch || skillsMatch;
    });

    updateTable(filteredStaffs);
});

const requestUrl = 'https://jsonplaceholder.typicode.com/posts';
function sendRequestGet(method, url) {
    const headers = {
        'Content-Type': 'application/json'
    }
    return fetch(url, {
        method: method,
        headers: headers
    }).then(response => {
        if (response.ok) {
            return response.json()
        }
        return response.json().then(error => {
            const e = new Error('что то пошло не так')
            e.data = error
            throw e
        })
    })
}

sendRequestGet('GET', requestUrl)
    .then(data => {
        newStaffs = [...data,...staffs];
        updateTable(newStaffs);
    })
    .catch(err => console.log(err));


/*function sendRequestPost(method, url, body = null) {
    const headers = {
        'Content-Type': 'application/json'
    }
    return fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: headers
    }).then(response => {
        if (response.ok) {
            return response.json()
        }
        return response.json().then(error => {
            const e = new Error('что то пошло не так')
            e.data = error
            throw e
        })
    })
}

const body = {
    name: 'Vlad',
    age: 23
}
sendRequestPost('POST', requestUrl, body)
    .then(data => console.log(data))
    .catch(err => console.log(err))*/
