// src/modules/pdf/services/pdf.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PdfTemplate, PdfTemplateData, PdfTemplateType } from '../interfaces/pdf-template.interface';
import { TicketTemplate } from '../templates/ticket.template';
import { EventReportTemplate } from '../templates/event-report.template';
import { CertificateTemplate } from '../templates/certificate.template';
import { HashUtil } from '../../../common/utils/hash.util';


@Injectable()
export class PdfService {
  private templates: Map<PdfTemplateType, PdfTemplate>;

  constructor(
    private readonly ticketTemplate: TicketTemplate,
    private readonly eventReportTemplate: EventReportTemplate,
    private readonly certificateTemplate: CertificateTemplate,
  ) {
    this.templates = new Map([
      [PdfTemplateType.TICKET, this.ticketTemplate],
      [PdfTemplateType.EVENT_REPORT, this.eventReportTemplate],
      [PdfTemplateType.CERTIFICATE, this.certificateTemplate],
    ]);
  }

  /**
   * Generate PDF using specified template
   * Dynamic method that works with any template type
   */
  async generatePdf(
    templateType: PdfTemplateType,
    data: PdfTemplateData
  ): Promise<{ buffer: Buffer; fileName: string }> {
    const template = this.templates.get(templateType);

    if (!template) {
      throw new BadRequestException(`Template ${templateType} not found`);
    }

    const doc = await template.generateContent(data);
    const fileName = template.getFileName(data);

    const pdfOutput = doc.output('arraybuffer');
    const buffer = Buffer.from(pdfOutput);

    return { buffer, fileName };
  }

  /**
   * Generate ticket PDF (wrapper for backward compatibility)
   */
  async generateTicket(booking: any): Promise<Buffer> {
    const hash = HashUtil.generateTicketHash(booking.id, booking.eventId, booking.userId);
    const data = { booking, hash };

    const result = await this.generatePdf(PdfTemplateType.TICKET, data);
    return result.buffer;
  }

  /**
   * Generate event report PDF
   */
  async generateEventReport(event: any, bookings: any[], stats: any): Promise<Buffer> {
    const data = { event, bookings, stats };

    const result = await this.generatePdf(PdfTemplateType.EVENT_REPORT, data);
    return result.buffer;
  }

  /**
   * Generate attendance certificate
   */
  async generateCertificate(booking: any): Promise<Buffer> {
    const data = { booking };

    const result = await this.generatePdf(PdfTemplateType.CERTIFICATE, data);
    return result.buffer;
  }

  /**
   * Register new template dynamically
   */
  registerTemplate(type: PdfTemplateType, template: PdfTemplate): void {
    this.templates.set(type, template);
  }

  /**
   * Get available template types
   */
  getAvailableTemplates(): PdfTemplateType[] {
    return Array.from(this.templates.keys());
  }

  private generateVerificationHash(booking: any): string {
    const data = `${booking.id}-${booking.eventId}-${booking.userId}-${process.env.JWT_SECRET}`;
    return Buffer.from(data).toString('base64');
  }
}
