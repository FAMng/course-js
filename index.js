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
        id: 97,
        name: "David",
        age: 29,
        gender: "male",
        salary: 55000,
        married: true,
        skills: ["html", "css", "js"],
        employment_at: "2021-11-05"
    },
    {
        id: 85,
        name: "Sophia",
        age: 27,
        gender: "female",
        salary: 40000,
        married: true,
        skills: ["html", "css", "js"],
        employment_at: "2022-08-15"
    }
]

const newStaffs = [...staffs];

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

const tableBody = document.getElementById("table-body");

function createDeleteButton(staff) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';

    deleteButton.addEventListener('click', function() {
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
    tr.appendChild(createTableCell(staff.name));
    tr.appendChild(createTableCell(staff.skills.join(', ')));

    const date = new Date(staff.employment_at);
    tr.appendChild(createTableCell(date.toLocaleDateString("ru-RU")));

    tr.appendChild(createTableCell(staff.gender === "male" ? "мужской" : "женский"));
    tr.appendChild(createTableCell(staff.age));
    tr.appendChild(createTableCell(new Intl.NumberFormat("ru-RU", {currency: 'RUB', style: 'currency'}).format(staff.salary)));

    const deleteButtonCell = document.createElement('td');
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


