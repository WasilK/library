function saveToLocalStorage() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
}

function loadFromLocalStorage() {
  const stored = localStorage.getItem("library");
  if (!stored) return;

  const parsed = JSON.parse(stored);

  myLibrary = parsed.map((book) => {
    const newBook = new Book(book.title, book.author, book.readStatus);
    newBook.id = book.id; // preserve id
    return newBook;
  });

  displayBooks();
}
// ================= STATE =================
let myLibrary = [];

// ================= MODEL =================
class Book {
  constructor(title, author, readStatus = false) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.readStatus = readStatus;
  }

  toggleRead() {
    this.readStatus = !this.readStatus;
  }
}

// ================= DOM REFERENCES =================
const ul = document.querySelector("ul");
const form = document.querySelector("form");
const titleInput = document.querySelector(".title");
const authorInput = document.querySelector(".author");
const dialog = document.querySelector("dialog");
const addBtn = document.querySelector(".add");
const closeBtn = document.querySelector(".close");

// Safety check
if (!ul || !form || !titleInput || !authorInput || !dialog) {
  console.error("Missing required DOM elements.");
}

// ================= RENDER =================
function displayBooks() {
  ul.innerHTML = "";

  if (myLibrary.length === 0) {
    ul.innerHTML = "<li class='empty'>No books added yet.</li>";
    return;
  }

  myLibrary.forEach((book) => {
    const li = document.createElement("li");
    li.dataset.id = book.id;

    const info = document.createElement("span");
    info.textContent = `${book.title} by ${book.author}`;

    // ✅ Apply line-through if read
    if (book.readStatus) {
      info.classList.add("read");
    }

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = book.readStatus ? "Mark Unread" : "Mark Read";
    toggleBtn.classList.add("toggle");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Remove";
    deleteBtn.classList.add("delete");

    li.append(info, toggleBtn, deleteBtn);
    ul.appendChild(li);
  });
}

// ================= STATE ACTIONS =================
function addBook(title, author) {
  const newBook = new Book(title, author);
  myLibrary.push(newBook);
  saveToLocalStorage();
  displayBooks();
}

function toggleBook(id) {
  const book = myLibrary.find((b) => b.id === id);
  if (!book) return;

  book.toggleRead();
  saveToLocalStorage();
  displayBooks();
}

function removeBook(id) {
  const exists = myLibrary.some((b) => b.id === id);
  if (!exists) return;

  myLibrary = myLibrary.filter((b) => b.id !== id);
  saveToLocalStorage();
  displayBooks();
}

// ================= EVENT DELEGATION =================
ul.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = li.dataset.id;

  if (e.target.classList.contains("toggle")) {
    toggleBook(id);
  }

  if (e.target.classList.contains("delete")) {
    removeBook(id);
  }
});

// ================= FORM HANDLING =================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();

  // Prevent empty values
  if (!title || !author) {
    alert("Both title and author are required.");
    return;
  }

  // Prevent duplicates
  const exists = myLibrary.some(
    (b) =>
      b.title.toLowerCase() === title.toLowerCase() &&
      b.author.toLowerCase() === author.toLowerCase(),
  );

  if (exists) {
    alert("This book already exists.");
    return;
  }

  addBook(title, author);

  form.reset();
  dialog.close();
});

// ================= DIALOG CONTROL =================
addBtn.addEventListener("click", () => {
  dialog.showModal();
});

loadFromLocalStorage();
