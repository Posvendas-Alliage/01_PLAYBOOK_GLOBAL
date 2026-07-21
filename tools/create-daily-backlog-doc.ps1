$ErrorActionPreference = 'Stop'

$workspace = Split-Path -Parent $PSScriptRoot
$outputDir = Join-Path $workspace 'docs\02-operacao\daily-backlog'
$outputFile = Join-Path $outputDir 'Daily Backlog Global - Documentacao Operacional.docx'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('daily-backlog-docx-' + [guid]::NewGuid().ToString('N'))

function Escape-XmlText {
    param([string]$Text)
    if ($null -eq $Text) { return '' }
    return [System.Security.SecurityElement]::Escape($Text)
}

function New-RunXml {
    param(
        [string]$Text,
        [switch]$Bold
    )

    $escaped = Escape-XmlText $Text
    $boldXml = if ($Bold) { '<w:b/>' } else { '' }
    return "<w:r><w:rPr>$boldXml</w:rPr><w:t xml:space=`"preserve`">$escaped</w:t></w:r>"
}

function New-ParagraphXml {
    param(
        [string]$Text,
        [string]$Style = '',
        [switch]$Bold
    )

    $styleXml = if ($Style) { "<w:pStyle w:val=`"$Style`"/>" } else { '' }
    $runXml = New-RunXml -Text $Text -Bold:$Bold
    return "<w:p><w:pPr>$styleXml</w:pPr>$runXml</w:p>"
}

function New-BulletXml {
    param([string]$Text)
    return New-ParagraphXml -Text ("- " + $Text)
}

function New-NumberXml {
    param(
        [int]$Number,
        [string]$Text
    )
    return New-ParagraphXml -Text ("$Number. " + $Text)
}

function New-TableXml {
    param(
        [object[]]$Rows
    )

    $tableRows = foreach ($row in $Rows) {
        $cells = foreach ($cell in $row) {
            $isHeader = $cell.isHeader
            $text = Escape-XmlText $cell.text
            $shade = if ($isHeader) { '<w:shd w:fill="D9EAF7"/>' } else { '' }
            $bold = if ($isHeader) { '<w:b/>' } else { '' }
            @"
<w:tc>
  <w:tcPr>
    <w:tcW w:w="0" w:type="auto"/>
    $shade
  </w:tcPr>
  <w:p>
    <w:r>
      <w:rPr>$bold</w:rPr>
      <w:t xml:space="preserve">$text</w:t>
    </w:r>
  </w:p>
</w:tc>
"@
        }
        "<w:tr>$($cells -join '')</w:tr>"
    }

    @"
<w:tbl>
  <w:tblPr>
    <w:tblStyle w:val="TableGrid"/>
    <w:tblW w:w="0" w:type="auto"/>
    <w:tblLook w:val="04A0"/>
  </w:tblPr>
  <w:tblGrid>
    <w:gridCol w:w="4500"/>
    <w:gridCol w:w="4500"/>
  </w:tblGrid>
  $($tableRows -join '')
</w:tbl>
"@
}

if (Test-Path $outputDir) {
} else {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

try {
    New-Item -ItemType Directory -Path $tempRoot | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tempRoot '_rels') | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tempRoot 'docProps') | Out-Null
    New-Item -ItemType Directory -Path (Join-Path $tempRoot 'word') | Out-Null

    $contentTypes = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
"@

    $rels = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"@

    $app = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
            xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Office Word</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant><vt:lpstr>Title</vt:lpstr></vt:variant>
      <vt:variant><vt:i4>1</vt:i4></vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="1" baseType="lpstr">
      <vt:lpstr>Documentacao Operacional</vt:lpstr>
    </vt:vector>
  </TitlesOfParts>
  <Company>Alliage</Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0000</AppVersion>
