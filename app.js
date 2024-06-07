 

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordRegex = /^[A-Za-z0-9]{8,}$/;  // Regular expression to check password validity

    if (email && password) {
        if (!passwordRegex.test(password)) {
            alert('Password must be at least 8 characters long and contain no special characters.');
            return;
        }

        const storedPassword = localStorage.getItem(email + '_password');
        if (storedPassword) {
            if (storedPassword === password) {
                localStorage.setItem('currentUserEmail', email);
                showHomePage();
            } else {
                alert('Incorrect password.');
            }
        } else {
            localStorage.setItem(email + '_password', password);
            localStorage.setItem('currentUserEmail', email);
            showHomePage();
        }
    } else {
        alert('Please enter both email and password.');
    }
}

function checkUserLogin() {
    const email = localStorage.getItem('currentUserEmail');
    if (email) {
        showHomePage();
    } else {
        showLoginPage();
    }
}

function showHomePage() {
    const email = localStorage.getItem('currentUserEmail');
    document.getElementById('user-email').textContent = email;
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('home-page').classList.remove('hidden');
    displayNotes();
}

function showLoginPage() {
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('home-page').classList.add('hidden');
}

function logout() {
    localStorage.removeItem('currentUserEmail');
    clearInputFields();
    showLoginPage();
}

function clearInputFields() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('note-input').value = '';
}

function addNote() {
    const noteInput = document.getElementById('note-input');
    const note = noteInput.value;
    if (note) {
        const email = localStorage.getItem('currentUserEmail');
        let userNotes = JSON.parse(localStorage.getItem(email + '_notes')) || [];
        const timestamp = new Date().toLocaleString();
        userNotes.push({ text: note, timestamp: timestamp });
        localStorage.setItem(email + '_notes', JSON.stringify(userNotes));
        noteInput.value = '';
        displayNotes();
    } else {
        alert('Please enter a note.');
    }
}

function displayNotes() {
    const email = localStorage.getItem('currentUserEmail');
    const userNotes = JSON.parse(localStorage.getItem(email + '_notes')) || [];
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';
    userNotes.forEach(note => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${note.text}</span><strong>${note.timestamp}</strong>`;
        notesList.appendChild(li);
    });
}

// Call checkUserLogin on page load
window.onload = checkUserLogin;
