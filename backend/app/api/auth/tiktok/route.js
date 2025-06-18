// /api/auth/tiktok/route.js
export async function GET() {
  const redirectUri = encodeURIComponent("https://your-domain.com/api/auth/tiktok/callback");
  const scope = encodeURIComponent("video.list video.upload video.publish");
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const state = crypto.randomUUID();
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&state=${state}`;
  return Response.redirect(authUrl);
}