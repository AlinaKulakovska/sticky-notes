import { useRef, useEffect, useState, useContext } from "react";
import Spinner from "../icons/Spiner";
import { db } from "../appwrite/database";
import DeleteButton from "./DeleteButton";
import { setNewOffset, autoGrow, setZIndex, bodyParser } from "../utils";
import { NoteContext } from "../context/NoteContext";

function NoteCard({ note, setNotes }) {
    const [saving, setSaving] = useState(false);
    const keyUpTimer = useRef(null);

    const body = bodyParser(note.body)
    const [position, setPositon] = useState(JSON.parse(note.position))
    const colors = JSON.parse(note.colors)

    let mouseStartPos = { x: 0, y: 0 };
    const cardRef = useRef(null);

    useEffect(() => {
        autoGrow(textAreaRef);
        setZIndex(cardRef.current);
    }, []);

    const textAreaRef = useRef(null)

    const { setSelectedNote } = useContext(NoteContext);
    const mouseDown = (e) => {
        
        if(e.target.className === "card-header"){
            mouseStartPos.x = e.clientX;
            mouseStartPos.y = e.clientY;
    
            document.addEventListener("mousemove", mouseMove);
            document.addEventListener("mouseup", mouseUp);
    
            setZIndex(cardRef.current)
            setSelectedNote(note);
        }
    };


    const mouseMove = (e) => {
        //1 - Calculate move direction
        let mouseMoveDir = {
            x: mouseStartPos.x - e.clientX,
            y: mouseStartPos.y - e.clientY,
        };

        //2 - Update start position for next move.
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
        setPositon(newPosition);
    };

    const mouseUp = () => {
        document.removeEventListener("mousemove", mouseMove)
        document.removeEventListener("mouseUp", mouseUp)

        const newPosition = setNewOffset(cardRef.current)
        saveData('position', newPosition)
    }

    const saveData = async (key, value) => {
        const payload = { [key]: JSON.stringify(value) };

        try {
            await db.notes.update(note.$id, payload)
        } catch (error) {
            console.log(error);
        }
        setSaving(false);
    }

    const handleKeyUp = async () => {
        //1 - Initiate "saving" state
        setSaving(true);
     
        //2 - If we have a timer id, clear it so we can add another two seconds
        if (keyUpTimer.current) {
            clearTimeout(keyUpTimer.current);
        }
     
        //3 - Set timer to trigger save in 2 seconds
        keyUpTimer.current = setTimeout(() => {
            saveData("body", textAreaRef.current.value);
        }, 2000);
    };

    return (
        <div className="card"
            ref={cardRef}
            style={{
                backgroundColor: colors.colorBody,
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}>

            <div className="card-header"
                onMouseDown={mouseDown}
                style={{ backgroundColor: colors.colorHeader }}>
                <DeleteButton  noteId={note.$id}/>
                {saving && (
                    <div className="card-saving">
                        <Spinner color={colors.colorText} />
                        <span style={{ color: colors.colorText }}>
                            Saving...
                        </span>
                    </div>
                )}
            </div>

            <div className="card-body">
                <textarea
                    ref={textAreaRef}
                    defaultValue={body}
                    style={{ color: colors.colorText }}
                    onKeyUp={handleKeyUp}
                    onInput={() => { autoGrow(textAreaRef) }}
                    onFocus={() => {
                        setZIndex(cardRef.current);
                        setSelectedNote(note);
                    }}
                >

                </textarea>
            </div>
        </div>
    )
}

export default NoteCard