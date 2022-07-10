// Book Class: Represent a Book 

class Book {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

// UI class: Handle UI class

class UI {

    static displayBooks() {

        const StoredBooks = Store.getBooks()
        const books = StoredBooks

        books.forEach((b) => UI.addBookToList(b))
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list')
        const row = document.createElement('tr')
        row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `
        list.appendChild(row)
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
            UI.showAlert("Book Removed", 'success')
        }
    }

    static clearFields() {
        document.querySelector('#title').value = ""
        document.querySelector('#author').value = ""
        document.querySelector('#isbn').value = ""
    }

    static showAlert(msg, className) {
        const alertDiv = document.createElement('div')
        alertDiv.className = `alert alert-${className} m-4`
        alertDiv.appendChild(document.createTextNode(msg))
        const container = document.querySelector('.container')
        const form = document.querySelector('#book-form')
        container.insertBefore(alertDiv, form)

        //Remove Alert after 3sec

        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 3000)
    }

}


// Store Class: Handle Storage

class Store {

    static getBooks() {

        let books

        if (localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }

    static addBook(book) {
        const books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn) {
        const books = Store.getBooks()
        books.forEach((b, i) => {
            if (b.isbn === isbn) {
                books.splice(i, 1)
            }
        })
        localStorage.setItem('books', JSON.stringify(books))
    }
}


//Event: Display Books

document.addEventListener('DOMContentLoaded', UI.displayBooks)


//Event: Add a book

document.querySelector('#book-form').addEventListener('submit', (e) => {
    //Prevent Actual Submit
    e.preventDefault()
    //Get Form Values
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    //Validate
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert("Please Fill all fields", 'danger')
    }
    else {
        const newBook = new Book(title, author, isbn)

        UI.addBookToList(newBook)
        Store.addBook(newBook)
        UI.showAlert("Book Added Successfully", 'info')

        UI.clearFields()
    }


})

//Event: Remove Book

document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target)
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
})
