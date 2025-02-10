document.getElementById("showAll").addEventListener("click", function() {
    const table = document.getElementById("playersTable");
    table.scrollIntoView({ behavior: 'smooth' }); 
});

document.getElementById("showBlocked").addEventListener("click", function() {
    const table = document.getElementById("playersTable");
    table.scrollIntoView({ behavior: 'smooth' }); 
});