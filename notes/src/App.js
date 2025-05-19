import React, { useState, useEffect } from "react";
import uuid from "react-uuid";
import './App.css';
import Sidebar from "./Sidebar";
import Main from "./Main";

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(false);

  // Fetch all notes on component mount
  useEffect(() => {
  async function fetchNotes() {
    try {
      const resp = await fetch("http://localhost:8080/api/v1/notes");
      if (!resp.ok) throw new Error(resp.statusText);
      const data = await resp.json();
      const mapped = data.map(n => ({
        id: n.id,
        title: n.title,
        body: n.content,
        lastModified: Date.now(),
      }));
      setNotes(mapped);
    } catch (err) {
      console.error("Fetch notes failed:", err);
    }
  }
  fetchNotes();
}, []);


  const onAddNote = () => {
    const newNote = {
      id: uuid(),
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
    };

    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
  };

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArray = notes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotesArray);
  };

  const onDeleteNote = (idToDelete) => {
    setNotes(notes.filter((note) => note.id !== idToDelete));
    if (activeNote === idToDelete) setActiveNote(false);
  };

  const getActiveNote = () => notes.find((note) => note.id === activeNote);

  return (
    <div className="App">
      <Sidebar
        notes={notes}
        onAddNote={onAddNote}
        onDeleteNote={onDeleteNote}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Main
        activeNote={getActiveNote()}
        onUpdateNote={onUpdateNote}
      />
    </div>
  );
}

export default App;
