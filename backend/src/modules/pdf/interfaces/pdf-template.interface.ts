export interface PdfTemplateData {
  [key: string]: any;
}

export interface PdfTemplate {
  generateContent(data: PdfTemplateData): Promise<any>;
  getFileName(data: PdfTemplateData): string;
}

export enum PdfTemplateType {
  TICKET = 'ticket',
  EVENT_REPORT = 'event-report',
  CERTIFICATE = 'certificate',
  INVOICE = 'invoice',
  PARTICIPANT_LIST = 'participant-list'
}