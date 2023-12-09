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
                default: /[A-zА-яёЁ]{3,30}/,
                email: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/,
                phone: /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/,
            },
            showModal: false,
            staffs: [],
            currentPage: 1,
            limit: 10,
            offset: 0,
            total: null,
            searchQuery: '',
            notificationMessage: '',
            showToast: false,
            showInvalid: {
                first_name: false,
                last_name: false,
                email: false,
                state: false,
                country: false,
                city: false,
                phone: false
            },
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
            this.showModal = !this.showModal
            if (!this.showModal) {
                this.clearForm()
            }

        },
        clearForm() {
            for (let key in this.formData) {
                if( key === 'gender') {
                    this.formData[key] = 'male';
                }else {
                    this.formData[key] = '';
                }
            }
        },
        showNotification(message) {
            this.notificationMessage = message;
            this.showToast = true;

            setTimeout(() => {
                this.showToast = false;
                this.notificationMessage = '';
            }, 2000);
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
                    this.showNotification('Данные успешно сохранены');
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

                if (!isValidField) {
                    this.$set(this.showInvalid, field, true);
                    isValid = false;
                } else {
                    this.$set(this.showInvalid, field, false);
                }
            });

            return isValid;
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
            let url = `${requestUrl}?limit=${this.limit}&offset=${this.offset}`;

            if (this.searchQuery.trim() !== '') {
                url += `&search=${this.searchQuery}`;
            }
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    this.staffs = data.users;
                    this.total = data.total_users;
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
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
                this.offset = this.offset - this.limit < 0 ? 0 : this.offset - this.limit;
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