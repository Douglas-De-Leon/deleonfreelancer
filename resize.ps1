Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("C:\Users\P1\.gemini\antigravity\brain\027a0973-4ed1-40fb-8a4f-bb5e327c68f4\triangle_ai_logo_1787625618240.jpg")

function Resize-Image {
    param($size, $path)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $size, $size)
    $g.Dispose()
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

Resize-Image 32 "c:\deleonfreelancer\assets\favicon-32.png"
Resize-Image 192 "c:\deleonfreelancer\assets\favicon-192.png"
Resize-Image 512 "c:\deleonfreelancer\assets\favicon-512.png"

$img.Dispose()
