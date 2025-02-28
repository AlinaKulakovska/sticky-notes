import { useRef, useEffect, useState } from "react";
import Trash from '../icons/Trash'
import { setNewOffset, autoGrow, setZIndex, bodyParser} from "../utils";

function NoteCard({ note }) {
    const body = bodyParser(note.body)
    const [position, setPositon] = useState(JSON.parse(note.position))
    const colors = JSON.parse(note.colors)

    let mouseStartPos = { x: 0, y: 0 };
    const cardRef = useRef(null);

    useEffect(() => {
        autoGrow(textAreaRef)
            , []
    })

    const textAreaRef = useRef(null)
    // const autoGrow = (textAreaRef) => {
    //     const { current } = textAreaRef;
    //     current.style.height = "auto"; //reset the height
    //     current.style.height = current.scrollHeight + "px" //set current height
    // }

    const mouseDown = (e) => {
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);

        setZIndex(cardRef.current)
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
    }

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
                <Trash />
            </div>

            <div className="card-body">
                <textarea
                    ref={textAreaRef}
                    defaultValue={body}
                    style={{ color: colors.colorText }}
                    onInput={() => { autoGrow(textAreaRef) }}
                    onFocus={() => {
                        setZIndex(cardRef.current);
                    }}
                >

                </textarea>
            </div>
        </div>
    )
}

export default NoteCard