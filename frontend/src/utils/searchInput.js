document.addEventListener('DOMContentLoaded', () => {
const searchInput = document.getElementById('searchInput');
const playersTableBody = document.querySelector('#playersTable tbody');

if (playersTableBody) {
    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        const rows = playersTableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const nickname = row.cells[0].textContent.toLowerCase();
            const level = row.cells[1].textContent.toLowerCase();
            const country = row.cells[2].textContent.toLowerCase();
            const status = row.cells[3].textContent.toLowerCase();

            if (
                nickname.includes(searchText) ||
                level.includes(searchText) ||
                country.includes(searchText) ||
                status.includes(searchText)
            ) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
} else {
    console.error('playersTableBody element not found in DOM.');
    }
});

