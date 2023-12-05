const basePOSTURL = 'https://jsonplaceholder.typicode.com/';
const requestUrl = 'https://api.slingacademy.com/v1/sample-data/users';
const tableBody = document.getElementById('table-body');

const modalWindow = document.querySelector('.modal');
const closeModalButton = document.querySelectorAll('.close-modal');

// Modal
const toggleModal = () => {
    modalWindow.classList.toggle('show');
    const form = document.getElementById('form');
    if (modalWindow.classList.contains('show')) {
        form.reset();
    }
};

closeModalButton.forEach((button) => {
    button.addEventListener('click', toggleModal);
});

document.querySelector('.open-modal').addEventListener('click', toggleModal);

// Delete element
const notify = document.querySelector('.toast') || undefined;
const notifyBody = document.getElementById('notifyBody');

const createDeleteButton = (staff) => {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    return deleteButton;
};

const handleRemove = async (id) => {
    try {
        const response = await fetch(`${basePOSTURL}/users/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showNotification(`Элемент ${id} удален`);
        } else {
            showNotification(`Не удалось удалить элемент ${id}`);
        }
    } catch (error) {
        console.error('Error deleting element:', error);
        showNotification('Произошла ошибка при удалении элемента');
    }
};

const showNotification = (message) => {
    if (notify) {
        notify.classList.add('show');
        notifyBody.textContent = message;

        setTimeout(() => {
            notify.classList.remove('show');
        }, 3000);
    }
};

//Create table
const createTableCell = (content) => {
    const td = document.createElement('td');
    td.textContent = content;
    return td;
};

const createTableRow = (staff) => {
    const tr = document.createElement('tr');
    const genderCell = staff.gender ? createTableCell(staff.gender === 'male' ? 'мужской' : 'женский') : createTableCell('');
    const deleteButtonCell = document.createElement('td');

    tr.appendChild(createTableCell(staff.id));
    tr.appendChild(createTableCell(staff.first_name));
    tr.appendChild(createTableCell(staff.last_name));
    tr.appendChild(genderCell);
    tr.appendChild(createTableCell(staff.email));
    tr.appendChild(createTableCell(staff.country));
    tr.appendChild(createTableCell(staff.state));
    tr.appendChild(createTableCell(staff.city));
    tr.appendChild(createTableCell(staff.phone));

    deleteButtonCell.setAttribute('valign', 'middle');
    const deleteBtn = createDeleteButton(staff);
    deleteBtn.addEventListener('click', () => {
        handleRemove(staff.id);
    });
    deleteButtonCell.appendChild(deleteBtn);
    tr.appendChild(deleteButtonCell);

    return tr;
};

const updateTable = (staffs) => {
    tableBody.innerHTML = '';
    staffs.forEach((staff) => {
        tableBody.appendChild(createTableRow(staff));
    });
};

// SaveUser
const saveUser = async (user) => {
    const url = `${basePOSTURL}/users`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            toggleModal();
            return response.json();
        } else {
            throw new Error('Failed to save user');
        }
    } catch (error) {
        console.error('Error saving user:', error);
        showNotification('Произошла ошибка при создании пользователя');
    }
};

const handleSave = async () => {
    const formData = new FormData(document.getElementById('form'));
    const data = Object.fromEntries(formData.entries()) || {};

    const getFormatFunc = {
        default: (value) => value,
    };

    const validation = {
        default: /[a-zA-Zа-яА-Я]{3,30}/,
        email: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/,
        phone: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
    };

    let isValid = true;

    Object.keys(data).forEach((key) => {
        const formatFunc = getFormatFunc[key] || getFormatFunc.default;
        const regex = validation[key] || validation.default;
        const formattedField = formatFunc(data[key]);

        const input = document.getElementsByName(key)[0];

        if (!regex.test(formattedField)) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });

    if (!isValid) {
        return;
    }

    const id = Math.max(...newStaffs.map((elem) => elem.id)) + 1;
    const user = { ...data, id };

    const response = await saveUser(user);

    if (response) {
        showNotification(`Пользователь сохранен с id=${user.id}`);
    } else {
        showNotification('Ошибка в создании пользователя');
    }
};

document.querySelector('.save-modal').addEventListener('click', handleSave);

// Filter
const filterInput = document.getElementById('filter');
let filteredStaffs = [];

filterInput.addEventListener('input', function () {
    const inputValue = filterInput.value.toLowerCase().trim();
    filteredStaffs = newStaffs.filter((staff) => {
        const nameMatch = staff.first_name.toLowerCase().includes(inputValue);
        const emailMatch = staff.email.toLowerCase().includes(inputValue);
        return nameMatch || emailMatch;
    });

    updateTable(filteredStaffs);
});

// API
let limitRequest = 10;
let offsetRequest = 0;

const sendRequestGet = (url, limit, offset) => {
    const queryString = new URLSearchParams({
        limit: limit,
        offset: offset,
    }).toString();

    return fetch(`${url}?${queryString}`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            return response.json().then((error) => {
                const e = new Error('Something went wrong');
                e.data = error;
                throw e;
            });
        });
};

const sendPaginatedRequest = () => {
    sendRequestGet(requestUrl, limitRequest, offsetRequest)
        .then((data) => {
            newStaffs = data.users;
            updateTable(newStaffs);
        })
        .catch((err) => console.log(err));
};

sendPaginatedRequest();

document.getElementById('nextPageButton').addEventListener('click', () => {
    offsetRequest += limitRequest;
    sendPaginatedRequest();
});

document.getElementById('prevPageButton').addEventListener('click', () => {
    if (offsetRequest >= limitRequest) {
        offsetRequest -= limitRequest;
        sendPaginatedRequest();
    } else {
        showNotification('Вы на первой странице');
    }
});
