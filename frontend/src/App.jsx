// BlowMind TikTok Uploader - Frontend Demo
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export default function BlowMindUploader() {
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState("");
  const [timer, setTimer] = useState(10);
  const [directPublish, setDirectPublish] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [useUrl, setUseUrl] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetch("/api/auth/status")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          setUsername(data.username);
        }
      });
  }, []);

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("directPublish", directPublish);
    if (!directPublish) formData.append("timer", timer);
    if (useUrl) {
      formData.append("videoUrl", videoUrl);
    } else {
      formData.append("video", video);
    }
    fetch("/api/upload", { method: "POST", body: formData });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-2xl shadow-xl">
      <h1 className="text-2xl font-bold mb-4">🎥 BlowMind TikTok Uploader</h1>

      {!isAuthenticated ? (
        <div className="mb-4">
          <Label>Login with TikTok</Label>
          <Button className="mt-2 w-full" onClick={() => window.location.href = "/api/auth/tiktok"}>Connect TikTok</Button>
        </div>
      ) : (
        <div className="mb-4">
          <Label>Logged in as:</Label>
          <div className="mt-1 font-medium">@{username}</div>
        </div>
      )}

      <div className="mb-4">
        <Label>Description</Label>
        <Textarea className="mt-2" value={description} onChange={e => setDescription(e.target.value)} disabled={!isAuthenticated} />
      </div>

      <div className="mb-4">
        <Label>Video Source</Label>
        <div className="flex items-center gap-4 mt-2">
          <label className="flex items-center gap-1">
            <input type="radio" checked={!useUrl} onChange={() => setUseUrl(false)} disabled={!isAuthenticated} /> Upload
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" checked={useUrl} onChange={() => setUseUrl(true)} disabled={!isAuthenticated} /> URL
          </label>
        </div>
      </div>

      {!useUrl ? (
        <div className="mb-4">
          <Label>Select video</Label>
          <Input className="mt-2" type="file" accept="video/*" onChange={e => setVideo(e.target.files[0])} disabled={!isAuthenticated} />
        </div>
      ) : (
        <div className="mb-4">
          <Label>Paste video URL</Label>
          <Input className="mt-2" type="text" placeholder="https://..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} disabled={!isAuthenticated} />
        </div>
      )}

      {!directPublish && (
        <div className="mb-4">
          <Label>⏰ Delay before publishing (seconds)</Label>
          <Slider defaultValue={[timer]} min={0} max={60} step={5} onValueChange={val => setTimer(val[0])} disabled={!isAuthenticated || useUrl} />
          <div className="text-sm text-muted-foreground mt-1">{timer} seconds</div>
        </div>
      )}

      <div className="mb-4 flex items-center gap-2">
        <Switch checked={directPublish} onCheckedChange={setDirectPublish} disabled={!isAuthenticated} />
        <Label className="cursor-pointer">Directly publish</Label>
      </div>

      <Button className="w-full mt-4" onClick={handleUpload} disabled={!isAuthenticated}>🚀 Upload</Button>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <a href="/terms" className="underline mr-4">Terms of Service</a>
        <a href="/privacy" className="underline">Privacy Policy</a>
      </div>
    </div>
  );
}