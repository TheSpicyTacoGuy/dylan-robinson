"""Build the shipped WebP images from the originals in source-shots/.

Run with: python scripts/build-images.py
The originals stay out of public/ so they are never uploaded.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "source-shots"
PUBLIC = ROOT / "public"


def save(image: Image.Image, path: Path, width: int, quality: int = 82) -> None:
    height = round(image.height * width / image.width)
    path.parent.mkdir(parents=True, exist_ok=True)
    resized = image.resize((width, height), Image.LANCZOS)
    resized.save(path, "WEBP", quality=quality, method=6)
    print(f"{path.relative_to(ROOT)} {width}x{height} {path.stat().st_size // 1024}KB")


def crop_to_ratio(image: Image.Image, ratio: float, anchor: float) -> Image.Image:
    target_height = round(image.width / ratio)
    if target_height <= image.height:
        top = round((image.height - target_height) * anchor)
        return image.crop((0, top, image.width, top + target_height))
    target_width = round(image.height * ratio)
    left = round((image.width - target_width) / 2)
    return image.crop((left, 0, left + target_width, image.height))


portrait = Image.open(SRC / "portrait.jpg").convert("RGB")

# A wide crop keeps the fence and the tree, and trims mostly from the bottom.
wide = crop_to_ratio(portrait, 2.2, 0.18)
for width in (1200, 2000):
    save(wide, PUBLIC / f"portrait-wide-{width}.webp", width)

# A tall crop for phones, where a wide strip would letterbox the subject.
tall = crop_to_ratio(portrait, 4 / 5, 0)
for width in (800, 1200):
    save(tall, PUBLIC / f"portrait-tall-{width}.webp", width)

shots = {
    "landing": (800, 1477),
    "dashboard": (800, 1600),
    "return": (800, 1600),
}

for name, widths in shots.items():
    image = Image.open(SRC / f"{name}.png").convert("RGB")
    for width in widths:
        if width <= image.width:
            save(image, PUBLIC / "shots" / f"{name}-{width}.webp", width)

screens = {
    "four-seasons-prices": (800, 1440),
    "four-seasons-home": (800, 1440),
    "four-seasons-admin": (800, 1291),
}

for name, widths in screens.items():
    image = Image.open(SRC / f"{name}.png").convert("RGB")
    for width in widths:
        if width <= image.width:
            save(image, PUBLIC / f"{name}-{width}.webp", width)
