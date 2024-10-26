import { client, connect, disconnect } from '@/models/mongodb';
import { ObjectId } from 'mongodb';
import NotFoundError from '@/errors/NotFoundError';

const dbName = 'todo-app';
const collectionName = 'todos';

// _id를 id로 변환하는 함수 추가
function transformId(doc: any) {
    if (doc._id) {
        doc.id = doc._id.toString();
        delete doc._id;
    }
    return doc;
}

// CRUD 중 Read 
export async function getTodos(id?: string | null) {
    try {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        if (id) {
            // 단건 조회
            const todo = await collection.findOne({ _id: new ObjectId(id) });
            if (todo) {
                return transformId(todo);
            } else {
                throw new NotFoundError('할 일을 찾을 수 없습니다.');
            }
        }

        // 다건 조회
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

// CRUD 중 Create
export async function addTodo(todo: object) {
    try {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

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
export async function modifyTodo(modifyTodo: any) {
    try {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const { id, ...updateData } = modifyTodo;
        const updatedTodo = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: 'after' }
        )

        console.log(updatedTodo);

        return transformId(updatedTodo)

    } catch(error) {
        throw new Error('할일을 수정 중 오류가 발생했습니다.')
    } finally {
        await disconnect();
    }
}

// CRUD 중 Delete
export async function deleteTodo(todo: any) {
    try {
        await connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        const result = await collection.findOneAndDelete({ _id: new ObjectId(todo.id) });

        return result;

    } catch (error) {
        throw new Error('할일을 삭제 중 오류가 발생했습니다.');
    } finally {
        await disconnect();
    }
}