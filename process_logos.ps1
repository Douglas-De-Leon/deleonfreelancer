Add-Type -AssemblyName System.Drawing

function Process-Logo {
    param($inPath, $outPath)
    $srcImg = [System.Drawing.Bitmap]::FromFile($inPath)
    $bmp = New-Object System.Drawing.Bitmap($srcImg)
    $srcImg.Dispose()

    # Thresholding: turn dark colors transparent
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

    $sqBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $sqBmp.Dispose()
}

$dir = 'C:\Users\P1\.gemini\antigravity\brain\027a0973-4ed1-40fb-8a4f-bb5e327c68f4'
Process-Logo "$dir\logo_option_1_1787626952904.jpg" "$dir\logo_option_1_transparent.png"
Process-Logo "$dir\logo_option_2_1787626961818.jpg" "$dir\logo_option_2_transparent.png"
Process-Logo "$dir\logo_option_3_1787626970754.jpg" "$dir\logo_option_3_transparent.png"

