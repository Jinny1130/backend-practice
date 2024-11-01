import { client, connect, disconnect } from '@/models/mongodb';
import { ObjectId } from 'mongodb';
import NotFoundError from '@/errors/NotFoundError';
import { Todo, Id as TodoId } from '@/types/Todo';

const dbName = 'todo-app';
const collectionName = 'todos';

// CRUD 중 Read - 다건조회
export async function getTodos(): Promise<Todo[]> {
    try {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const todos = await collection.find({}).toArray();
        return todos.map(transformId);

    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        } else {
            throw new Error('서버 오류가 발생했습니다.');
        }
    } finally {
        await disconnect();
    }
}

// CRUD 중 Read - 단건조회
export async function getTodo(id: TodoId): Promise<Todo> {
    try {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const todo = await collection.findOne({ _id: new ObjectId(id) });

        if (todo) {
            return transformId(todo);
        } else {
            throw new NotFoundError('할 일을 찾을 수 없습니다.');
        }

    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        } else {
            throw new Error('서버 오류가 발생했습니다.');
        }
    } finally {
        await disconnect();
    }
}

// CRUD 중 Create
export async function addTodo(todo: Todo): Promise<Todo> {
    try {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        todo.createdAt = new Date();
        const result = await collection.insertOne(todo);
        const newTodo = await collection.findOne({ _id: result.insertedId });

        return transformId(newTodo);

    } catch (error) {
        throw new Error('할일을 추가 중 오류가 발생했습니다.');
    } finally {
        await disconnect();
    }
}

// CRUD 중 Update
export async function modifyTodo(todo: Todo): Promise<Todo> {
    try {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const { id, ...updateData } = todo;
        updateData.updatedAt = new Date();

        const updatedTodo = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        )

        return transformId(updatedTodo)

    } catch(error) {
        throw new Error('할일을 수정 중 오류가 발생했습니다.')
    } finally {
        await disconnect();
    }
}

// CRUD 중 Delete
export async function deleteTodo(todo: Todo): Promise<void> {
    try {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        await collection.findOneAndDelete({ _id: new ObjectId(todo.id) });

    } catch (error) {
        throw new Error('할일을 삭제 중 오류가 발생했습니다.');
    } finally {
        await disconnect();
    }
}

// _id를 id로 변환하는 함수 추가
function transformId(doc: any) {
    if (doc._id) {
        doc.id = doc._id.toString();
        delete doc._id;
    }
    return doc;
}