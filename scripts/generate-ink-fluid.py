from pathlib import Path
import math
import random

import numpy as np
from PIL import Image, ImageFilter


OUT = Path("public/ink-fluid-body.png")
PREVIEW = Path("review-ink-fluid-preview.png")
SIZE = 1400
random.seed(1984)

y, x = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32)
cx = SIZE * 0.5
cy = SIZE * 0.5
field = np.zeros((SIZE, SIZE), dtype=np.float32)
smoke = np.zeros((SIZE, SIZE), dtype=np.float32)

def curve_point(t: float) -> tuple[float, float]:
    """A wide S shaped motion mark. It should read as flowing ink, not a disk."""
    return (
        SIZE * (0.18 + 0.66 * t) + math.sin(t * math.pi * 3.4) * 45,
        cy + math.sin((t - 0.07) * math.pi * 1.72) * 210 + math.sin(t * math.pi * 6.0) * 24,
    )


def add_oriented_gaussian(target: np.ndarray, px: float, py: float, angle: float, rx: float, ry: float, weight: float, power: float = 1.0) -> None:
    cos_a = math.cos(angle)
    sin_a = math.sin(angle)
    dx = x - px
    dy = y - py
    along = dx * cos_a + dy * sin_a
    cross = -dx * sin_a + dy * cos_a
    target += np.exp(-(((along / rx) ** 2 + (cross / ry) ** 2) * power)) * weight


# Main body: overlapping anisotropic drops along an S curve.
samples = np.linspace(0, 1, 28)
points: list[tuple[float, float]] = [curve_point(float(t)) for t in samples]
for index, t in enumerate(samples):
    px, py = points[index]
    if index < len(points) - 1:
        nx, ny = points[index + 1]
    else:
        nx, ny = points[index - 1]
    angle = math.atan2(ny - py, nx - px)
    center_bias = 1 - abs(float(t) - 0.5) * 1.7
    core_rx = 126 + max(center_bias, 0) * 170 + random.uniform(-22, 24)
    core_ry = 24 + max(center_bias, 0) * 74 + random.uniform(-5, 12)
    add_oriented_gaussian(field, px, py, angle, core_rx, core_ry, 0.28 + max(center_bias, 0) * 0.5, 1.18)
    add_oriented_gaussian(smoke, px, py, angle, core_rx * 1.7, core_ry * 3.0, 0.18 + max(center_bias, 0) * 0.2, 1.55)

# Denser liquid reservoirs offset from the curve, keeping the form asymmetric.
for t, side, rx, ry, weight in [
    (0.24, -1, 170, 92, 0.56),
    (0.42, 1, 208, 88, 0.62),
    (0.62, -1, 178, 76, 0.48),
    (0.78, 1, 136, 58, 0.35),
]:
    px, py = curve_point(t)
    prev_x, prev_y = curve_point(max(0, t - 0.02))
    next_x, next_y = curve_point(min(1, t + 0.02))
    angle = math.atan2(next_y - prev_y, next_x - prev_x)
    normal = angle + math.pi / 2
    add_oriented_gaussian(field, px + math.cos(normal) * side * 52, py + math.sin(normal) * side * 52, angle, rx, ry, weight, 1.24)

