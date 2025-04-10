// app/health/route.ts
export async function GET() {
  return new Response(
    JSON.stringify({ status: "healthy", service: "frontend" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
