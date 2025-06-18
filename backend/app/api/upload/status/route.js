// /api/upload/status/route.js
export async function GET(req) {
  const url = new URL(req.url);
  const publish_id = url.searchParams.get("publish_id");

  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.match(/tiktok_auth=([^;]+)/)?.[1];
  if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const res = await fetch("https://open.tiktokapis.com/v2/post/publish/status/fetch/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publish_id }),
  });

  const data = await res.json();
  return Response.json(data);
}