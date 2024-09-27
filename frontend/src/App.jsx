import { useState } from "react";
import React from "react";
import "./App.css";
import CreateToDo from "../components/CreateToDo";
import ToDos from "../components/ToDos";

function App() {
  const [tasks, setTasks] = React.useState([]);

  async function fetchToDos() {
    try {
      const response = await fetch("http://localhost:5000/todos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        alert("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error: ", error);
      // alert("An error has occurred");
    }
  }
  React.useEffect(() => {
    fetchToDos();
  }, []);

  async function addTask(title) {
    try {
      const response = await fetch("http://localhost:5000/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      if (response.ok) {
        console.log("Task added successfully");
        fetchToDos();
      } else {
        alert("Failed to add task");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("An error occured");
    }
  }

  async function toggleTaskCompleted(id) {
    try {
      const response = await fetch("http://localhost:5000/completed", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        console.log("Task status updated successfully");
        fetchToDos();
      } else {
        alert("Failed to update task status");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("An error occurred");
    }
  }

  async function removeCompleted(){
    try{
      const response = await fetch("http://localhost:5000/todos/completed", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Removed ", data, " tasks");
        fetchToDos();
      } else {
        alert("Failed to remove completed tasks");
      }

    }catch(error){
      console.error("Error: ",error);
      alert("An error occurred");
    }
  }

  async function removeAll() {
    try {
      const response = await fetch("http://localhost:5000/todos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Removed ", data, " tasks");
        fetchToDos();
      } else {
        alert("Failed to remove tasks");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("An error occurred");
    }
  }

  return (
    <>
      <h1> to do</h1>
      <ToDos tasks={tasks} toggleTaskCompleted={toggleTaskCompleted} />
      <CreateToDo addTask={addTask} />
      <button onClick={removeCompleted}>Remove Completed</button>
      <button onClick={removeAll}>Remove All</button>
    </>
  );
}

export default App;
