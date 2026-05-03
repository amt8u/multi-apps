import { useEffect, useMemo, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import './App.css'

const dotTypeByStyle = {
  dot: 'dots',
  square: 'square',
  circles: 'rounded',
}

const valueLabel = {
  url: 'URL',
  text: 'Text',
  email: 'Email',
  phone: 'Phone number',
  sms: 'SMS number',
}

function App() {
  const [title, setTitle] = useState('My QR')
  const [frame, setFrame] = useState('card')
  const [color, setColor] = useState('#1b4332')
  const [codeType, setCodeType] = useState('url')
  const [value, setValue] = useState('https://example.com')
  const [subtext, setSubtext] = useState('Scan to open')
  const [style, setStyle] = useState('square')
  const [paddingWidth, setPaddingWidth] = useState(0)
  const [downloadType, setDownloadType] = useState('png')
  const [border, setBorder] = useState(0)

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    window.location.assign('/')
  }

  const qrContainerRef = useRef(null)
  const qrCodeRef = useRef(null)

  const renderType = downloadType === 'svg' ? 'svg' : 'canvas'

  const qrData = useMemo(() => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
      return ''
    }

    switch (codeType) {
      case 'email':
        return `mailto:${trimmedValue}`
      case 'phone':
        return `tel:${trimmedValue}`
      case 'sms':
        return `sms:${trimmedValue}`
      case 'text':
        return trimmedValue
      case 'url':
      default:
        return trimmedValue
    }
  }, [codeType, value])

  const downloadName = useMemo(() => {
    const safeTitle = title.trim().replace(/[^a-zA-Z0-9-_ ]+/g, '').replace(/\s+/g, '-')

    if (safeTitle) {
      return safeTitle
    }

    if (codeType === 'url') {
      try {
        const parsedUrl = new URL(value.trim())
        return parsedUrl.hostname.replace(/^www\./, '') || 'qr-code'
      } catch {
        return 'qr-code'
      }
    }

    return 'qr-code'
  }, [codeType, title, value])

  useEffect(() => {
    const container = qrContainerRef.current

    const qrCode = new QRCodeStyling({
      width: 320,
      height: 320,
      type: renderType,
      data: ' ',
      margin: 0,
      backgroundOptions: {
        color: '#ffffff',
      },
    })

    qrCodeRef.current = qrCode

    if (container) {
      container.innerHTML = ''
      qrCode.append(container)
    }

    return () => {
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [renderType])

  useEffect(() => {
    if (!qrCodeRef.current) {
      return
    }

    qrCodeRef.current.update({
      data: qrData || ' ',
      margin: paddingWidth,
      dotsOptions: {
        color,
        type: dotTypeByStyle[style],
      },
      cornersSquareOptions: {
        color,
      },
      cornersDotOptions: {
        color,
      },
    })
  }, [color, paddingWidth, qrData, renderType, style])

  const handleDownload = async () => {
    if (!qrCodeRef.current) {
      return
    }

    const outputType = downloadType === 'jpg' ? 'jpeg' : downloadType
    const outputMimeType = {
      png: 'image/png',
      jpeg: 'image/jpeg',
      svg: 'image/svg+xml',
    }

    const rawData = await qrCodeRef.current.getRawData(outputType)

    if (!rawData) {
      return
    }

    const blob =
      rawData instanceof Blob
        ? rawData
        : new Blob([rawData], { type: outputMimeType[outputType] })

    const fileUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = `${downloadName}.${downloadType}`
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(fileUrl)
  }

  return (
    <main className="app-shell">
      <section className="panel controls-panel">
        <button type="button" className="back-button" onClick={handleBack}>
          ← Back
        </button>
        <div className="header-block">
          <h1>QR Code Generator by amt8u</h1>
          <p>Created by <a href="https://cybercafe.dev" >cybercafe.dev</a></p>
        </div>
      </section>

      <section className="panel controls-grid" aria-label="QR options">
        <label>
          Code type
          <select value={codeType} onChange={(event) => setCodeType(event.target.value)}>
            <option value="url">URL</option>
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="sms">SMS</option>
          </select>
        </label>

        <label>
          Color
          <input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
        </label>

        <label>
          Frame
          <select value={frame} onChange={(event) => setFrame(event.target.value)}>
            <option value="none">None</option>
            <option value="rounded">Rounded</option>
            <option value="card">Card</option>
            <option value="highlight">Highlight</option>
          </select>
        </label>

        <label className="full-width">
          {valueLabel[codeType]}
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Enter QR content"
          />
        </label>

        <label className="full-width">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Campaign title"
          />
        </label>

        <label className="full-width">
          Subtext
          <input
            value={subtext}
            onChange={(event) => setSubtext(event.target.value)}
            placeholder="Optional subtitle below QR"
          />
        </label>

        <label>
          Style
          <select value={style} onChange={(event) => setStyle(event.target.value)}>
            <option value="dot">Dot</option>
            <option value="square">Square</option>
            <option value="circles">Circles</option>
          </select>
        </label>

        <label>
          Padding width
          <input
            type="number"
            min="0"
            max="48"
            value={paddingWidth}
            onChange={(event) => setPaddingWidth(Number(event.target.value) || 0)}
          />
        </label>

        <label>
          Border
          <input
            type="number"
            min="0"
            max="24"
            value={border}
            onChange={(event) => setBorder(Number(event.target.value) || 0)}
          />
        </label>

        <label>
          Download type
          <select
            value={downloadType}
            onChange={(event) => setDownloadType(event.target.value)}
          >
            <option value="png">png</option>
            <option value="svg">svg</option>
            <option value="jpg">jpg</option>
          </select>
        </label>
      </section>

      <section className="panel preview-panel">
        <div className={`qr-frame ${frame}`} style={{ borderColor: color }}>
          {title && <h2>{title}</h2>}
          <div
            className="qr-preview"
            ref={qrContainerRef}
            style={{ borderColor: color, borderWidth: `${border}px` }}
          />
          {subtext && <p>{subtext}</p>}
        </div>

        <button type="button" className="download-btn" onClick={handleDownload}>
          Download QR
        </button>
      </section>
    </main>
  )
}

export default App
