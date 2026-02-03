import { Injectable } from '@nestjs/common';
import jsPDF from 'jspdf';
import { PdfTemplate, PdfTemplateData } from '../interfaces/pdf-template.interface';

@Injectable()
export class CertificateTemplate implements PdfTemplate {

  async generateContent(data: PdfTemplateData): Promise<any> {
    const doc = new jsPDF('landscape'); // Landscape orientation
    const { booking } = data;

    // Certificate border
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);
    doc.setLineWidth(1);
    doc.rect(15, 15, 267, 180);

    // Header
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATE OF ATTENDANCE', 148, 50, { align: 'center' });

    // Content
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', 148, 80, { align: 'center' });

    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`${booking.user.firstName} ${booking.user.lastName}`, 148, 100, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully attended', 148, 120, { align: 'center' });

    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${booking.event.title}`, 148, 140, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Held on ${booking.event.date.toLocaleDateString()}`, 148, 160, { align: 'center' });

    // Footer
    doc.setFontSize(12);
    doc.text(`Certificate ID: ${booking.id}`, 148, 180, { align: 'center' });

    return doc;
  }

  getFileName(data: PdfTemplateData): string {
    return `certificate-${data.booking.user.firstName}-${data.booking.id}.pdf`;
  }
}
