const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKSHELF_APPS";

document.addEventListener("DOMContentLoaded", function (){
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.getElementById('searchSubmit').addEventListener("click", function (event){
    event.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookList = document.querySelectorAll('.book_item h3:nth-child(1)');
    for (const book of bookList) {
    if (book.innerText.toLowerCase().includes(searchBook)) {
        book.parentElement.style.display = "block";      
    } else {
        book.parentElement.style.display = "none";
    }
    }
});
      
function addBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject (generatedID, bookTitle, bookAuthor, bookYear, isCompleted);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();    
}

function generateId(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
return {
    id,
    title,
    author,
    year,
    isComplete
    };
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
    uncompletedBOOKList.innerHTML ="";

    const completedBOOKList = document.getElementById("completeBookshelfList");
    completedBOOKList.innerHTML ="";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete)
        uncompletedBOOKList.append(bookElement);
        else 
        completedBOOKList.append(bookElement);
    }
});

function makeBook(bookObject) {
    const textTitle = document.createElement("h3");
    textTitle.innerText = bookObject.title;
 
    const textAuthor = document.createElement("p");
    textAuthor.innerText ="Penulis :    " + bookObject.author;
 
    const textYear = document.createElement("p");
    textYear.innerText ="Tahun :    " + bookObject.year;

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action")
 
    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(textTitle, textAuthor, textYear);
    container.append(buttonContainer);
    container.setAttribute("id", `book-${bookObject.id}`);
 
if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum selesai dibaca";
    undoButton.addEventListener("click",function(){
        addTaskFromCompleted(bookObject.id);
    });

    const eraseButton = document.createElement("button");
    eraseButton.classList.add("red");
    eraseButton.innerText = "Hapus Buku";
    eraseButton.addEventListener("click",function(){
        removeTaskFromCompleted(bookObject.id);
    });
    buttonContainer.append(undoButton, eraseButton);
} else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Selesai dibaca";
    checkButton.addEventListener("click",function(){
      addTaskToCompleted(bookObject.id);
    });
    
    const removeButton = document.createElement("button");
    removeButton.classList.add("red");
    removeButton.innerText = "Hapus Buku";
    removeButton.addEventListener("click",function(){
        removeTaskFromCompleted(bookObject.id);
    });
    buttonContainer.append(checkButton, removeButton)
    }
    return container;
    }

function  addTaskToCompleted(bookId){
    const bookTarget = findBook(bookId);
     
    if(bookTarget == null)return;
     
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();     
}
     
function  addTaskFromCompleted(bookId){
    const bookTarget = findBook(bookId);
     
    if(bookTarget == null)return;
     
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
          
function findBook(bookId){
    for(const bookItem of books){
     if(bookItem.id === bookId){
        return bookItem;
     }
    }
    return null;
}
         
function removeTaskFromCompleted(bookId){
    const bookTarget = findBookIndex(bookId);
 
    if(bookTarget === -1)return;
     
    books.splice(bookTarget,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();     
}
     
function findBookIndex(bookId){
    for(const index in books){
      if(books[index].id === bookId){
          return index;
        }
    }  
    return -1;
}

function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist(){
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}
