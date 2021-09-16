//Book class: represends a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
//Ui class: hande ui task
class UI {
  static displayBooks() {

    const books = Storage.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector('#book-list');

    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;

    list.appendChild(row);
  }
  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message,className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);
    //Vanish in 5 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 5000);
  }

  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
  }
}
//store class: handels storage
class Storage {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books= [];
    }else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook (book) {
    const books = Storage.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn){
    const books = Storage.getBooks();

    books.forEach((book, index) =>{
      if (book.isbn === isbn) {
        books.splice(index);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
}
//Event: Dispaly books
document.addEventListener('DOMContentLoaded', UI.displayBooks);
//Event: Add a book
document.querySelector("#book-form").addEventListener('submit', (e) => {
  //Prevent actual submit
  e.preventDefault();

  //Get Form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //Validate
  if (title === '' || author ===  '' || isbn === '') {
    UI.showAlert('Plase fill in all fields', 'danger');
  } else {

    //Instantiate book
    const book = new Book(title, author, isbn);

    //Add book to UI
    UI.addBookToList(book);

    //Add book to Storage
    Storage.addBook(book);
    //Succes message
    UI.showAlert('Book added', 'success');
    //Clear Fields
    UI.clearFields();
  }

});
//Event: Delete a book
document.querySelector('#book-list').addEventListener('click', (e) => {
  //Remove book from UI
  UI.deleteBook(e.target);

//Remove book from Storage
Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
//Succes message
UI.showAlert('Book Removed', 'success');
});
