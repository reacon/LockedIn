/* eslint-disable no-unused-vars */
import {Children, React, createContext, useContext, useState} from "react";

const DragDropContext = createContext()

export const DragDropProvider = ({children}) =>{
const [draggedJob, setDraggedJob] = useState(null);
const [isDragging, setIsDragging] = useState(false);

return (
    <DragDropContext.Provider value = {{draggedJob,setDraggedJob,isDragging,setIsDragging}}>
        {children}
    </DragDropContext.Provider>
)
}
export const useDragDrop = () => {
    const context = useContext(DragDropContext)
    if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}