$OutputDir = "eslint-issues"

if (Test-Path $OutputDir) {
    Remove-Item $OutputDir -Recurse -Force
}

New-Item -ItemType Directory -Path $OutputDir | Out-Null

Write-Host "Running ESLint..."

$jsonPath = Join-Path $env:TEMP "eslint-output.json"

try {
    npx eslint . --format json | Out-File $jsonPath -Encoding utf8
} catch {
    Write-Host "ESLint reported issues."
}

$results = Get-Content $jsonPath -Raw | ConvertFrom-Json

$issueNumber = 1
$summary = @()

foreach ($file in $results) {

    foreach ($msg in $file.messages) {

        $id = "{0:d4}" -f $issueNumber

        $issueDir = Join-Path $OutputDir "issue-$id"

        New-Item -ItemType Directory -Path $issueDir | Out-Null

        $severity = if ($msg.severity -eq 2) {
            "error"
        } else {
            "warning"
        }

        $metadata = @{
            id       = $id
            rule     = $msg.ruleId
            severity = $severity
            file     = $file.filePath
            line     = $msg.line
            column   = $msg.column
        }

        $metadata | ConvertTo-Json -Depth 10 |
            Set-Content "$issueDir\metadata.json"

        @"
# ESLint Issue $id

Rule:
$($msg.ruleId)

Severity:
$severity

File:
$($file.filePath)

Line:
$($msg.line)

Column:
$($msg.column)

Message:
$($msg.message)
"@ | Set-Content "$issueDir\issue.md"

        @"
Fix this ESLint issue.

Rule:
$($msg.ruleId)

File:
$($file.filePath)

Line:
$($msg.line)

Message:
$($msg.message)

Requirements:
- Preserve functionality
- Do not disable rules
- Follow best practices
- Return complete fixed code
- Do not introduce new lint errors
"@ | Set-Content "$issueDir\prompt.md"

        if (Test-Path $file.filePath) {

            $content = Get-Content $file.filePath

            $start = [Math]::Max(0, $msg.line - 15)
            $end = [Math]::Min($content.Count - 1, $msg.line + 15)

            $content[$start..$end] |
                Set-Content "$issueDir\snippet.txt"
        }

        $summary += @{
            issue = $id
            rule = $msg.ruleId
            file = $file.filePath
            line = $msg.line
        }

        $issueNumber++
    }
}

$summary |
    ConvertTo-Json -Depth 10 |
    Set-Content "$OutputDir\summary.json"

Remove-Item $jsonPath -Force

Write-Host ""
Write-Host "Created $($issueNumber - 1) issue folders."
Write-Host "Output: $OutputDir"