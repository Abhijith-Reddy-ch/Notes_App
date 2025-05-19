import React from "react";

function Main({ activeNote, onUpdateNote }) {
  const onEditField = (key, value) => {
    onUpdateNote({
      ...activeNote,
      [key]: value,
      lastModified: Date.now(),
    });
  };

  

  const saveNote = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeNote.title,
          content: activeNote.body,
        }),
      });
      console.log("Response:", response);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error saving note:", errorText);
        alert("Failed to save note: " + errorText);
      } else {
        const data = await response.json();
        console.log("Saved note with id:", data.id);
        alert("Note saved with id: " + data.id);
      }
    } catch (error) {
      console.error("Error note:", error);
      alert("Error saving note: " + error.message);
    }
  };

  if (!activeNote) return <div className="no-active-note">No Note Selected</div>;

  return (
    <div className="app-main">
      <div className="app-main-note-edit">
        <input
          type="text"
          id="title"
          value={activeNote.title}
          onChange={(e) => onEditField("title", e.target.value)}
          autoFocus
        />
        <textarea
          id="body"
          placeholder="Write your note here..."
          value={activeNote.body}
          onChange={(e) => onEditField("body", e.target.value)}
        />
        <button onClick={saveNote}>Save</button>
      </div>
      <div className="app-main-note-preview">
        <h1 className="preview-title">{activeNote.title}</h1>
        <div className="markdown-preview">{activeNote.body}</div>
      </div>
    </div>
  );
}

export default Main;
