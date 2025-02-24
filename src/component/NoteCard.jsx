import { useRef, useEffect } from "react";
import Trash from '../icons/Trash'

function NoteCard({ note }) {
    const body = JSON.parse(note.body)
    const position = JSON.parse(note.position)
    const colors = JSON.parse(note.colors)

    useEffect(() => {
        autoGrow(textAreaRef)
            , []
    })

    const textAreaRef = useRef(null)
    const autoGrow = (textAreaRef) => {
        const { current } = textAreaRef;
        current.style.height = "auto"; //reset the height
        current.style.height = current.scrollHeight + "px" //set current height

    }

    return (
        <div className="card" style={{
            backgroundColor: colors.colorBody,
            left: `${position.x}px`,
            top: `${position.y}px`,
        }}>

            <div className="card-header" style={{ backgroundColor: colors.colorHeader }}>
                <Trash />
            </div>

            <div className="card-body">
                <textarea
                    ref={textAreaRef}
                    defaultValue={body}
                    style={{ color: colors.colorText }}
                    onInput={() => { autoGrow(textAreaRef) }}
                >

                </textarea>
            </div>
        </div>
    )
}

export default NoteCard