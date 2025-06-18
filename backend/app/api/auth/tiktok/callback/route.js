// /api/auth/tiktok/callback/route.js
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY,
      client_secret: process.env.TIKTOK_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: "https://your-domain.com/api/auth/tiktok/callback"
    }),
  });

  const data = await res.json();
  if (data.access_token) {
    return new Response(null, {
      status: 302,
      headers: {
        "Set-Cookie": `tiktok_auth=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
        "Location": "/"
      }
    });
  } else {
    return new Response("Authentication failed", { status: 401 });
  }
}