param(
    [int]$FrontendPort = 8088,
    [int]$BackendPort = 8001
)

$ErrorActionPreference = 'Stop'

$rootPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $rootPath 'backend'

function Assert-CommandAvailable {
    param(
        [string]$CommandName,
        [string]$InstallHint
    )

    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        throw "$CommandName is not available on PATH. $InstallHint"
    }
}

function Assert-PortAvailable {
    param(
        [int]$Port,
        [string]$Label
    )

    $listener = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -First 1

    if (-not $listener) {
        return
    }

    $process = Get-Process -Id $listener.OwningProcess -ErrorAction SilentlyContinue
    $processName = if ($process) { $process.ProcessName } else { 'unknown process' }

    throw "$Label port $Port is already in use by $processName (PID $($listener.OwningProcess)). Stop that process or choose another port."
}

function Wait-ForHttpEndpoint {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 30
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

    while ((Get-Date) -lt $deadline) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2

            if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
                return $true
            }
        } catch {
            # Keep polling until the service is ready or the timeout expires.
        }

        Start-Sleep -Milliseconds 500
    }

    return $false
}

Assert-CommandAvailable -CommandName 'php' -InstallHint 'Install PHP 8+ before running this script.'
Assert-CommandAvailable -CommandName 'python' -InstallHint 'Install Python 3 before running this script.'

Assert-PortAvailable -Port $FrontendPort -Label 'Frontend'
Assert-PortAvailable -Port $BackendPort -Label 'Backend'

$backendCommand = @"
Set-Location '$backendPath'
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver 127.0.0.1:$BackendPort
"@

$frontendCommand = @"
Set-Location '$rootPath'
php -S 127.0.0.1:$FrontendPort
"@

Start-Process powershell.exe -ArgumentList @(
    '-NoExit',
    '-ExecutionPolicy',
    'Bypass',
    '-Command',
    $backendCommand
) -WorkingDirectory $backendPath | Out-Null

Start-Process powershell.exe -ArgumentList @(
    '-NoExit',
    '-ExecutionPolicy',
    'Bypass',
    '-Command',
    $frontendCommand
) -WorkingDirectory $rootPath | Out-Null

$frontendUrl = "http://127.0.0.1:$FrontendPort"
$backendHealthUrl = "http://127.0.0.1:$BackendPort/api/health/"

$frontendReady = Wait-ForHttpEndpoint -Url $frontendUrl -TimeoutSeconds 20
$backendReady = Wait-ForHttpEndpoint -Url $backendHealthUrl -TimeoutSeconds 45

Write-Host "LedgerLift local services are starting..."
Write-Host "Frontend: $frontendUrl"
Write-Host "Backend:  http://127.0.0.1:$BackendPort"
Write-Host 'Two PowerShell windows were opened for the frontend and backend servers.'

if ($frontendReady) {
    Start-Process $frontendUrl | Out-Null
    Write-Host 'Frontend responded successfully and was opened in your default browser.'
} else {
    Write-Warning 'Frontend did not respond before the timeout. Check the frontend PowerShell window for startup errors.'
}

if ($backendReady) {
    Write-Host 'Backend health check passed.'
} else {
    Write-Warning 'Backend health check did not succeed before the timeout. Check the backend PowerShell window for install, migration, or server errors.'
}