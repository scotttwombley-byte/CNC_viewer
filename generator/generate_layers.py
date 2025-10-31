import os
from PIL import Image, ImageDraw

# --- Config ---
OUTPUT_DIR = "output"
LAYERS = [
    {"name": "background", "color": "#1a1a1a"},
    {"name": "trees", "color": "#734f2f"},
    {"name": "animal", "color": "#cc8800"},
    {"name": "foreground", "color": "#000000"}
]

# --- Ensure output folder exists ---
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- Create layered shadowbox image ---
def generate_shadowbox():
    width, height = 800, 600
    base = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(base)

    for i, layer in enumerate(LAYERS):
        color = layer["color"]
        y_offset = i * 40
        draw.rectangle(
            [50 + i*10, 50 + y_offset, width - 50 - i*10, height - 50 - y_offset],
            fill=color
        )

    output_path = os.path.join(OUTPUT_DIR, "layered_preview.png")
    base.save(output_path)
    print(f"✅ Generated {output_path}")

if __name__ == "__main__":
    generate_shadowbox()
