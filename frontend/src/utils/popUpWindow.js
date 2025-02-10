function showNotification(message, isError = false) {
    notification.textContent = message;

    if (isError) {
        notification.classList.add('error');
    } else {
        notification.classList.remove('error');
    }

    notification.classList.remove('hidden')
    notification.style.opacity = '1';
    notification.style.top = '20px';

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.top = '10px';
        setTimeout(() => notification.classList.add('hidden'), 500);
    }, 3000);
}