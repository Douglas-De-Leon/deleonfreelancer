from rembg import remove
from PIL import Image

input_path = r'C:\Users\P1\.gemini\antigravity\brain\027a0973-4ed1-40fb-8a4f-bb5e327c68f4\.user_uploaded\media_1787626086761.png'
output_path = r'c:\deleonfreelancer\assets\logo_head.png'

print('Opening image...')
input_image = Image.open(input_path)
print('Removing background...')
output_image = remove(input_image)
print('Saving image...')
output_image.save(output_path)
print('Done!')
