// import { showNotification } from './notification';  
// import { fetchPlayers } from '../script';

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
