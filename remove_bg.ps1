Add-Type -AssemblyName System.Drawing
$imgPath = 'C:\Users\P1\.gemini\antigravity\brain\027a0973-4ed1-40fb-8a4f-bb5e327c68f4\.user_uploaded\media_1787626086761.png'
$srcImg = [System.Drawing.Bitmap]::FromFile($imgPath)
$bmp = New-Object System.Drawing.Bitmap($srcImg)
$srcImg.Dispose()

# Simple thresholding: turn dark colors transparent
for ($x = 0; $x -lt $bmp.Width; $x++) {
    for ($y = 0; $y -lt $bmp.Height; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -lt 40 -and $c.G -lt 40 -and $c.B -lt 40) {
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        }
    }
}

# Square it up
$dim = [math]::Max($bmp.Width, $bmp.Height)
$sqBmp = New-Object System.Drawing.Bitmap($dim, $dim)
$g = [System.Drawing.Graphics]::FromImage($sqBmp)
$g.Clear([System.Drawing.Color]::Transparent)
$x = ($dim - $bmp.Width) / 2
$y = ($dim - $bmp.Height) / 2
$g.DrawImage($bmp, $x, $y, $bmp.Width, $bmp.Height)
$g.Dispose()

function Resize-Image {
    param($size, $path)
    $outBmp = New-Object System.Drawing.Bitmap($size, $size)
    $g2 = [System.Drawing.Graphics]::FromImage($outBmp)
    $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g2.DrawImage($sqBmp, 0, 0, $size, $size)
    $g2.Dispose()
    $outBmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $outBmp.Dispose()
}

Resize-Image 32 "c:\deleonfreelancer\assets\favicon-32.png"
Resize-Image 192 "c:\deleonfreelancer\assets\favicon-192.png"
Resize-Image 512 "c:\deleonfreelancer\assets\favicon-512.png"

$bmp.Dispose()
$sqBmp.Dispose()
