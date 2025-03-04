import {useContext} from "react"
import NoteCard from "../component/NoteCard"
import Controls from "../component/Controls";
import { NoteContext } from "../context/NoteContext";

function NotesPage() {
    const {notes} = useContext(NoteContext)
    return (
        <div>
            {notes.map(note => (
                <NoteCard key={note.$id} note={note}/>
            ))}
            <Controls/>
        </div>
    )
}

export default NotesPage