import { MongoClient, ServerApiVersion } from 'mongodb';

const uri: string = "mongodb+srv://cwjin94:1q2w3e4r@cluster0.hw55t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoClient 생성
const client: MongoClient = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function connect(): Promise<void> {
    try {
        // 서버에 클라이언트 연결 (v4.7부터는 선택사항)
        await client.connect();
        // 성공적인 연결 확인을 위한 ping 전송
        await client.db("todo-app").command({ ping: 1 });
        console.log("MongoDB 연결 성공");
    } catch (error) {
        console.error("MongoDB 연결 중 오류 발생 : ", error);
        throw error;
    }
}

export async function disconnect(): Promise<void> {
    await client.close();
    console.log("MongoDB 연결 종료");
}

export { client };