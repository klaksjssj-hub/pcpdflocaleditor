declare module 'pdf-parse' {
  function pdfParse(dataBuffer: Buffer, options?: any): Promise<{
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }>;
  export = pdfParse;
}

declare module '@pdf-lib/fontkit';
declare module 'regenerator-runtime/runtime';
