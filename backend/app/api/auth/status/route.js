// /api/auth/status/route.js
export async function GET(req) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.match(/tiktok_auth=([^;]+)/)?.[1];
  if (!token) return Response.json({ authenticated: false });

  const res = await fetch("https://open.tiktokapis.com/v2/user/info/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (json.data?.user?.username) {
    return Response.json({ authenticated: true, username: json.data.user.username });
  }
  return Response.json({ authenticated: false });
}