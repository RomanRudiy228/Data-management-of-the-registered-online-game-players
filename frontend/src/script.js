const addPlayerButton = document.getElementById('addPlayer');
const notification = document.getElementById('notification');
const onlineCountElement = document.getElementById('online');
const playersTableBody = document.querySelector('#playersTable tbody');
const showAllButton = document.querySelector('#showAll');

const nicknameRegex = /^[a-zA-Z0-9-]+$/;

addPlayerButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const level = document.getElementById('level').value.trim();
    const country = document.getElementById('country').value.trim();
    const status = document.getElementById('status').value;

    const response = await fetch('/api/Players');
    const players = await response.json();
    if (players.some(player => player.nickname === name)) {
        showNotification('Player with this nickname already exists.', true);
        return;
    }

    if (!nicknameRegex.test(name)) {
        showNotification('Nickname can only contain letters, numbers, and "-".', true);
        return;
    }

    if (!name || !level || !country) {
        showNotification('Failed to add player. Please fill in all fields.', true);
        return;
    }

    const levelNumber = parseInt(level, 10);
    if (isNaN(levelNumber) || levelNumber < 0 || levelNumber > 100) {
        showNotification('Level must be a number between 0 and 100.', true);
        return;
    }

try {
    const response = await fetch('/api/Players', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nickname: name,
            level: levelNumber,
            country,
            status, 
            registrationDate: new Date().toISOString()
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to add player. Status: ${response.status}`);
    }

    const newPlayer = await response.json();

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${newPlayer.nickname}</td>
        <td>${newPlayer.level}</td>
        <td>${newPlayer.country}</td>
        <td>${newPlayer.status}</td>
    `;
    playersTableBody.appendChild(row);
    console.log('New player added:', newPlayer);

    showNotification('Player added successfully!', false);

    location.reload();
    } catch (error) {
        console.error('Error adding player:', error);
        showNotification('Failed to add player. Please try again.', true);
    }
});

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

async function fetchPlayers() {
    try {
        const response = await fetch('/api/Players');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
            
        const players = await response.json();
        console.log(players);

        const activePlayersCount = players.filter(player => player.status === 'active').length;
        onlineCountElement.textContent = `${activePlayersCount} Online`;
        
        playersTableBody.innerHTML = '';

        players.forEach(player => {
            const registrationDate = player.registrationDate ? new Date(player.registrationDate) : new Date();
    
            if (isNaN(registrationDate)) {
                console.error('Invalid registration date:', player.registrationDate);
                return; 
            }

            const formattedDate = formatDate(registrationDate.toISOString());

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.nickname}</td>
                <td>${player.level}</td>
                <td>${player.country}</td>
                <td>${player.status}</td>
                <td data-date="${registrationDate.toISOString()}">${formattedDate}</td>
                <td><button class="delete-btn" onclick="deletePlayer('${player._id}')">Delete <i class="bx bx-trash"></i></button></td>
            `;
            playersTableBody.appendChild(row);

        });
    } catch (error) {
        console.error('Error fetching players:', error);
    }
}

async function deletePlayer(playerId) {
    try {
        const response = await fetch(`/api/Players/${playerId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Failed to delete player. Status: ${response.status}`);
        }

        showNotification('Player deleted successfully!', false);

        fetchPlayers();
    } catch (error) {
        console.error('Error deleting player:', error);
        showNotification('Failed to delete player. Please try again.', true);
    }
}

showAllButton.addEventListener('click', fetchPlayers);

let sortOrder = {
    nickname: 'asc',
    level: 'desc',
    country: 'asc',
    status: 'asc',
    registrationDate: 'desc'
};

let activeSortColumn = '';

function sortTableByColumn(columnName) {
    const rows = Array.from(playersTableBody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
        let valueA, valueB;

        switch (columnName) {
            case 'nickname':
                valueA = rowA.querySelector('td:nth-child(1)').textContent.toLowerCase();
                valueB = rowB.querySelector('td:nth-child(1)').textContent.toLowerCase();
                return sortOrder.nickname === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            case 'level':
                valueA = parseInt(rowA.querySelector('td:nth-child(2)').textContent);
                valueB = parseInt(rowB.querySelector('td:nth-child(2)').textContent);
                return sortOrder.level === 'desc' ? valueB - valueA : valueA - valueB;
            case 'country':
                valueA = rowA.querySelector('td:nth-child(3)').textContent.toLowerCase();
                valueB = rowB.querySelector('td:nth-child(3)').textContent.toLowerCase();
                return sortOrder.country === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            case 'status':
                valueA = rowA.querySelector('td:nth-child(4)').textContent.toLowerCase();
                valueB = rowB.querySelector('td:nth-child(4)').textContent.toLowerCase();
                return sortOrder.status === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            case 'registrationDate': 
                valueA = new Date(rowA.querySelector('td:nth-child(5)').getAttribute('data-date'));
                valueB = new Date(rowB.querySelector('td:nth-child(5)').getAttribute('data-date'));
                if (isNaN(valueA) || isNaN(valueB)) return 0;
                return sortOrder[columnName] === 'desc' ? valueB - valueA : valueA - valueB;
            default:
                return 0;
        }
    });

    rows.forEach(row => playersTableBody.appendChild(row));

    sortOrder[columnName] = sortOrder[columnName] === 'asc' ? 'desc' : 'asc';

    document.querySelectorAll('#playersTable th').forEach(th => th.classList.remove('sort-asc', 'sort-desc'));
    const header = document.getElementById(`${columnName}Header`);
    if (sortOrder[columnName] === 'asc') {
        header.classList.add('sort-asc');
    } else {
        header.classList.add('sort-desc');
    }
}

document.getElementById('nicknameHeader').addEventListener('click', () => sortTableByColumn('nickname'));
document.getElementById('levelHeader').addEventListener('click', () => sortTableByColumn('level'));
document.getElementById('countryHeader').addEventListener('click', () => sortTableByColumn('country'));
document.getElementById('statusHeader').addEventListener('click', () => sortTableByColumn('status'));
document.getElementById('registrationDateHeader').addEventListener('click', () => sortTableByColumn('registrationDate'));


window.onload = fetchPlayers;
window.deletePlayer = deletePlayer;