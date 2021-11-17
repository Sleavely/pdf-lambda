const chromium = require('chrome-aws-lambda')
const handlebars = require('handlebars')

exports.renderUrl = async ({ url, data }) => {
  let browser = null
  try {
    browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    })
    const page = await browser.newPage()

    console.log('Navigating to URL', url)
    await page.goto(url, {
      timeout: 5000,
      waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
    })

    // Force desktop behavior
    await page.emulateMediaType('screen')

    // Inject data with Handlebars
    const html = await page.content()
    console.log('Original source bytes:', html.length)
    const renderTemplate = handlebars.compile(html)
    const compiledHtml = renderTemplate(data)
    await page.setContent(compiledHtml, { waitUntil: 'networkidle0' })
    console.log('Injected content. New byte length:', compiledHtml.length)

    const pdfStream = await page.createPDFStream({
      format: 'A4',
      preferCSSPageSize: true,
      printBackground: true,
    })
    console.log('Created PDF stream')

    pdfStream.on('error', (err) => {
      throw err
    })

    pdfStream.on('end', async () => {
      await browser.close()
    })

    return pdfStream
  } catch (err) {
    if (browser !== null) {
      await browser.close()
    }
    throw err
  }
}