# Fine fluid tendrils and brush-like ink fingers.
for index in range(54):
    t0 = random.random()
    px, py = curve_point(t0)
    prev_x, prev_y = curve_point(max(0, t0 - 0.025))
    next_x, next_y = curve_point(min(1, t0 + 0.025))
    tangent = math.atan2(next_y - prev_y, next_x - prev_x)
    angle = tangent + random.choice([-1, 1]) * random.uniform(0.26, 1.24)
    length = random.uniform(130, 520)
    width = random.uniform(4.5, 19)
    origin_x = px + math.cos(angle + math.pi) * random.uniform(8, 50)
    origin_y = py + math.sin(angle + math.pi) * random.uniform(8, 50)
    tip_x = origin_x + math.cos(angle) * length
    tip_y = origin_y + math.sin(angle) * length
    vx = tip_x - origin_x
    vy = tip_y - origin_y
    denom = max(vx * vx + vy * vy, 1)
    proj = np.clip(((x - origin_x) * vx + (y - origin_y) * vy) / denom, 0, 1)
    bow = np.sin(proj * math.pi) * random.uniform(-34, 34)
    closest_x = origin_x + vx * proj + math.cos(angle + math.pi / 2) * bow
    closest_y = origin_y + vy * proj + math.sin(angle + math.pi / 2) * bow
    dist = ((x - closest_x) ** 2 + (y - closest_y) ** 2) ** 0.5
    taper = (1 - proj) ** random.uniform(1.05, 2.2)
    line = np.exp(-((dist / (width * taper + 1.1)) ** 2))
    field += line * random.uniform(0.06, 0.24)
    smoke += line * random.uniform(0.06, 0.18)

# Procedural wisps and turbulence.
noise = np.zeros((SIZE, SIZE), dtype=np.float32)
for scale, weight in [(11, 0.23), (23, 0.17), (47, 0.13), (101, 0.08)]:
    small = np.random.default_rng(scale).random((SIZE // scale + 2, SIZE // scale + 2), dtype=np.float32)
    img = Image.fromarray((small * 255).astype(np.uint8)).resize((SIZE, SIZE), Image.Resampling.BICUBIC)
    noise += np.asarray(img).astype(np.float32) / 255 * weight

flow = 0.68 + noise + np.sin(x / 43 + y / 77) * 0.035 + np.sin((x - y) / 88) * 0.045
field = np.clip(field * flow, 0, 2.4)
smoke = np.clip(smoke * (0.72 + noise * 0.8), 0, 1.6)

body = np.clip((field - 0.12) / 1.08, 0, 1)
body_img = Image.fromarray((body * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(4))
body = np.asarray(body_img).astype(np.float32) / 255

edge = Image.fromarray((np.clip((smoke - 0.045) / 0.84, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(30))
edge = np.asarray(edge).astype(np.float32) / 255

alpha = np.clip(body * 0.78 + edge * 0.38, 0, 0.86)

# Inner erosions prevent a dead flat disk and make the image read as liquid.
void = np.zeros_like(alpha)
for t, side, rx, ry, weight in [
    (0.34, 1, 124, 35, 0.18),
    (0.52, -1, 150, 44, 0.24),
    (0.69, 1, 112, 28, 0.15),
]:
    px, py = curve_point(t)
    prev_x, prev_y = curve_point(max(0, t - 0.03))
    next_x, next_y = curve_point(min(1, t + 0.03))
    angle = math.atan2(next_y - prev_y, next_x - prev_x)
    normal = angle + math.pi / 2
    add_oriented_gaussian(void, px + math.cos(normal) * side * 28, py + math.sin(normal) * side * 28, angle, rx, ry, weight, 1.0)
alpha = np.clip(alpha - void, 0, 0.9)

rgb = np.zeros((SIZE, SIZE, 3), dtype=np.uint8)
rgb[:, :, 0] = 36
rgb[:, :, 1] = 37
rgb[:, :, 2] = 34

# Add translucent gray density variation.
density = np.clip(0.42 + body * 0.44 + smoke * 0.08 + noise * 0.16, 0.34, 0.94)
for channel in range(3):
    rgb[:, :, channel] = np.clip(rgb[:, :, channel] / density, 0, 88)

rgba = np.dstack([rgb, (alpha * 235).astype(np.uint8)])
image = Image.fromarray(rgba, "RGBA")
bbox = image.getbbox()
if bbox:
    left, top, right, bottom = bbox
    pad = 36
    image = image.crop((max(0, left - pad), max(0, top - pad), min(SIZE, right + pad), min(SIZE, bottom + pad)))
image.save(OUT)

preview = Image.new("RGBA", image.size, (244, 241, 232, 255))
preview.alpha_composite(image)
preview.save(PREVIEW)
print(OUT, image.size)
