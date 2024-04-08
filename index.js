const express = require('express');
const { ZplPrinter } = require('node-zpl');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/convert', async (req, res) => {
  const { zplCode } = req.body;

  const zplPrinter = new ZplPrinter();
  zplPrinter.setZpl(zplCode);

  const htmlContent = zplPrinter.renderZpl();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);

  const pdfBuffer = await page.pdf({ format: '4x6in', printBackground: true });

  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdfBuffer);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});