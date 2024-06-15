// Local Storage Utilities
const STORAGE_KEY = 'BOOKSHELF';
const saved = 'saved-event'

const isStorageExist = () => {
    if(typeof(Storage) === 'undefined') {
        alert('Browser anda tidak mendukung local storage');
        return false;
    }
    return true;
}

const saveData = () => {
    if(isStorageExist()) {
        const json = JSON.stringify(arrayBook);
        localStorage.setItem(STORAGE_KEY, json);
        document.dispatchEvent(new Event(saved));
    }
}

const loadDataFromStorage = () => {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    const jsonData = JSON.parse(serializedData);

    if(jsonData !== null) {
        for(const book of jsonData) {
            arrayBook.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Form Utilities
const bookData = () => {
    return {
        id: generateID(),
        title: document.getElementById('inputBookTitle').value,
        author: document.getElementById('inputBookAuthor').value,
        year: document.getElementById('inputBookYear').value,
        isComplete: document.getElementById('inputBookIsComplete').checked
    };
}

const clearForm = () => {
    document.getElementById('inputBookTitle').value = '';
    document.getElementById('inputBookAuthor').value = '';
    document.getElementById('inputBookYear').value = '';
    document.getElementById('inputBookIsComplete').checked = false;
}

// Book Utilities
const arrayBook = [];
const RENDER_EVENT = 'render-bookshelf';

const generateID = () => {
    return +new Date();
};

const generateObject = (id, title, author, year, isComplete) => {
    return {
        id,
        title,
        author,
        year,
        isComplete
    };
};

const findBook = (id) => {
    return arrayBook.find(books => books.id === id ) || null;
}

const findBookIndex = (id) => {
    return arrayBook.findIndex(books => books.id === id);
}

const addBook = () => {
    const data = bookData();
    const pushData = generateObject(`BOOK${data.id}`, data.title, data.author, Number(data.year), data.isComplete);
    arrayBook.push(pushData);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const removeBook = (id) => {
    const index = findBookIndex(id);
    if(index !== -1) {
        arrayBook.splice(index, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

const undoBook = (id) => {
    const index = findBookIndex(id);
    if(index !== -1) {
        arrayBook[index].isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

const completeBook = (id) => {
    const index = findBookIndex(id);
    if(index !== -1) {
        arrayBook[index].isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

// DOM Manipulation Utilities
const makeButton = (classIcon, text, eventListener) => {
    const button = document.createElement('button');
    button.classList.add('button');
    
    const icon = document.createElement('i');
    icon.classList.add('fas', classIcon);
    button.appendChild(icon);
    
    const buttonText = document.createTextNode('' + text);
    button.appendChild(buttonText);

    button.addEventListener('click', eventListener);

    return button;
}

const makeBook = (book) => {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = book.title;
    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = book.author;
    const bookYear = document.createElement('p');
    bookYear.innerText = book.year;

    const container = document.createElement('div');
    container.classList.add('book');
    container.setAttribute('id', `book-${book.id}`);
    container.append(bookTitle, bookAuthor, bookYear);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button');

    if(book.isComplete) {
        const undoButton = makeButton('fa-xmark', 'Belum Selesai', () => {
            if(confirm('Apakah anda yakin ingin memindahkan buku ke daftar "Belum Selesai"?')){
                undoBook(book.id);
                alert('Buku dipindahkan ke daftar "Belum Selesai"');
            }
        });

        const trashButton = makeButton('fa-trash', 'Hapus', () => {
            if(confirm('Apakah anda yakin ingin menghapus buku ini?')){
                removeBook(book.id);
                alert('Buku berhasil di hapus');
            }
        });

        buttonContainer.append(undoButton, trashButton);
    } 
    else {
        const completedButton = makeButton('fa-check', 'Selesai', () => {
            if(confirm('Apakah anda yakin ingin memindahkan buku ke daftar "Selesai Dibaca"?')){
                completeBook(book.id);
                alert('Buku dipindahkan ke daftar "Selesai Dibaca"');
            }
        });

        const trashButton = makeButton('fa-trash', 'Hapus', () => {
            if(confirm('Apakah anda yakin ingin menghapus buku ini?')){
                removeBook(book.id);
                alert('Buku berhasil di hapus');
            }
        });

        buttonContainer.append(completedButton, trashButton);
    }

    container.append(buttonContainer);
    return container
}

// Search Function Utilities
const searchBooks = (keyword) => {
    return arrayBook.filter((book) => book.title.toLowerCase().includes(keyword.toLowerCase()));
}

const renderSearch = (books) => {
    const uncompletedBook = document.getElementById('result');
    uncompletedBook.innerHTML = '';
    
    if(books.length === 0) {
        const notFound = document.createElement('h3');
        notFound.innerText = 'Tidak ditemukan buku yang sesuai';
        uncompletedBook.append(notFound);
    } else {
        for (const book of books) {
            const bookElement = document.createElement('div');
            bookElement.classList.add('resultText');

            const bookTitle = document.createElement('h3');
            bookTitle.innerText = book.title;
            const bookAuthor = document.createElement('p');
            bookAuthor.innerText = book.author;
            const bookYear = document.createElement('p');
            bookYear.innerText = book.year;

            bookElement.append(bookTitle, bookAuthor, bookYear);
            uncompletedBook.append(bookElement);
        }
    }
};

// Event Listener Utilities
document.addEventListener(RENDER_EVENT, () => {
    const completedBook = document.getElementById('completed');
    completedBook.innerHTML = '';
    
    const uncompletedBook = document.getElementById('uncompleted');
    uncompletedBook.innerHTML = '';

    for (const book of arrayBook) {
        const bookElement = makeBook(book);
        if (book.isComplete) {
            completedBook.append(bookElement);
        } else {
            uncompletedBook.append(bookElement);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (isStorageExist()) {
        loadDataFromStorage();
    }

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keyup', (event) => {
        const searchKeyword = event.target.value;
        if (searchKeyword === '') {
            document.getElementById('result').innerHTML = '';
        } else {
            const searchResult = searchBooks(searchKeyword);
            renderSearch(searchResult);
        }
    });
    
    const submitForm = document.getElementById('formInput');
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const isConfirmed = confirm('Apakah data yang dimasukkan sudah benar?');
        if (isConfirmed) {
            addBook();
            clearForm();
            alert('Buku berhasil ditambahkan');
        }
    });
});