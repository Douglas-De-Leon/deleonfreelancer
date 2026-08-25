Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('C:\Users\P1\.gemini\antigravity\brain\027a0973-4ed1-40fb-8a4f-bb5e327c68f4\.user_uploaded\media_1787625853071.png')
Write-Host "Width: $($img.Width), Height: $($img.Height)"
$img.Dispose()
