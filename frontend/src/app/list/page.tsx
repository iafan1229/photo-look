import { connectDB } from "@/util/database";

export default async function List() {
  const client = await connectDB;
  const db = client.db("sample_mflix");
  // 해당 collection 의 모든 데이터를 가져옴.
  const result = await db.collection("comments").find().toArray();

  console.log(result);

  return (
    <div>
      {/* {result.map((item: { title: string; content: string }, idx: number) => (
        <>
          <div className={style["list-item"]} key={idx}>
            <h4>{item.title}</h4>
            <p>{item.content}</p>
          </div>
        </>
      ))} */}
    </div>
  );
}
