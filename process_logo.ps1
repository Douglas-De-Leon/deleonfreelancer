Add-Type -AssemblyName System.Drawing
$imgPath = 'C:\Users\P1\.gemini\antigravity\brain\027a0973-4ed1-40fb-8a4f-bb5e327c68f4\.user_uploaded\media_1787625853071.png'
$srcImg = [System.Drawing.Image]::FromFile($imgPath)

$dim = [math]::Max($srcImg.Width, $srcImg.Height)
$sqBmp = New-Object System.Drawing.Bitmap($dim, $dim)
$g = [System.Drawing.Graphics]::FromImage($sqBmp)
$g.Clear([System.Drawing.Color]::Black)

$x = ($dim - $srcImg.Width) / 2
$y = ($dim - $srcImg.Height) / 2
$g.DrawImage($srcImg, $x, $y, $srcImg.Width, $srcImg.Height)
$g.Dispose()

function Resize-Image {
    param($size, $path)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g2 = [System.Drawing.Graphics]::FromImage($bmp)
    $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g2.DrawImage($sqBmp, 0, 0, $size, $size)
    $g2.Dispose()
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

Resize-Image 32 "c:\deleonfreelancer\assets\favicon-32.png"
Resize-Image 192 "c:\deleonfreelancer\assets\favicon-192.png"
Resize-Image 512 "c:\deleonfreelancer\assets\favicon-512.png"

$srcImg.Dispose()
$sqBmp.Dispose()
