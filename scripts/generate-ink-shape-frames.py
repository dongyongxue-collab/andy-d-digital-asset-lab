from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


SRC = Path("public/ink-fluid-body.png")
OUTS = [
    Path("public/ink-fluid-shape-01.png"),
    Path("public/ink-fluid-shape-02.png"),
    Path("public/ink-fluid-shape-03.png"),
    Path("public/ink-fluid-shape-04.png"),
]


def bilinear_sample(arr: np.ndarray, sx: np.ndarray, sy: np.ndarray) -> np.ndarray:
    h, w = arr.shape[:2]
    x0 = np.floor(sx).astype(np.int32)
    y0 = np.floor(sy).astype(np.int32)
    x1 = np.clip(x0 + 1, 0, w - 1)
    y1 = np.clip(y0 + 1, 0, h - 1)
    x0 = np.clip(x0, 0, w - 1)
    y0 = np.clip(y0, 0, h - 1)

    wx = sx - x0
    wy = sy - y0
    a = arr[y0, x0] * (1 - wx)[..., None] * (1 - wy)[..., None]
    b = arr[y0, x1] * wx[..., None] * (1 - wy)[..., None]
    c = arr[y1, x0] * (1 - wx)[..., None] * wy[..., None]
    d = arr[y1, x1] * wx[..., None] * wy[..., None]
    return a + b + c + d


def make_frame(src: Image.Image, phase: float, bend: float, pulse: float, out_path: Path) -> None:
    arr = np.asarray(src).astype(np.float32)
    h, w = arr.shape[:2]
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    nx = (x - w * 0.5) / w
    ny = (y - h * 0.5) / h

    # Inverse-map a soft fluid deformation. The alpha shape changes, but it is
    # not stretched into a long smear like a scaleX animation would do.
    wave_x = np.sin(ny * 8.2 + phase) * (18 + bend * 10)
    wave_y = np.sin(nx * 7.4 - phase * 0.7) * (14 + bend * 7)

    cx1 = -0.18 + np.sin(phase) * 0.08
    cy1 = 0.16 + np.cos(phase * 0.7) * 0.08
    cx2 = 0.23 + np.cos(phase * 1.2) * 0.07
    cy2 = -0.12 + np.sin(phase * 0.9) * 0.08
    r1 = (nx - cx1) ** 2 + (ny - cy1) ** 2
    r2 = (nx - cx2) ** 2 + (ny - cy2) ** 2
    swirl_1 = np.exp(-r1 / 0.055) * bend
    swirl_2 = np.exp(-r2 / 0.07) * bend

    swirl_x = (-(ny - cy1) * swirl_1 + (ny - cy2) * swirl_2) * 120
    swirl_y = ((nx - cx1) * swirl_1 - (nx - cx2) * swirl_2) * 118
    pinch = np.exp(-((nx + 0.03) ** 2 + (ny - 0.03) ** 2) / 0.18)

    sx = np.clip(x - wave_x - swirl_x - nx * pinch * pulse * 28, 0, w - 1)
    sy = np.clip(y - wave_y - swirl_y + ny * pinch * pulse * 24, 0, h - 1)

    warped = bilinear_sample(arr, sx, sy)

    alpha = warped[:, :, 3] / 255.0
    rng = np.random.default_rng(int(phase * 1000) + 1984)
    noise_small = rng.random((h // 18 + 2, w // 18 + 2), dtype=np.float32)
    noise = np.asarray(
        Image.fromarray((noise_small * 255).astype(np.uint8)).resize((w, h), Image.Resampling.BICUBIC)
    ).astype(np.float32) / 255.0
    alpha = np.clip(alpha * (0.91 + noise * 0.2), 0, 1)

    # Let edges breathe differently per frame while preserving the smoke-like
    # translucent parts of the generated ink.
    alpha_img = Image.fromarray((alpha * 255).astype(np.uint8))
    alpha_soft = np.asarray(alpha_img.filter(ImageFilter.GaussianBlur(0.45))).astype(np.float32) / 255.0
    warped[:, :, 3] = np.clip(alpha_soft * 255, 0, 255)

    Image.fromarray(np.clip(warped, 0, 255).astype(np.uint8), "RGBA").save(out_path)


def main() -> None:
    src = Image.open(SRC).convert("RGBA")
    src.save(OUTS[0])
    make_frame(src, phase=1.4, bend=0.72, pulse=0.42, out_path=OUTS[1])
    make_frame(src, phase=2.9, bend=0.56, pulse=-0.24, out_path=OUTS[2])
    make_frame(src, phase=4.5, bend=0.82, pulse=0.3, out_path=OUTS[3])
    for path in OUTS:
        print(path, Image.open(path).size)


if __name__ == "__main__":
    main()
