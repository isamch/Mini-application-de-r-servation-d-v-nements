import { Module } from '@nestjs/common';
import { PdfService } from './services/pdf.service';
import { TicketTemplate } from './templates/ticket.template';
import { EventReportTemplate } from './templates/event-report.template';
import { CertificateTemplate } from './templates/certificate.template';

@Module({
  providers: [
    PdfService,
    TicketTemplate,
    EventReportTemplate,
    CertificateTemplate,
  ],
  exports: [PdfService],
})
export class PdfModule {}