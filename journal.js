
const journalForm = document.getElementById("journal-form");
const journalBook = document.getElementById("journal-book");
const journalDate = document.getElementById("journal-date");
const journalNotes = document.getElementById("journal-notes");

const journalSave = document.getElementById("journal-save");
const journalCancel = document.getElementById("journal-cancel");
const journalMessage = document.getElementById("journal-message");
const journalEntryList = document.getElementById("journal-entry-list");

const journalMainView = document.getElementById("journal-main-view");
const journalEntriesView = document.getElementById("journal-entries-view");

const showPreviousEntries = document.getElementById("show-previous-entries");
const backToJournal = document.getElementById("back-to-journal");

const journalStorageKey = "reading-journal-entries";

let journalEntries = JSON.parse(
    localStorage.getItem(journalStorageKey) || "[]"
);

let editingJournalId = null;


// Get today's date in local time.
function getLocalDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// Save entries to localStorage.
function saveJournalEntries() {
    localStorage.setItem(
        journalStorageKey,
        JSON.stringify(journalEntries)
    );
}


// Create an element safely using textContent.
function createJournalText(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    element.textContent = text;

    return element;
}


// Display all saved entries.
function renderJournalEntries() {

    journalEntryList.replaceChildren();

    if (journalEntries.length === 0) {

        journalEntryList.appendChild(
            createJournalText(
                "p",
                "journal-empty",
                "Your journal is empty. Write your first entry!"
            )
        );

        return;
    }

    const sortedEntries = [...journalEntries].sort((a, b) => {
        return b.date.localeCompare(a.date);
    });

    sortedEntries.forEach((entry) => {

        const card = document.createElement("article");
        card.className = "journal-entry";

        card.appendChild(
            createJournalText("h4", "", entry.book)
        );

        card.appendChild(
            createJournalText("p", "journal-meta", entry.date)
        );

        if (entry.notes && entry.notes.trim()) {

            const notes = createJournalText(
                "p",
                "journal-notes",
                entry.notes
            );

            notes.style.whiteSpace = "pre-wrap";
            card.appendChild(notes);
        }

        // Edit button
        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editJournalEntry(entry.id);
        });

        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteJournalEntry(entry.id);
        });

        card.appendChild(editButton);
        card.appendChild(deleteButton);

        journalEntryList.appendChild(card);
    });
}


// Reset the form after saving or cancelling.
function resetJournalForm() {

    journalForm.reset();

    journalDate.value = getLocalDate();

    editingJournalId = null;

    journalSave.textContent = "Save Entry";
    journalCancel.hidden = true;
}


// Save a new entry or update an existing one.
journalForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const entry = {
        id: editingJournalId || String(Date.now()),
        book: journalBook.value,
        date: journalDate.value,
        notes: journalNotes.value.trim()
    };

    if (!entry.notes) {

        journalMessage.textContent = "Write something before saving.";
        return;
    }

    if (editingJournalId !== null) {

        journalEntries = journalEntries.map((oldEntry) =>
            oldEntry.id === editingJournalId ? entry : oldEntry
        );

        journalMessage.textContent = "Entry updated!";

    } else {

        journalEntries.push(entry);

        journalMessage.textContent = "Entry saved!";
    }

    saveJournalEntries();

    renderJournalEntries();

    resetJournalForm();
});


// Load an entry into the form for editing.
function editJournalEntry(id) {

    const entry = journalEntries.find(
        (item) => item.id === id
    );

    if (!entry) return;

    journalBook.value = entry.book;
    journalDate.value = entry.date;
    journalNotes.value = entry.notes || "";

    editingJournalId = id;

    journalSave.textContent = "Update Entry";
    journalCancel.hidden = false;
    journalMessage.textContent = "Editing your entry.";

    // Return to the writing screen.
    journalEntriesView.hidden = true;
    journalMainView.hidden = false;

    journalForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// Delete an entry.
function deleteJournalEntry(id) {

    if (!confirm("Are you sure you want to delete this journal entry?")) {
        return;
    }

    journalEntries = journalEntries.filter(
        (entry) => entry.id !== id
    );

    saveJournalEntries();

    renderJournalEntries();

    if (editingJournalId === id) {
        resetJournalForm();
    }
}


// Cancel editing.
journalCancel.addEventListener("click", () => {

    resetJournalForm();

    journalMessage.textContent = "Editing cancelled.";
});


// Open previous entries.
showPreviousEntries.addEventListener("click", () => {

    journalMainView.hidden = true;
    journalEntriesView.hidden = false;

    renderJournalEntries();
});


// Return to the writing screen.
backToJournal.addEventListener("click", () => {

    journalEntriesView.hidden = true;
    journalMainView.hidden = false;
});


// Initialize the journal.
journalDate.value = getLocalDate();

renderJournalEntries();
