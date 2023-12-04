let newStaffs = [];
const requestUrl = 'https://api.slingacademy.com/v1/sample-data/users';
const tableBody = document.getElementById("table-body");

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
    const genderCell = staff.gender ? createTableCell(staff.gender === "male" ? "мужской" : "женский") : createTableCell('');

    tr.appendChild(createTableCell(staff.id));
    tr.appendChild(createTableCell(staff.first_name));
    tr.appendChild(createTableCell(staff.last_name));
    tr.appendChild(genderCell);
    tr.appendChild(createTableCell(staff.email));
    tr.appendChild(createTableCell(staff.country));
    tr.appendChild(createTableCell(staff.state));
    tr.appendChild(createTableCell(staff.city));
    tr.appendChild(createTableCell(staff.phone));

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

const saveBtnModal = document.querySelector('.save-modal');
let idLastStaff =  Math.max(newStaffs.map(staff => staff.id)) + 1;

function saveModal(event) {
    if (event.target === saveBtnModal) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.id = idLastStaff;
        newStaffs.push(data);

        updateTable(newStaffs);

        toggleModal();
    }
}

document.addEventListener('click', saveModal);

// filter
const filterInput = document.getElementById('filter');
let filteredStaffs = newStaffs;

filterInput.addEventListener('input', function () {
    const inputValue = filterInput.value.toLowerCase().trim();
    filteredStaffs = newStaffs.filter(function (staff) {
        const nameMatch = staff.first_name.toLowerCase().includes(inputValue);
        const emailMatch = staff.email.toLowerCase().includes(inputValue);
        return nameMatch || emailMatch;
    });

    updateTable(filteredStaffs);
});

// api
let limitRequest = 5;
let offsetRequest = 0;
const totalPagesElement = document.getElementById('totalPages');

// Обработчик для кнопки "Следующая страница"
document.getElementById('nextPageButton').addEventListener('click', () => {
    offsetRequest += limitRequest; // Увеличение смещения на размер limit
    sendPaginatedRequest();
});

// Обработчик для кнопки "Предыдущая страница"
document.getElementById('prevPageButton').addEventListener('click', () => {
    if (offsetRequest >= limitRequest) {
        offsetRequest -= limitRequest; // Уменьшение смещения на размер limit, если больше limit
        sendPaginatedRequest();
    } else {
        console.log('Вы на первой странице');
    }
});

function sendPaginatedRequest() {
    sendRequestGet(requestUrl, limitRequest, offsetRequest)
        .then(data => {
            newStaffs = data.users;
            updateTable(newStaffs);
        })
        .catch(err => console.log(err));
}
// Функция для отправки GET запроса с учетом limit и offset
function sendRequestGet(url, limit, offset) {
    return fetch(`${url}?limit=${limit}&offset=${offset}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            return response.json().then(error => {
                const e = new Error('Что-то пошло не так');
                e.data = error;
                throw e;
            });
        });
}

sendPaginatedRequest();