"""
Haptags self-hosted inference service.

Wraps three open-weight models behind a tiny HTTP API so the Node API can
call a local model instead of a third-party AI provider:
  - image: segmind/tiny-sd (Stable Diffusion, distilled for speed)
  - audio: Piper TTS (en_US-lessac-medium voice)
  - video: damo-vilab/text-to-video-ms-1.7b (proof-of-concept, CPU-only —
    expect several minutes per clip; there is no GPU on this host)

All models load lazily on first use and stay cached in memory for the life
of the process, since loading alone takes tens of seconds.
"""

import io
import subprocess
import sys
import tempfile
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel

APP_DIR = Path(__file__).parent
VOICE_MODEL = APP_DIR / "voices" / "en_US-lessac-medium.onnx"

app = FastAPI(title="Haptags Inference Service")

_image_pipe = None
_video_pipe = None


def get_image_pipe():
    global _image_pipe
    if _image_pipe is None:
        import torch
        from diffusers import StableDiffusionPipeline

        _image_pipe = StableDiffusionPipeline.from_pretrained(
            "segmind/tiny-sd",
            dtype=torch.float32,
            safety_checker=None,
        ).to("cpu")
    return _image_pipe


def get_video_pipe():
    global _video_pipe
    if _video_pipe is None:
        import torch
        from diffusers import DiffusionPipeline

        _video_pipe = DiffusionPipeline.from_pretrained(
            "damo-vilab/text-to-video-ms-1.7b",
            dtype=torch.float32,
        ).to("cpu")
    return _video_pipe


class ImageRequest(BaseModel):
    prompt: str
    steps: int = 15
    width: int = 512
    height: int = 512


class AudioRequest(BaseModel):
    text: str


class VideoRequest(BaseModel):
    prompt: str
    steps: int = 10
    frames: int = 8
    width: int = 256
    height: int = 256


@app.get("/health")
def health():
    return {
        "status": "ok",
        "imageLoaded": _image_pipe is not None,
        "videoLoaded": _video_pipe is not None,
    }


@app.post("/generate/image")
def generate_image(req: ImageRequest):
    try:
        pipe = get_image_pipe()
        image = pipe(
            req.prompt,
            num_inference_steps=req.steps,
            width=req.width,
            height=req.height,
        ).images[0]
    except Exception as exc:  # noqa: BLE001 - surfaced to the caller as-is
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    buf = io.BytesIO()
    image.save(buf, format="PNG")
    return Response(content=buf.getvalue(), media_type="image/png")


@app.post("/generate/audio")
def generate_audio(req: AudioRequest):
    if not VOICE_MODEL.exists():
        raise HTTPException(status_code=500, detail=f"Voice model not found at {VOICE_MODEL}")

    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
        tmp_path = Path(tmp.name)

    try:
        result = subprocess.run(
            [
                sys.executable,
                "-m",
                "piper",
                "-m",
                str(VOICE_MODEL),
                "-f",
                str(tmp_path),
            ],
            input=req.text,
            text=True,
            capture_output=True,
            timeout=60,
        )
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=result.stderr[-2000:])
        audio_bytes = tmp_path.read_bytes()
    finally:
        tmp_path.unlink(missing_ok=True)

    return Response(content=audio_bytes, media_type="audio/wav")


@app.post("/generate/video")
def generate_video(req: VideoRequest):
    from diffusers.utils import export_to_video

    try:
        pipe = get_video_pipe()
        frames = pipe(
            req.prompt,
            num_inference_steps=req.steps,
            num_frames=req.frames,
            height=req.height,
            width=req.width,
        ).frames[0]
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    # This legacy pipeline returns frames as float32 in [0, 1] (confirmed by
    # direct inspection), but export_to_video's writer needs uint8 [0, 255] —
    # feeding it float32 directly produces static/noise instead of a video.
    import numpy as np

    frames_uint8 = (np.clip(frames, 0, 1) * 255).round().astype(np.uint8)

    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as tmp:
        tmp_path = Path(tmp.name)
    try:
        export_to_video(list(frames_uint8), str(tmp_path), fps=4)
        video_bytes = tmp_path.read_bytes()
    finally:
        tmp_path.unlink(missing_ok=True)

    return Response(content=video_bytes, media_type="video/mp4")
