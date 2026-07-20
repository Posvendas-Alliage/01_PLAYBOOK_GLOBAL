const { execFile } = require('child_process');

function runPowerShell(script) {
  return new Promise((resolve, reject) => {
    execFile(
      'powershell',
      ['-NoProfile', '-Command', script],
      { maxBuffer: 20 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          error.stdout = stdout;
          error.stderr = stderr;
          reject(error);
          return;
        }
        resolve(stdout);
      }
    );
  });
}

global.fetch = async function fetchViaPowerShell(input, init = {}) {
  const url = typeof input === 'string' ? input : input && input.url;
  const method = String(init.method || 'GET').toUpperCase();
  const headers = Object.assign({}, init.headers || {});
  const body = init.body == null ? '' : String(init.body);
  const payload = JSON.stringify({ url, method, headers, body });
  const encoded = Buffer.from(payload, 'utf8').toString('base64');
  const hasBody = body.length > 0;
  const script = `
$payload = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${encoded}')) | ConvertFrom-Json
$headers = @{}
if ($payload.headers) {
  $payload.headers.PSObject.Properties | ForEach-Object { $headers[$_.Name] = [string]$_.Value }
}
try {
  $invokeParams = @{
    UseBasicParsing = $true
    Uri = [string]$payload.url
    Method = [string]$payload.method
    Headers = $headers
  }
  ${hasBody ? "$invokeParams['Body'] = [string]$payload.body" : ''}
  $response = Invoke-WebRequest @invokeParams
  [pscustomobject]@{
    ok = $true
    status = [int]$response.StatusCode
    statusText = [string]$response.StatusDescription
    body = [string]$response.Content
  } | ConvertTo-Json -Compress -Depth 8
} catch {
  $res = $_.Exception.Response
  $status = if ($res) { [int]$res.StatusCode } else { 0 }
  $statusText = if ($res) { [string]$res.StatusDescription } else { [string]$_.Exception.Message }
  $bodyText = ''
  if ($_.ErrorDetails -and $_.ErrorDetails.Message) { $bodyText = [string]$_.ErrorDetails.Message }
  [pscustomobject]@{
    ok = $false
    status = $status
    statusText = $statusText
    body = $bodyText
  } | ConvertTo-Json -Compress -Depth 8
}
`;

  const stdout = await runPowerShell(script);
  const response = JSON.parse(stdout.trim());
  return {
    ok: !!response.ok,
    status: Number(response.status) || 0,
    statusText: response.statusText || '',
    text: async () => response.body || '',
    json: async () => JSON.parse(response.body || 'null')
  };
};
