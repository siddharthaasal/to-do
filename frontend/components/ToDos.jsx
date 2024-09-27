// todos = [{title: task1 completed: false}]
import React from "react";
function ToDos({ tasks, toggleTaskCompleted }) {
  return (
    <>
      <ol
        className="tasks"
        style={{
          listStyleType: "none",
        }}
      >
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              textAlign: "left",
            }}
          >
            <h3>
              {/* &#9;  */}
              {task.title}
              &#9;
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompleted(task.id)}
              />
            </h3>
          </li>
        ))}
      </ol>
    </>
  );
}

export default ToDos;
