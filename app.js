const requestUrl = 'https://api.slingacademy.com/v1/sample-data/users';
const basePOSTURL = 'https://jsonplaceholder.typicode.com';

let app = new Vue({
    el: '#app',
    data() {
        return {
            formData: {
                gender: 'male',
                first_name: '',
                last_name: '',
                email: '',
                state: '',
                country: '',
                city: '',
                phone: ''
            },
            validation: {
                default: /[a-zA-Zа-яА-Я]{3,30}/,
                email: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/,
                phone: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
            },
            showModal: false,
            staffs: [],
            displayedStaffs: [],
            currentPage: 1,
            limit: 10,
            offset: 0,
            total: null,
            searchQuery: '',
        };
    },
    computed:{
        totalPages() {
            return Math.ceil(this.total / this.limit);
        },
        isNextButtonDisabled() {
            return this.totalPages <= 1 || this.currentPage === this.totalPages;
        },
        isPrevButtonDisabled() {
            return this.totalPages <= 1 || this.currentPage === 1;
        },
    },
    methods: {
        openCloseModal() {
            this.showModal = !this.showModal;
            this.formData = {
                gender: 'male',
                first_name: '',
                last_name: '',
                email: '',
                state: '',
                country: '',
                city: '',
                phone: ''
            };
        },
        showNotification(message) {
            const notify = document.querySelector('.toast');
            const notifyBody = notify ? notify.querySelector('#notifyBody') : null;

            if (notify && notifyBody) {
                notify.classList.add('show');
                notifyBody.textContent = message;

                setTimeout(() => {
                    notify.classList.remove('show');
                }, 2000);
            }
        },
        async saveUser() {
            if (!this.validateForm()) {
                return;
            }
            try {
                const response = await fetch(`${basePOSTURL}/users`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.formData),
                });

                if (response.ok) {
                    this.showNotification('Данные успешно отправлены на сохранены');
                    this.openCloseModal();
                } else {
                    throw new Error('Failed to save user');
                }
            } catch (error) {
                console.error('Error saving user:', error);
                this.showNotification('Произошла ошибка при создании пользователя');
            }
        },
        validateForm() {
            const fields = [
                'first_name',
                'last_name',
                'email',
                'state',
                'country',
                'city',
                'phone'
            ];

            let isValid = true;

            fields.forEach(field => {
                const isValidField = this.validation[field === 'email' ? 'email' : field === 'phone' ? 'phone' : 'default'].test(this.formData[field]);
                const fieldId = `invalid-${field}`;

                if (!isValidField) {
                    this.showInvalidFeedback(fieldId);
                    isValid = false;
                } else {
                    this.hideInvalidFeedback(fieldId);
                }
            });

            return isValid;
        },
        showInvalidFeedback(fieldId) {
            const invalidField = document.getElementById(fieldId);
            if (invalidField) {
                invalidField.style.display = 'block';
            }
        },
        hideInvalidFeedback(fieldId) {
            const invalidField = document.getElementById(fieldId);
            if (invalidField) {
                invalidField.style.display = 'none';
            }
        },
        async handleRemove(id) {
            try {
                const response = await fetch(`${basePOSTURL}/users/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    this.showNotification(`Элемент ${id} удален`);
                } else {
                    this.showNotification(`Не удалось удалить элемент ${id}`);
                }
            } catch (error) {
                console.error('Error deleting element:', error);
                this.showNotification('Произошла ошибка при удалении элемента');
            }
        },

        async sendRequestGet() {
            await fetch(`${requestUrl}?limit=${this.limit}&offset=${this.offset}&search=${this.searchQuery}`)
                .then(response => response.json())
                .then(data => {
                    this.staffs = data.users;
                    this.displayedStaffs = this.staffs.slice(0, this.limit);
                    this.total = data.total_users;
                })
                .catch(err => console.log(err));
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.offset += this.limit;
                this.sendRequestGet();
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.offset -= this.limit;
                this.sendRequestGet();
            }
        },

        handleChange(event) {
            this.limit = parseInt(event.target.value);
            this.offset = 0;
            this.sendRequestGet();
        },
    },
    watch: {
        searchQuery() {
            this.sendRequestGet();
        },
    },
    mounted() {
        this.sendRequestGet();
    }

});