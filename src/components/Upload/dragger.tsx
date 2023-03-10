import classNames from "classnames";
import React, { FC, useState, DragEvent } from "react";


interface DraggerProps {
    onFile: (files: FileList) => void
}

export const Dragger: FC<DraggerProps> = (props) => {
    const {onFile, children} = props
    const [dragOver, setDragOver] = useState(false)
    const classes = classNames('ddw-uploader-dragger', {
        'is-dragover': dragOver
    })

    const handleDrag = (e: DragEvent<HTMLElement>, over: boolean) => {
        e.preventDefault()
        setDragOver(over)
    }

    const handleDrop = (e: DragEvent<HTMLElement>) => {
        e.preventDefault()
        setDragOver(false)
        onFile(e.dataTransfer.files)
    }
    

    return (
        <div
            className={classes}
            onDragOver={e => {handleDrag(e, true)}}
            onDrop={handleDrop}
        >
            {children}
        </div>
    )
}

export default Dragger