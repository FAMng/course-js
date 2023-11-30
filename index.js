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
const openModalButton = document.querySelector('.open-modal');
const modalWindow = document.querySelector('.modal');
const closeModalButton = document.querySelectorAll('.close-modal');
function toggleModal() {
    modalWindow.classList.toggle('show');
}
closeModalButton.forEach(function(button) {
    button.addEventListener('click', toggleModal);
});
openModalButton.addEventListener('click', toggleModal);



var tableBody = document.getElementById('table-body');

// Функция для создания и добавления строк в таблицу
function createTableRows(data) {
    // Очищаем содержимое tbody перед добавлением новых строк
    tableBody.innerHTML = '';

    // Проходимся по массиву staffs и создаем строки и ячейки для каждого объекта
    data.forEach(function(staff) {
        var row = document.createElement('tr');

        var idCell = document.createElement('td');
        idCell.textContent = staff.id;
        row.appendChild(idCell);

        var nameCell = document.createElement('td');
        nameCell.textContent = staff.name;
        row.appendChild(nameCell);

        var skillsCell = document.createElement('td');
        skillsCell.textContent = staff.skills.join(', ');
        row.appendChild(skillsCell);

        var employmentCell = document.createElement('td');
        employmentCell.textContent = staff.employment_at;
        row.appendChild(employmentCell);

        var genderCell = document.createElement('td');
        genderCell.textContent = staff.gender;
        row.appendChild(genderCell);

        var ageCell = document.createElement('td');
        ageCell.textContent = staff.age;
        row.appendChild(ageCell);

        var salaryCell = document.createElement('td');
        salaryCell.textContent = staff.salary;
        row.appendChild(salaryCell);

        // Добавляем сформированную строку в tbody
        tableBody.appendChild(row);
    });
}

// Вызываем функцию для отображения данных в таблице при загрузке страницы
createTableRows(staffs);
