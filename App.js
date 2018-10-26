"use strict";
let notes = new Set();

function addNote(title, description) {
    let targetElement = document.querySelector(".container");

    let noteObj = new Note(title, description);
    let writer = new NoteRender(targetElement);
    let noteController = new EventHandler(writer, noteObj);

    notes.add(noteObj);
    noteController.showNote();
}

function save() {
    localStorage.setItem("notes", JSON.stringify([...notes]));
}

function load() {
    let localNotes = JSON.parse(localStorage.getItem("notes"));
    if(localNotes !== null) {
        for(let note of localNotes) {
            let title = note._title;
            let description = note._description;
            addNote(title, description);
        }
    }
}

function remove(note) {
    notes.delete(note);
}

function createEmptyNote() {
    let title = "Click to edit";
    let description = "Click to edit";

    addNote(title, description);
}

function addListeners() {
    document.getElementById("add-note-button").addEventListener("click", createEmptyNote);

}

function init() {
    addListeners();
    load();
}

class Note {
    constructor(title, description) {
        this._title = title;
        this._description = description;
    }

    get description() {
        return this._description;
    }

    set description(description) {
        this._description = description;
    }

    get title() {
        return this._title;
    }

    set title(title) {
        this._title = title;
    }

}

class NoteRender {
    constructor(element) {
        this._element = element;
        this.handleClose = null;
        this.handleTitleChange = null;
        this.handleNoteChange = null;
    }

//     addEventsListeners() {
//        console.log("get in");
//         let titles = this._element.getElementsByClassName("note-title");
//         for(let title of titles) {
//            title.addEventListener("input", this.handleTitleChange);
//         }
//         let descriptions = this._element.getElementsByClassName("note-description");
//         for(let desc of descriptions) {
//            desc.addEventListener("input", this.handleNoteChange);
//         }
//         let buttons = this._element.getElementsByClassName("close-button");
//         for(let butt of buttons) {
//            butt.addEventListener("click", this.handleClose);
//         }
//     }
//
//    render(noteObj){
//        let titleValue = noteObj.title;
//        let descValue = noteObj.description;
//                console.log("create element");
//
//        return "<div class=\"note\"><div class=\"note-bar\">" +
//                           "<textarea class=\"note-title\">" + titleValue + "</textarea>" +
//                           "<button class=\"close-button\">Delete</button></div>" +
//                           "<textarea class=\"note-description\">" + descValue + "</textarea></div>";
//
//    }

        render(noteObj) {
            let note = document.createElement("div");
            let noteBar = document.createElement("div");
            let titleArea = document.createElement("textarea");
            let closeButton = document.createElement("button");
            let descriptionArea = document.createElement("textarea");

            closeButton.addEventListener("click", this.handleClose);
            titleArea.addEventListener("input", this.handleTitleChange);
            descriptionArea.addEventListener("input", this.handleNoteChange);
            closeButton.innerHTML = "Delete";
            titleArea.value = noteObj.title;
            descriptionArea.value = noteObj.description;

            note.classList.add("note");
            noteBar.classList.add("note-bar");
            titleArea.classList.add("note-title");
            closeButton.classList.add("close-button");
            descriptionArea.classList.add("note-description");

            noteBar.appendChild(titleArea);
            noteBar.appendChild(closeButton);
            note.appendChild(noteBar);
            note.appendChild(descriptionArea);

            this._element.appendChild(note);
        }
}

class EventHandler {
    constructor (writer, noteObj) {
        this._writer = writer;
        this._noteObj = noteObj;
        this.initialize();
    }

    initialize() {
        this._writer.handleClose = this.handleClose.bind(this);
        this._writer.handleTitleChange = this.handleTitleChange.bind(this);
        this._writer.handleNoteChange = this.handleNoteChange.bind(this);
    }

    showNote() {
        this._writer.render(this._noteObj);
    }

    handleClose(e){
        let closeButton = e.target;
        closeButton.parentElement.parentElement.remove();
        remove(this._noteObj);
    }

    handleTitleChange(e) {
        let titleText = e.target.value;
        this._noteObj.title = titleText;
    }

    handleNoteChange(e) {
        let description = e.target.value;
        this._noteObj.description = description;
    }
}