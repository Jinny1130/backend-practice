'use client'

import { resolve } from 'path';
import React, { useEffect, useState } from 'react';

interface Todo {
	id: string;
	content: string;
	modifyMode? : boolean
}

const TodoList: React.FC = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [input, setInput] = useState('');
	const [modifyInput, setModifyInput] = useState('');

	useEffect(() => {
		getTodoList();
	}, [])

	const getTodoList = async () => {
		try {
			const response = await fetch('http://localhost:3000/api/todos');
			const result = await response.json();
			
			if (!response.ok) {
				console.log(response.status, result.error);
				return
			}
			
			let todoListAddModifyMode = result.map((todo: Todo) => ({
				...todo,
				modifyMode: false
			}))
			setTodos(todoListAddModifyMode);

		} catch(err) {
			console.log(err)
		}
	}

	const addTodo = async () => {
		try {
			let addTodo = { 
				title: input.trim(),
				content: input.trim() 
			};

			const response = await fetch('http://localhost:3000/api/todos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(addTodo),
			})
			const result = await response.json();

			if (!response.ok) {
				console.log(response.status, result.error);
				return
			}

			getTodoList();

		} catch(err) {
			console.log(err);
		} finally {
			setInput('');
		}
	};

	const deleteTodo = async (id: string) => {
		try {
			const response = await fetch('http://localhost:3000/api/todos', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: id }),
			})

			if (!response.ok) {
				console.log(response);
				return
			}

			getTodoList();

		} catch(err) {
			console.log(err)
		}
	};

	const saveModifyTodo = async (id:string) => {
		try {
			const targetTodo: object = { 
				id: id, 
				content: modifyInput 
			}
			const response = await fetch('http://localhost:3000/api/todos', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(targetTodo)
			})

			if(!response.ok) {
				console.log(response)
				return
			}

			showModifyInput(targetTodo);
			getTodoList();

		} catch(err) {
			console.log(err);
		} finally {
			setModifyInput('');
		}
	}

	// 수정상태로 ui 노출
	const showModifyInput = (targetTodo: any) => {

		const updateTodos = todos.map(todo => {
			if(todo.id === targetTodo.id) {
				return {
					...todo,
					modifyMode: !todo.modifyMode
				}
			}
			return todo;
		});

		setTodos(updateTodos);
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
								value={modifyInput}
								onChange={(e) => setModifyInput(e.target.value)}
								className="flex-grow p-2 border rounded mr-2"
							/>
							:
							<p className="flex-grow p-2 rounded mr-2">{todo.content}</p>
						}
						<div className='flex'>
								<button onClick={() => [todo.modifyMode ? setModifyInput('') : setModifyInput(todo.content), showModifyInput(todo)]} className="bg-gray-500 text-white p-2 mr-2 rounded hover:bg-gray-700">
									{todo.modifyMode ? '취소' : '수정'}
								</button>
								<button onClick={() => todo.modifyMode ? saveModifyTodo(todo.id) : deleteTodo(todo.id)} 
											className={`${todo.modifyMode ? 'bg-sky-500 hover:bg-sky-700 rounded disabled:bg-slate-100' : 'bg-red-500 rounded hover:bg-red-700' } text-white p-2 rounded"`}
											disabled={todo.modifyMode ? !modifyInput || todo.content === modifyInput : false}>
												{todo.modifyMode ? '저장' : '삭제'}
								</button>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TodoList;