</Properties>
"@

    $created = (Get-Date).ToUniversalTime().ToString("s") + "Z"
    $core = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
                   xmlns:dc="http://purl.org/dc/elements/1.1/"
                   xmlns:dcterms="http://purl.org/dc/terms/"
                   xmlns:dcmitype="http://purl.org/dc/dcmitype/"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Daily Backlog Global - Documentacao Operacional</dc:title>
  <dc:subject>Automacao Daily Backlog Global PDF</dc:subject>
  <dc:creator>Codex</dc:creator>
  <cp:keywords>daily backlog; automacao; outlook; pdf</cp:keywords>
  <dc:description>Documento de contexto, percurso, execucao e finalidade da automacao Daily Backlog Global PDF.</dc:description>
  <cp:lastModifiedBy>Codex</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">$created</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">$created</dcterms:modified>
</cp:coreProperties>
"@

    $styles = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/>
        <w:sz w:val="22"/>
        <w:szCs w:val="22"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:after="120"/>
    </w:pPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:rPr>
      <w:b/>
      <w:sz w:val="36"/>
      <w:color w:val="17324D"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:basedOn w:val="Normal"/>
    <w:qFormat/>
    <w:rPr>
      <w:b/>
      <w:sz w:val="28"/>
      <w:color w:val="365F91"/>
    </w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:basedOn w:val="Normal"/>
    <w:next w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:spacing w:before="240" w:after="80"/>
    </w:pPr>
    <w:rPr>
      <w:b/>
      <w:sz w:val="28"/>
      <w:color w:val="17324D"/>
    </w:rPr>
  </w:style>
