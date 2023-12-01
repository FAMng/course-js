const staffs = [
    {
        id: 1,
        name: "John",
        age: 30,
        gender: "male",
        salary: 50000,
        married: false,
        skills: ["html", "css", "js"],
        employment_at: "2020-01-01"
    },
    {
        id: 2,
        name: "Jane",
        age: 25,
        gender: "female",
        salary: 40000,
        married: true,
        skills: ["html", "css", "js", "php"],
        employment_at: "2023-06-21"
    },
    {
        id: 3,
        name: "Bob",
        age: 35,
        gender: "male",
        salary: 60000,
        married: false,
        skills: ["html", "css", "js", "python"],
        employment_at: "2021-03-15"
    },
    {
        id: 4,
        name: "Alice",
        age: 28,
        gender: "female",
        salary: 45000,
        married: true,
        skills: ["html", "css"],
        employment_at: "2022-09-01"
    },
    {
        id: 5,
        name: "Charlie",
        age: 40,
        gender: "male",
        salary: 70000,
        married: true,
        skills: ["html", "css", "js", "python", "java"],
        employment_at: "2020-07-10"
    },
    {
        id: 6,
        name: "Emily",
        age: 32,
        gender: "female",
        salary: 50000,
        married: true,
        skills: ["js", "C++"],
        employment_at: "2023-02-28"
    },
    {
        id: 7,
        name: "David",
        age: 29,
        gender: "male",
        salary: 55000,
        married: true,
        skills: ["html", "css", "js"],
        employment_at: "2021-11-05"
    },
    {
        id: 8,
        name: "Sophia",
        age: 27,
        gender: "female",
        salary: 40000,
        married: true,
        skills: ["html", "css", "js"],
        employment_at: "2022-08-15"
    }
]

const newStaffs = staffs;
//Вывод формы
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

closeModalButton.forEach(function(button) {
    button.addEventListener('click', toggleModal);
});
openModalButton.addEventListener('click', toggleModal);


//Вывод таблицы
const tableBody = document.getElementById("table-body");
const thList = document.querySelector("thead > tr").childNodes;
function updateTable(staffs) {
    tableBody.innerHTML = '';
    staffs.forEach((staff) => {
        let tr = document.createElement("tr");
        thList.forEach((th) => {
            let td = document.createElement("td");
            switch (th.textContent) {
                case "#":
                    td.innerHTML = staff.id;
                    tr.appendChild(td);
                    break;
                case "Имя":
                    td.innerHTML = staff.name;
                    tr.appendChild(td);
                    break;
                case "Навыки":
                    td.innerHTML = staff.skills.join(', ');
                    tr.appendChild(td);
                    break;
                case "Дата":
                    let date = new Date(staff.employment_at);
                    td.innerHTML = date.toLocaleDateString("ru-RU");
                    tr.appendChild(td);
                    break;
                case "Пол":
                    td.innerHTML = staff.gender === "male" ? "мужской" : "женский";
                    tr.appendChild(td);
                    break;
                case "Возраст":
                    td.innerHTML = staff.age;
                    tr.appendChild(td);
                    break;
                case "Зарплата":
                    td.innerHTML = new Intl.NumberFormat("ru-RU", {currency: 'RUB', style: 'currency'}).format(staff.salary);
                    tr.appendChild(td);

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-button';
                    // Удалние элемента при нажатии на кнопку "Удалить"
                    deleteButton.addEventListener('click', function() {
                        const index = newStaffs.indexOf(staff);
                        if (index !== -1) {
                            newStaffs.splice(index, 1);
                            updateTable(newStaffs); // Обновление таблицы после удаления элемента
                        }
                    });
                    const deleteButtonCell = document.createElement('td');
                    deleteButtonCell.appendChild(deleteButton);
                    tr.appendChild(deleteButtonCell);
                    break;
            }
        });
        tableBody.appendChild(tr);
    });
}

updateTable(newStaffs);

//добавляснеие new staff
const lastStaff = staffs[staffs.length - 1];
let idLastStaff = lastStaff.id;

const saveBtnModal = document.querySelector('.save-modal');

function saveModal(event) {
    if (event.target === saveBtnModal) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        data.id = ++idLastStaff;
        data.skills = data.skills.split(/,\s|,|\s/);

        newStaffs.push(data);

        updateTable(newStaffs);

        toggleModal();
    }
}

document.addEventListener('click', saveModal);

// Фильтрация

const filterInput = document.getElementById('filter');
let filteredStaffs = newStaffs;

filterInput.addEventListener('input', function() {
    const inputValue = filterInput.value.toLowerCase().trim();
    filteredStaffs = staffs.filter(function(staff) {
        const nameMatch = staff.name.toLowerCase().includes(inputValue);
        const skillsMatch = staff.skills.some(skill => skill.toLowerCase().includes(inputValue));
        return nameMatch || skillsMatch;
        });

    updateTable(filteredStaffs);
});


