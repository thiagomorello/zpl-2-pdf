import express, { Request, Response } from 'express';
import { createCanvas, loadImage } from 'canvas';
import { Image } from 'canvas';
import fs from 'fs';
import PDFDocument from 'pdfkit';
import { imageDataURI } from 'image-data-uri';

const app = express();
const port = 8080;

app.use(express.json());

app.post('/convert', async (req: Request, res: Response) => {
  const { zplCode } = req.body;

  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  // Example: Drawing text on the canvas
  ctx.font = '20px Arial';
  ctx.fillText('Hello, World!', 50, 50);

  // Convert canvas to PNG image
  const pngDataURI = canvas.toDataURL();

  const pdfDoc = new PDFDocument();
  const imageBuffer = await imageDataURI.decode(pngDataURI);
  const image = new Image();
  image.src = imageBuffer.dataUri;

  pdfDoc.image(image, 50, 50, { width: 500 });

  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    pdfDoc.on('data', (chunk) => chunks.push(chunk));
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.end();
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdfBuffer);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});