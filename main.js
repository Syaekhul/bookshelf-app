// Do your work here...
const books = JSON.parse(localStorage.getItem("books")) || [];

window.onload = () => {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach(displayBook);
};

function addBook(event) {
  event.preventDefault();

  console.log("Adding book");

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  let bookId = new Date().getTime();

  const newBook = {
    id: bookId,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  const books = JSON.parse(localStorage.getItem("books")) || [];

  books.push(newBook);
  localStorage.setItem("books", JSON.stringify(books));

  displayBook(newBook);

  document.getElementById("bookForm").reset();

  showAlert("Buku berhasil ditambahkan!");
}

function showAlert(message) {
  const alertBox = document.getElementById("alertBox");
  alertBox.innerText = message;
  alertBox.style.display = "block";

  setTimeout(() => {
    alertBox.style.display = "none";
  }, 3000);
}

function displayBook(book) {
  const bookList = book.isComplete
    ? document.getElementById("completeBookList")
    : document.getElementById("incompleteBookList");

  const bookItem = document.createElement("div");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");
  bookItem.classList.add("book-list");

  const title = document.createElement("h3");
  title.setAttribute("data-testid", "bookItemTitle");
  title.textContent = book.title;
  bookItem.appendChild(title);

  const author = document.createElement("p");
  author.setAttribute("data-testid", "bookItemAuthor");
  author.textContent = `Penulis: ${book.author}`;
  bookItem.appendChild(author);

  const year = document.createElement("p");
  year.setAttribute("data-testid", "bookItemYear");
  year.textContent = `Tahun: ${book.year}`;
  bookItem.appendChild(year);

  const buttonContainer = document.createElement("div");

  const isCompleteButton = document.createElement("button");
  isCompleteButton.setAttribute("data-testid", "bookItemIsCompleteButton");
  isCompleteButton.classList.add("complete-button");
  isCompleteButton.textContent = book.isComplete
    ? "Belum Selesai Dibaca"
    : "Selesai Dibaca";
  isCompleteButton.addEventListener("click", () => toggleBookStatus(book.id));
  buttonContainer.appendChild(isCompleteButton);

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "Hapus Buku";
  deleteButton.addEventListener("click", () => deleteBook(book.id));
  buttonContainer.appendChild(deleteButton);

  const editButton = document.createElement("button");
  editButton.setAttribute("data-testid", "bookItemEditButton");
  editButton.classList.add("edit-button");
  editButton.textContent = "Edit Buku";
  editButton.addEventListener("click", () => openEditModal(book));
  buttonContainer.appendChild(editButton);

  bookItem.appendChild(buttonContainer);
  bookList.appendChild(bookItem);

  addEditButtonListener(book);
}

function deleteBook(bookid) {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const filteredBooks = books.filter((book) => book.id !== bookid);
  localStorage.setItem("books", JSON.stringify(filteredBooks));

  const bookElement = document.querySelector(`[data-bookid="${bookid}"]`);
  bookElement.parentNode.removeChild(bookElement);
}

function toggleBookStatus(bookid) {
  const books = JSON.parse(localStorage.getItem("books")) || [];

  const updatedBooks = books.map((book) => {
    if (book.id === bookid) {
      return {
        ...book,
        isComplete: !book.isComplete,
      };
    }
    return book;
  });

  localStorage.setItem("books", JSON.stringify(updatedBooks));

  const bookElement = document.querySelector(`[data-bookid="${bookid}"]`);
  const isCompleteButton = bookElement.querySelector(
    '[data-testid="bookItemIsCompleteButton"]'
  );

  const isComplete = updatedBooks.find((book) => book.id === bookid).isComplete;
  isCompleteButton.textContent = isComplete
    ? "Belum Selesai Dibaca"
    : "Selesai Dibaca";

  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  if (isComplete) {
    incompleteBookList.removeChild(bookElement);
    completeBookList.appendChild(bookElement);
  } else {
    completeBookList.removeChild(bookElement);
    incompleteBookList.appendChild(bookElement);
  }
}

function searchBooks(event) {
  event.preventDefault();

  const keyword = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const books = JSON.parse(localStorage.getItem("books")) || [];

  const searchResults = books.filter((book) =>
    book.title.toLowerCase().includes(keyword)
  );

  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  searchResults.forEach((book) => displayBook(book));
}

const editBookModal = document.getElementById("editBookModal");

function openEditModal(book) {
  editBookModal.classList.add("show");
  document.getElementById("editBookId").value = book.id;
  document.getElementById("editBookFormTitle").value = book.title;
  document.getElementById("editBookFormAuthor").value = book.author;
  document.getElementById("editBookFormYear").value = book.year;
}

function closeEditModal() {
  editBookModal.classList.remove("show");
}

function saveEditedBook() {
  const bookId = parseInt(document.getElementById("editBookId").value);
  const title = document.getElementById("editBookFormTitle").value.trim();
  const author = document.getElementById("editBookFormAuthor").value.trim();
  const year = parseInt(document.getElementById("editBookFormYear").value);

  if (!title || !author || isNaN(year)) {
    showAlert("Harap isi semua field dengan benar!");
    return;
  }

  const books = JSON.parse(localStorage.getItem("books")) || [];

  const updatedBooks = books.map((book) =>
    book.id === bookId ? { ...book, title, author, year } : book
  );

  localStorage.setItem("books", JSON.stringify(updatedBooks));

  reloadBooks();
  closeEditModal();
}

function reloadBooks() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  const books = JSON.parse(localStorage.getItem("books")) || [];

  books.forEach((book) => displayBook(book));
}

function addEditButtonListener(book) {
  const editButton = document.querySelector(
    `[data-bookid="${book.id}"] [data-testid="bookItemEditButton"]`
  );
  editButton.addEventListener("click", () => openEditModal(book));
}

document.getElementById("saveEditBook").addEventListener("click", (event) => {
  event.preventDefault();
  saveEditedBook();
});

document.getElementById("closeEditModal").addEventListener("click", (event) => {
  event.preventDefault();
  closeEditModal();
});

document.getElementById("bookForm").addEventListener("submit", addBook);

document.getElementById("searchBook").addEventListener("click", searchBooks);
