from pathlib import Path

import numpy as np
from PIL import Image, ImageStat


SOURCE = Path(
    r"C:\Users\58007\.codex\generated_images\019e4df4-b9ee-7850-bbea-8e1c599c6b3f\ig_049d8a1460765508016a20d02f8f3c81919df22b7d52d980cb.png"
)
OUT = Path("public/andy-d-minimal-sketch.png")
PREVIEW = Path("review-minimal-sketch-preview.png")


im = Image.open(SOURCE).convert("RGB")
arr = np.asarray(im).astype(np.float32)
lum = arr.mean(axis=2)

# Keep only charcoal-like strokes; remove the rendered checkerboard and white fill.
alpha = np.clip((212 - lum) * 3.4, 0, 238).astype(np.uint8)
alpha[alpha < 18] = 0

rgba = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
rgba[:, :, 0] = 46
rgba[:, :, 1] = 46
rgba[:, :, 2] = 42
rgba[:, :, 3] = alpha

out = Image.fromarray(rgba, "RGBA")
bbox = out.getbbox()
if bbox:
    out = out.crop(bbox)

out.save(OUT)
bg = Image.new("RGBA", out.size, (248, 246, 238, 255))
bg.alpha_composite(out)
bg.save(PREVIEW)

stat = ImageStat.Stat(out.getchannel("A"))
print(out.size, stat.extrema, round(stat.mean[0], 2))
