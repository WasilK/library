let myLibrary = [];

function Book(id, title, author, readStatus) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.readStatus = readStatus;
}

function addBook(title, author) {
  myLibrary.push(new Book(crypto.randomUUID(), title, author, false));
  displayBooks();
}

let books = document.querySelector(".books");
let ul = document.querySelector("ul");

function displayBooks() {
  ul.innerHTML = "";
  myLibrary.forEach((lib) => {
    let li = document.createElement("li");
    li.dataset.id = lib.id;
    let toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Toggle";
    toggleBtn.classList.add("toggle");
    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Remove";
    deleteBtn.classList.add("delete");
    li.textContent = `${lib.title} by ${lib.author} & ${lib.readStatus ? "Read" : "Unread"} `;
    ul.appendChild(li);
    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);
  });
}

function toggle(id) {
  const book = myLibrary.find((lib) => lib.id === id);

  if (book) {
    book.readStatus = !book.readStatus;
  }

  displayBooks();
}

function removeBook(id) {
  myLibrary = myLibrary.filter((lib) => lib.id !== id);
  displayBooks();
}

ul.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const id = li.dataset.id;

  if (e.target.classList.contains("toggle")) {
    toggle(id);
  }

  if (e.target.classList.contains("delete")) {
    removeBook(id);
  }
});

let form = document.querySelector("form");
let title = document.querySelector(".title");
let author = document.querySelector(".author");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let inp1 = title.value.trim();
  let inp2 = author.value.trim();
  addBook(inp1, inp2);
  title.value = "";
  author.value = "";
});
