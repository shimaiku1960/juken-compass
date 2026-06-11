"use client";

import { useState, useEffect } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!title.trim()) return;

    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchTodos();
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });

    fetchTodos();
  };

  const deleteTodo = async (id: number) => {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    fetchTodos();
  };
  return (
    <div>
      <h1>Todoリスト</h1>

      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいTodoを入力"
        />
        <button onClick={addTodo}>追加</button>
      </div>
      <ul>                                                                                                                      
          {todos.map((todo) => (                                                                                                  
            <li key={todo.id}>                                                                                                    
              <input
                type="checkbox"                                                                                                   
                checked={todo.completed}                                                                                          
                onChange={() => toggleTodo(todo.id, todo.completed)}                                                              
              />                                                                                                                
              <span>{todo.title}</span>
              <button onClick={() => deleteTodo(todo.id)}>削除</button>
            </li>                         
          ))}
        </ul> 

    </div>
  );

};



export default TodoList; 