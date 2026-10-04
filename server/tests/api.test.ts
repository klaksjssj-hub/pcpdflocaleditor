import request from 'supertest';
import { app } from '../src/index';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

describe('localpdf API Integration Tests', () => {
  let samplePdf1Path: string;
  let samplePdf2Path: string;
  let uploadedFileId1: string;
  let uploadedFileId2: string;

  beforeAll(async () => {
    // Generate two sample PDFs
    const doc1 = await PDFDocument.create();
    const page1 = doc1.addPage([400, 600]);
    page1.drawText('Sample Document 1 - Page 1', { x: 50, y: 550, size: 18, color: rgb(0, 0, 0) });
    const page2 = doc1.addPage([400, 600]);
    page2.drawText('Sample Document 1 - Page 2', { x: 50, y: 550, size: 18, color: rgb(0, 0, 0) });
    const pdf1Bytes = await doc1.save();

    const doc2 = await PDFDocument.create();
    const doc2Page = doc2.addPage([400, 600]);
    doc2Page.drawText('Sample Document 2 - Page 1', { x: 50, y: 550, size: 18, color: rgb(0, 0, 0) });
    const pdf2Bytes = await doc2.save();

    const testDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

    samplePdf1Path = path.join(testDir, 'sample1.pdf');
    samplePdf2Path = path.join(testDir, 'sample2.pdf');

    fs.writeFileSync(samplePdf1Path, pdf1Bytes);
    fs.writeFileSync(samplePdf2Path, pdf2Bytes);
  });

  afterAll(() => {
    const testDir = path.join(__dirname, 'temp');
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  test('GET /health - Service health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('localpdf-engine');
  });

  test('POST /api/upload - Upload multiple PDF files', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('files', samplePdf1Path)
      .attach('files', samplePdf2Path);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.files).toHaveLength(2);

    uploadedFileId1 = res.body.files[0].id;
    uploadedFileId2 = res.body.files[1].id;
    expect(uploadedFileId1).toBeDefined();
    expect(uploadedFileId2).toBeDefined();
  });

  test('POST /api/merge - Merge two PDFs into one', async () => {
    const res = await request(app)
      .post('/api/merge')
      .send({
        files: [
          { fileId: uploadedFileId1 },
          { fileId: uploadedFileId2 },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.fileId).toBeDefined();
    expect(res.body.downloadUrl).toBeDefined();

    // Verify download
    const dlRes = await request(app).get(res.body.downloadUrl);
    expect(dlRes.status).toBe(200);
    expect(dlRes.headers['content-type']).toContain('application/pdf');
  });

  test('POST /api/split - Split PDF by range', async () => {
    const res = await request(app)
      .post('/api/split')
      .send({
        fileId: uploadedFileId1,
        mode: 'range',
        ranges: '1-1',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.fileId).toBeDefined();
  });

  test('POST /api/compress - Compress PDF', async () => {
    const res = await request(app)
      .post('/api/compress')
      .send({
        fileId: uploadedFileId1,
        level: 'medium',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.compressedSize).toBeGreaterThan(0);
  });

  test('POST /api/edit - Add watermark & rotate page', async () => {
    const res = await request(app)
      .post('/api/edit')
      .send({
        fileId: uploadedFileId1,
        rotations: { 1: 90 },
        watermark: {
          text: 'CONFIDENTIAL',
          opacity: 0.4,
          fontSize: 32,
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.downloadUrl).toBeDefined();
  });

  test('POST /api/protect/protect - Encrypt and protect PDF', async () => {
    const res = await request(app)
      .post('/api/protect/protect')
      .send({
        fileId: uploadedFileId1,
        userPassword: 'secretPassword123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.fileId).toBeDefined();
  });

  test('POST /api/sign - Place signature on PDF page', async () => {
    const signatureBase64 =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const res = await request(app)
      .post('/api/sign')
      .send({
        fileId: uploadedFileId1,
        signatures: [
          {
            page: 1,
            signatureDataUrl: signatureBase64,
            x: 50,
            y: 50,
            width: 100,
            height: 40,
          },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.fileId).toBeDefined();
  });

  test('GET /api/stats - Check usage analytics', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats.totalOperations).toBeGreaterThan(0);
  });

  test('OCR / textToPdf handles WinAnsi non-encodable characters (0xf0de) gracefully', async () => {
    const { ConvertService } = require('../src/services/convertService');
    const trickyText = `OCR Header ${String.fromCharCode(0xf0de)} with Unicode: \u201csmart quotes\u201d, em-dash \u2014, bullet \u2022 and special icon ${String.fromCharCode(0xf0de)}`;
    const pdfBuf = await ConvertService.textToPdf('OCR Test Document', trickyText);
    expect(pdfBuf).toBeDefined();
    expect(pdfBuf.length).toBeGreaterThan(0);
  });

  test('OCR / textToPdf renders Hindi (Devanagari) and Unicode text successfully', async () => {
    const { ConvertService } = require('../src/services/convertService');
    const hindiText = 'नमस्ते दुनिया - भारतवर्ष की प्राचीन एवं समृद्ध भाषा हिन्दी';
    const pdfBuf = await ConvertService.textToPdf('हिन्दी दस्तावेज़', hindiText);
    expect(pdfBuf).toBeDefined();
    expect(pdfBuf.length).toBeGreaterThan(1000);
  });
});
