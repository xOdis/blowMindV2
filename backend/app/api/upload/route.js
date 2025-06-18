// /api/upload/route.js
export async function POST(req) {
  const form = await req.formData();
  const video = form.get("video");
  const videoUrl = form.get("videoUrl");
  const description = form.get("description");
  const directPublish = form.get("directPublish") === "true";
  const timer = parseInt(form.get("timer"));
  const token = req.headers.get("cookie")?.match(/tiktok_auth=([^;]+)/)?.[1];

  if (!token) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const postInfo = {
    title: description,
    privacy_level: "PUBLIC_TO_EVERYONE",
    disable_duet: false,
    disable_comment: false,
    disable_stitch: false,
    video_cover_timestamp_ms: 1000,
  };

  const sourceInfo = videoUrl
    ? { source: "PULL_FROM_URL", video_url: videoUrl }
    : {
        source: "FILE_UPLOAD",
        video_size: video.size,
        chunk_size: video.size,
        total_chunk_count: 1,
      };

  const res = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ post_info: postInfo, source_info: sourceInfo }),
  });

  const data = await res.json();
  return Response.json({ publish_id: data?.data?.publish_id });
}