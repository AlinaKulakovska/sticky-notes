import React from "react"
import NoteCard from "../component/NoteCard"
import { fakeData as notes } from "../assets/fakeDate"

function NotesPage() {

    return (
        <div>
            {notes.map(note => (
                <NoteCard key={note.$id} note={note}/>
            ))}
        </div>
    )
}

export default NotesPage