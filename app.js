// app.js

const adminEmail = 'admin@gmail.com';
const adminPassword = 'admin';

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordRegex = /^[A-Za-z0-9]{8,}$/;  // Regular expression to check password validity

    if (email && password) {
        if (email === adminEmail && password === adminPassword) {
            localStorage.setItem('currentUserEmail', email);
            showAdminPage();
            return;
        }

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
        if (email === adminEmail) {
            showAdminPage();
        } else {
            showHomePage();
        }
    } else {
        showLoginPage();
    }
}

function showHomePage() {
    const email = localStorage.getItem('currentUserEmail');
    document.getElementById('user-email').textContent = email;
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('home-page').classList.remove('hidden');
    document.getElementById('admin-page').classList.add('hidden');
    displayNotes();
}

function showAdminPage() {
    document.getElementById('user-email').textContent = adminEmail;
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('admin-page').classList.remove('hidden');
    displayAllUsersNotes();
}

function showLoginPage() {
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('admin-page').classList.add('hidden');
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
    const categoryInput = document.getElementById('category-input');
    const note = noteInput.value;
    const category = categoryInput.value;

    if (note) {
        if (category === 'Select category') {
            alert('Please select a category.');
            return;
        }
        const email = localStorage.getItem('currentUserEmail');
        let userNotes = JSON.parse(localStorage.getItem(email + '_notes')) || [];
        const timestamp = new Date().toLocaleString();
        userNotes.push({ text: note, category: category, timestamp: timestamp });
        localStorage.setItem(email + '_notes', JSON.stringify(userNotes));
        noteInput.value = '';
        categoryInput.value = 'Select category'; // Reset category selection
        displayNotes(); // Update notes list
    } else {
        alert('Please enter a note.');
    }
}

function displayNotes(filter = 'All') {
    const email = localStorage.getItem('currentUserEmail');
    const userNotes = JSON.parse(localStorage.getItem(email + '_notes')) || [];
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    userNotes.forEach((note, index) => {
        if (filter === 'All' || note.category === filter) {
            const noteItem = document.createElement('li');
            noteItem.innerHTML = `
                <div class="note-content">
                    <span>
                        ${note.text}
                        <div>
                            <button class="edit" onclick="editNote(${index})">Edit</button>
                            <button class="delete" onclick="deleteNote(${index})">Delete</button>
                        </div>
                    </span>
                    <strong>${note.category}</strong>
                    <small>${note.timestamp}</small>
                </div>
            `;
            notesList.appendChild(noteItem);
        }
    });
}

function displayAllUsersNotes() {
    const notesList = document.getElementById('admin-notes-list');
    notesList.innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.endsWith('_notes')) {
            const userEmail = key.replace('_notes', '');
            const userNotes = JSON.parse(localStorage.getItem(key)) || [];
            
            userNotes.forEach((note, index) => {
                const noteItem = document.createElement('li');
                noteItem.innerHTML = `
                    <div class="note-content">
                        <span>
                            ${note.text}
                            <div>
                                <button class="delete" onclick="deleteAdminUserNote('${userEmail}', ${index})">Delete</button>
                            </div>
                        </span>
                        <strong>${note.category}</strong>
                        <small>${note.timestamp} - ${userEmail}</small>
                    </div>
                `;
                notesList.appendChild(noteItem);
            });
        }
    }
}

function deleteAdminUserNote(email, noteIndex) {
    let userNotes = JSON.parse(localStorage.getItem(email + '_notes')) || [];
    userNotes.splice(noteIndex, 1);
    localStorage.setItem(email + '_notes', JSON.stringify(userNotes));
    displayAllUsersNotes();
}

function editNote() {
    // Function to handle note editing
}

function deleteNote() {
    // Function to handle note deletion
}

function filterNotes() {
    const filterCategory = document.getElementById('filter-category').value;
    displayNotes(filterCategory);
}
