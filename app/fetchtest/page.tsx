export default async function FetchTest() {
    const response = await fetch('http://localhost:3000/api/hello');
    const data = await response.json();
    return <div>{data.message}</div>;

}
