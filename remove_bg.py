from PIL import Image
import numpy as np

# Load the image
img = Image.open('public/assets/clippy_cape.png').convert('RGBA')
data = np.array(img)

# Get RGB channels
r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

# Define white/light background threshold
# Pixels that are very light (close to white) will be made transparent
threshold = 240
white_areas = (r > threshold) & (g > threshold) & (b > threshold)

# Set alpha to 0 for white areas
data[white_areas, 3] = 0

# Create new image
result = Image.fromarray(data)
result.save('public/assets/clippy_cape_transparent.png')
print("✓ Background removed! Saved as clippy_cape_transparent.png")
