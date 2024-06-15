const arrayBook = [];
const RENDER_EVENT = 'render-bookshelf';
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

const generateID = () => {
    return +new Date();
}

const generateObject = (id, title, author, year, isCompleted) => {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    };
}

const makeButton = (classIcon, text) => {
    const makeButton = document.createElement('button');
    makeButton.classList.add('button');
    
    const icon = document.createElement('i');
    icon.classList.add('fas', classIcon);
    makeButton.appendChild(icon);
    
    const buttonText = document.createTextNode('' + text);
    makeButton.appendChild(buttonText);

    return makeButton;
}

const bookData = () => {
    return {
        id: generateID(),
        title: document.getElementById('inputBookTitle').value,
        author: document.getElementById('inputBookAuthor').value,
        year: document.getElementById('inputBookYear').value,
        isCompleted: document.getElementById('inputBookIsComplete').checked
    };
}

const clearForm = () => {
    document.getElementById('inputBookTitle').value = '';
    document.getElementById('inputBookAuthor').value = '';
    document.getElementById('inputBookYear').value = '';
    document.getElementById('inputBookIsComplete').checked = false;
}

const addBook = () => {
    const data = bookData();
    const pushData = generateObject(`BOOK${data.id}`, data.title, data.author, data.year, data.isCompleted)
    arrayBook.push(pushData);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const findBook = (id) => {
    for(const data of arrayBook) {
        if(data.id === id) {
            return data;
        }
    }
    return null
}

const findBookIndex = (id) => {
    for(const index in arrayBook) {
        if(arrayBook[index].id === id) {
            return parseInt(index);
        }
    }
    return -1;
}

const removeBook = (id) => {
    const index = findBookIndex(id);
    if(index !== -1) {
        arrayBook.splice(index, 1);
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const undoBook = (id) => {
    const index = findBookIndex(id);
    if(index !== -1) {
        arrayBook[index].isCompleted = false;
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const completeBook = (id) => {
    const index = findBookIndex(id);
    if(index !== -1) {
        arrayBook[index].isCompleted = true;
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const makeBook = (pushData) => {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = pushData.title;
    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = pushData.author;
    const bookYear = document.createElement('p');
    bookYear.innerText = pushData.year;

    const container = document.createElement('div');
    container.classList.add('book');
    container.append(bookTitle, bookAuthor, bookYear);
    container.setAttribute('id', `book-${pushData.id}`);

    if(pushData.isCompleted) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button');

        const undoButton = makeButton('fa-xmark', 'Belum Selesai');
        const trashButton = makeButton('fa-trash', 'Hapus');

        buttonContainer.append(undoButton, trashButton);
        container.append(buttonContainer);

        undoButton.addEventListener('click', function () {
            const undoConfirm = confirm('Apakah anda yakin ingin memindahkan buku ke daftar "Belum Selesai Dibaca"?');
            if(undoConfirm){
                undoBook(pushData.id);
                alert('Buku dipindahkan ke daftar "Belum Selesai Dibaca"');
            }
        });

        trashButton.addEventListener('click', function () {
            const trashConfirm = confirm('Apakah anda yakin ingin menghapus buku ini?');
            if(trashConfirm){
                removeBook(pushData.id);
                alert('Buku berhasil di hapus');
            }
        });
    } 
    else {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button');
        
        const completedButton = makeButton('fa-check', 'Selesai');
        const trashButton = makeButton('fa-trash', 'Hapus');

        buttonContainer.append(completedButton, trashButton);
        container.append(buttonContainer);

        completedButton.addEventListener('click', function () {
            const completedConfirm = confirm('Apakah anda yakin ingin memindahkan buku ke daftar "Selesai Dibaca"?');
            if(completedConfirm){
                completeBook(pushData.id);
                alert('Buku dipindahkan ke daftar "Selesai Dibaca"');
            }
        });

        trashButton.addEventListener('click', function () {
            const trashConfirm = confirm('Apakah anda yakin ingin menghapus buku ini?');
            if(trashConfirm){
                removeBook(pushData.id);
                alert('Buku berhasil di hapus');
            }
        });
    }
    
    return container
}

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

document.addEventListener(RENDER_EVENT, () => {
    const completedBook = document.getElementById('completed');
    completedBook.innerHTML = '';
    
    const uncompletedBook = document.getElementById('uncompleted');
    uncompletedBook.innerHTML = '';

    for (const book of arrayBook) {
        const bookElement = makeBook(book);
        if (book.isCompleted) {
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