from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps
import numpy as np


src = Image.open("public/andy-d-portrait.jpg").convert("RGB")
w, h = src.size

gray = ImageOps.grayscale(src)
gray = ImageOps.autocontrast(gray)

# Use a small set of high-contrast edges instead of dense hatching.
edges = gray.filter(ImageFilter.FIND_EDGES)
edges = ImageOps.autocontrast(edges)
edge_arr = np.asarray(edges).astype(np.float32)

mask = Image.new("L", (w, h), 0)
draw = ImageDraw.Draw(mask)

# Deliberately tight portrait mask: head, shoulders, hands, and a hint of desk line.
draw.ellipse((470, 500, 830, 930), fill=255)
draw.polygon(
    [
        (360, 900),
        (510, 810),
        (780, 812),
        (980, 1015),
        (1035, 1370),
        (900, 1530),
        (620, 1580),
        (330, 1490),
        (250, 1220),
    ],
    fill=255,
)
draw.ellipse((405, 1190, 865, 1498), fill=255)
draw.rounded_rectangle((350, 1410, 1000, 1680), radius=38, fill=78)
mask = mask.filter(ImageFilter.GaussianBlur(18))
mask_arr = np.asarray(mask).astype(np.float32) / 255.0

alpha = np.clip((edge_arr - 74) * 2.35, 0, 205) * mask_arr

# Keep only the strongest sparse contour strokes.
alpha[alpha < 44] = 0

# Add a few clean intentional contours so the portrait still reads after simplification.
contour = Image.new("L", (w, h), 0)
cd = ImageDraw.Draw(contour)
line = 2
cd.arc((470, 500, 830, 930), 190, 352, fill=210, width=line)
cd.line([(520, 760), (500, 900), (450, 1090), (390, 1330), (432, 1488)], fill=170, width=line)
cd.line([(778, 760), (860, 940), (970, 1140), (1018, 1390), (936, 1518)], fill=168, width=line)
cd.line([(548, 858), (660, 1038), (760, 858)], fill=142, width=line)
cd.line([(646, 940), (650, 1300)], fill=168, width=2)
cd.arc((420, 1215, 695, 1475), 30, 170, fill=150, width=2)
cd.arc((618, 1195, 900, 1490), 12, 160, fill=150, width=2)
cd.line([(350, 1488), (1028, 1540)], fill=80, width=1)
contour_arr = np.asarray(contour).astype(np.float32)
alpha = np.maximum(alpha, contour_arr)

# Remove faint residue and feather only the antialias edge.
alpha = Image.fromarray(np.clip(alpha, 0, 220).astype(np.uint8), "L")
alpha = alpha.filter(ImageFilter.GaussianBlur(0.18))
alpha = alpha.point(lambda p: 0 if p < 32 else min(220, int(p * 1.05)))

out = Image.new("RGBA", (w, h), (88, 78, 70, 0))
out.putalpha(alpha)
bbox = out.getbbox()
if bbox:
    out = out.crop(bbox)

max_w = 1180
if out.width > max_w:
    ratio = max_w / out.width
    out = out.resize((max_w, int(out.height * ratio)), Image.Resampling.LANCZOS)

out.save("public/andy-d-sketch.png")
