import React, { useRef } from "react";

function CreateToDo({ addTask }) {
  const inputRef = useRef(null);

  async function handleAddFunctionality() {
    const title = inputRef.current.value;
    if (!title.trim()) {
      alert("Please enter a task");
      return;
    }
    addTask(title);
    inputRef.current.value = "";
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleAddFunctionality();
    }
  }

  return (
    <>
      <div className="task-container">
        <input
          type="text"
          placeholder="task"
          ref={inputRef}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleAddFunctionality}>Add</button>
      </div>
    </>
  );
}

export default CreateToDo;