</w:styles>
"@

    $bodyParts = @()
    $bodyParts += New-ParagraphXml -Text 'Documentacao Operacional' -Style 'Title'
    $bodyParts += New-ParagraphXml -Text 'Automacao Daily Backlog Global PDF' -Style 'Subtitle'
    $bodyParts += New-ParagraphXml -Text 'Documento de contexto, handover, percurso, execucao e finalidade da automacao.'

    $bodyParts += New-ParagraphXml -Text '1. Visao geral' -Style 'Heading1'
    $bodyParts += New-ParagraphXml -Text 'Esta automacao gera um pacote diario do backlog global a partir do sistema Daily Backlog Control, cria os PDFs global e por regiao, monta os arquivos de apoio da rodada e deixa um draft no Outlook com todos os anexos necessarios. O objetivo e padronizar a consolidacao do backlog e reduzir a montagem manual do reporte diario.'

    $bodyParts += New-ParagraphXml -Text '2. O que a automacao entrega' -Style 'Heading1'
    $bodyParts += New-TableXml -Rows @(
        @(
            @{ text = 'Artefato'; isHeader = $true },
            @{ text = 'Descricao'; isHeader = $true }
        ),
        @(
            @{ text = 'PDF global'; isHeader = $false },
            @{ text = 'Lista completa dos tickets abertos dentro do filtro padrao do dashboard.'; isHeader = $false }
        ),
        @(
            @{ text = 'PDFs por regiao'; isHeader = $false },
            @{ text = 'Arquivos separados por Brasil, Argentina, Mexico, LATAM, USA e ROW quando houver dados.'; isHeader = $false }
        ),
        @(
            @{ text = 'manifest.json'; isHeader = $false },
            @{ text = 'Indicadores globais e regionais, filtros aplicados, origem dos dados e caminhos dos arquivos.'; isHeader = $false }
        ),
        @(
            @{ text = 'email-body-trilingual.txt'; isHeader = $false },
            @{ text = 'Corpo do e-mail em PT-BR, EN e ES, em texto puro.'; isHeader = $false }
        ),
        @(
            @{ text = 'outlook-draft-payload.json'; isHeader = $false },
            @{ text = 'Assunto, destinatarios, corpo e anexos usados para montar o draft no Outlook.'; isHeader = $false }
        ),
        @(
            @{ text = 'Draft no Outlook'; isHeader = $false },
            @{ text = 'Rascunho salvo sem envio automatico, com todos os PDFs anexados.'; isHeader = $false }
        )
    )

    $bodyParts += New-ParagraphXml -Text '3. Percurso da automacao' -Style 'Heading1'
    $steps = @(
        'Executa o script tools/run-daily-backlog-report.js na raiz do workspace.',
        'Consulta o endpoint do backlog usado pelo sistema Daily Backlog Control.',
        'Aplica os filtros padrao e as exclusoes embutidas no script.',
        'Calcula os indicadores globais e por regiao.',
        'Gera a pasta oficial da rodada em reports/daily-backlog-YYYY-MM-DD_HH-mm.',
        'Cria o PDF global e os PDFs regionais.',
        'Gera manifest.json, email-body-trilingual.txt e outlook-draft-payload.json.',
        'Cria o draft no Outlook sem envio automatico.',
        'Anexa todos os PDFs gerados.',
        'Valida se o draft salvo realmente contem todos os anexos esperados.'
    )
    for ($i = 0; $i -lt $steps.Count; $i++) {
        $bodyParts += New-NumberXml -Number ($i + 1) -Text $steps[$i]
    }

    $bodyParts += New-ParagraphXml -Text '4. O que o script executa' -Style 'Heading1'
    $bullets = @(
        'Busca os dados em https://bryegtpdjqpwtyefoznq.supabase.co/functions/v1/dashboard-read?type=bi-backlog&limit=10000.',
        'Exclui tickets da oficina e alguns tickets ou dominios fora do escopo.',
        'Mantem apenas os grupos operacionais Suporte geral, Especialista e Sem dono.',
        'Normaliza as regioes em Brasil, Argentina, Mexico, LATAM, USA e ROW.',
        'Calcula total aberto, urgentes, acima de 10 dias, sem primeira resposta, criticos P1/P2 e aging medio.',
        'Ordena os tickets por risco para destacar primeiro os casos mais relevantes nos PDFs.',
        'Gera o corpo do e-mail em tres idiomas e inclui o link direto do sistema.',
        'Prepara o payload do draft com os destinatarios padrao e a lista completa de anexos.'
    )
    foreach ($item in $bullets) {
        $bodyParts += New-BulletXml -Text $item
    }

    $bodyParts += New-ParagraphXml -Text '5. Como a automacao e executada' -Style 'Heading1'
    $bodyParts += New-ParagraphXml -Text 'Comando principal:' -Bold
    $bodyParts += New-ParagraphXml -Text 'node tools/run-daily-backlog-report.js'
    $bodyParts += New-ParagraphXml -Text 'A execucao deve ocorrer a partir da raiz do workspace. Cada rodada gera uma nova pasta dentro de reports e essa pasta passa a ser a saida oficial da execucao.'

    $bodyParts += New-ParagraphXml -Text '6. Requisitos para replicacao em outra conta' -Style 'Heading1'
    $bodyParts += New-TableXml -Rows @(
        @(
            @{ text = 'Item'; isHeader = $true },
            @{ text = 'Necessidade'; isHeader = $true }
        ),
        @(
            @{ text = 'Workspace local'; isHeader = $false },
            @{ text = 'A nova conta precisa abrir o mesmo repositorio e ter permissao para gerar arquivos em reports e docs.'; isHeader = $false }
        ),
        @(
            @{ text = 'Node.js'; isHeader = $false },
            @{ text = 'Precisa executar o script principal da automacao.'; isHeader = $false }
        ),
        @(
            @{ text = 'Acesso ao endpoint'; isHeader = $false },
            @{ text = 'Precisa conseguir consultar o endpoint dashboard-read do backlog.'; isHeader = $false }
        ),
        @(
            @{ text = 'Outlook'; isHeader = $false },
            @{ text = 'Precisa ter Outlook desktop configurado ou conector Outlook funcional para criar draft.'; isHeader = $false }
        ),
        @(
            @{ text = 'Permissao funcional'; isHeader = $false },
            @{ text = 'Precisa conseguir criar rascunhos, anexar arquivos locais e revisar o draft salvo.'; isHeader = $false }
        )
    )

    $bodyParts += New-ParagraphXml -Text '7. Destinatarios padrao do draft' -Style 'Heading1'
    foreach ($item in @(
        'Vitor Hugo Do Bem Donizetti <vitor.donizetti@alliage-global.com>',
        'Ygor Oliveira <ygor.oliveira@alliage-global.com>',
        'khuang@PreXion.com',
        'gabriel.pedroso@alliage-dental.com',
        'Renata Goulart Alves <renata.alves@alliage-global.com>'
    )) {
        $bodyParts += New-BulletXml -Text $item
    }

    $bodyParts += New-ParagraphXml -Text '8. Riscos e comportamento observado' -Style 'Heading1'
    foreach ($item in @(
        'Ja houve falha de fetch no runtime Node por restricao de rede.',
        'Ja houve caso em que o conector Outlook retornou sucesso, mas o draft visto no Outlook desktop apareceu sem anexos.',
        'Quando isso acontece, o caminho confiavel e recriar ou corrigir o draft via Outlook local COM e validar os anexos no item salvo em Drafts.',
        'Mudancas no endpoint, no schema do payload ou na lista de destinatarios impactam diretamente a automacao.'
    )) {
        $bodyParts += New-BulletXml -Text $item
    }

    $bodyParts += New-ParagraphXml -Text '9. Regra de conclusao da rotina' -Style 'Heading1'
    $bodyParts += New-ParagraphXml -Text 'A execucao so pode ser tratada como concluida quando todos os pontos abaixo forem verdadeiros:'
    foreach ($item in @(
        'A pasta oficial da rodada existe em reports/daily-backlog-YYYY-MM-DD_HH-mm.',
        'Os PDFs e os arquivos textuais da rodada foram gerados.',
        'O draft existe no Outlook.',
        'Todos os PDFs esperados estao realmente anexados no draft salvo.'
    )) {
        $bodyParts += New-BulletXml -Text $item
    }

    $bodyParts += New-ParagraphXml -Text '10. Arquivos principais do processo' -Style 'Heading1'
    foreach ($item in @(
        'tools/run-daily-backlog-report.js',
        'reports/daily-backlog-YYYY-MM-DD_HH-mm',
        'docs/02-operacao/daily-backlog/automacao-daily-backlog-global-contexto.md',
        'docs/02-operacao/daily-backlog/automacao-daily-backlog-global-processo.md',
        'C:\Users\guilherme.alamino\.codex\automations\daily-backlog-global-pdf\memory.md'
    )) {
        $bodyParts += New-BulletXml -Text $item
    }

    $documentXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    $($bodyParts -join "`n")
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>
"@

    $utf8 = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText((Join-Path $tempRoot '[Content_Types].xml'), $contentTypes, $utf8)
    [System.IO.File]::WriteAllText((Join-Path $tempRoot '_rels\.rels'), $rels, $utf8)
    [System.IO.File]::WriteAllText((Join-Path $tempRoot 'docProps\app.xml'), $app, $utf8)
    [System.IO.File]::WriteAllText((Join-Path $tempRoot 'docProps\core.xml'), $core, $utf8)
    [System.IO.File]::WriteAllText((Join-Path $tempRoot 'word\styles.xml'), $styles, $utf8)
    [System.IO.File]::WriteAllText((Join-Path $tempRoot 'word\document.xml'), $documentXml, $utf8)

    if (Test-Path $outputFile) {
        Remove-Item -LiteralPath $outputFile -Force
    }

    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($tempRoot, $outputFile)

    [pscustomobject]@{
        output = $outputFile
    } | ConvertTo-Json -Compress
}
finally {
    if (Test-Path $tempRoot) {
        Remove-Item -LiteralPath $tempRoot -Recurse -Force
    }
}


