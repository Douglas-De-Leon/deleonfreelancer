Add-Type -AssemblyName System.Drawing

$inPath = 'C:\Users\P1\.gemini\antigravity\brain\027a0973-4ed1-40fb-8a4f-bb5e327c68f4\logo_option_3_transparent.png'
$sqBmp = [System.Drawing.Bitmap]::FromFile($inPath)

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

$sqBmp.Dispose()
