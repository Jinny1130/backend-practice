'use client'

import React, { useEffect, useState } from 'react';

interface Todo {
	id: string;
	text: string;
	modifyMode? : boolean
}

const TodoList: React.FC = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [input, setInput] = useState('');
	const [modifyValue, setModifyValue] = useState<Todo>();

	useEffect(() => {
		getTodoList();
	}, [])

	const getTodoList = () => {
		fetch('http://localhost:3000/api/todos')
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
				else {
					throw new Error('Network response was not ok');
				}
			})
			.then((result) => {
				let todoListAddModifyMode = result.map((todo: Todo) => ({
					...todo,
					modifyMode: false
				}))
				setTodos(todoListAddModifyMode);
			})
	}

	const addTodo = () => {
		let addTodo ={ text : input.trim() };
		fetch('http://localhost:3000/api/todos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(addTodo),
		})
		.then((response) => {
			if (response.ok) {
				getTodoList();
				return
			}
			else {
				throw new Error(`${response.status} : ${response.statusText}`);
			}
		})
		.catch(err => {
			return alert(err);
		})
		setInput('');
	};

	const updateTodo = (id: string, newText: string) => {
		// setTodos(todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
		fetch('http://localhost:3000/api/todos', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: id, text: newText })
		})
		.then(response => {
			if(response.ok) {
				getTodoList();
				return
			}
			else {
				throw new Error(`${response.status} : ${response.statusText}`);
			}
		})
		.catch(err => {
			return alert(err);
		})
	};

	const deleteTodo = (id: string) => {
		fetch('http://localhost:3000/api/todos', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: id }),
		})
		.then((response) => {
			if(response.ok) {
				getTodoList();
				return
			}
			else {
				throw new Error(`${response.status} : ${response.statusText}`);
			}
		})
		.catch(err => {
			return alert(err);
		})
	};

	const saveModifyTodo = (id:string) => {

	}

	const modifyTodo = (modifyMode: any) => {

	}

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">할 일 목록</h1>
			<div className="flex mb-4">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="flex-grow p-2 border rounded-l"
					placeholder="새로운 할 일을 입력하세요"
				/>
				<button disabled={input.trim() === ''} onClick={addTodo} className="bg-blue-500 text-white p-2 rounded-r disabled:bg-slate-100">추가</button>
			</div>
			<ul>
				{todos.map(todo => (
					<li key={todo.id} className="flex items-center mb-2">
						{
							todo.modifyMode ? 
							<input
								type="text"
								value={todo.text}
								onChange={(e) => updateTodo(todo.id, e.target.value)}
								className="flex-grow p-2 border rounded mr-2"
							/>
							:
							<p className="flex-grow p-2 rounded mr-2">{todo.text}</p>
						}
						<div className='flex'>
								<button onClick={() => modifyTodo(todo.modifyMode)} className="bg-gray-500 text-white p-2 mr-2 rounded hover:bg-gray-700">{todo.modifyMode ? '취소' : '수정'}</button>
								<button onClick={() => todo.modifyMode ? saveModifyTodo(todo.id) : deleteTodo(todo.id)} 
											className={`${todo.modifyMode ? 'bg-sky-500 hover:bg-sky-700' : 'bg-red-500 hover:bg-red-700' } text-white p-2 rounded"`}>
												{todo.modifyMode ? '저장' : '삭제'}
								</button>
						</div>
						<p>modify: {todo.modifyMode ? 'true' : 'false'}</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TodoList;