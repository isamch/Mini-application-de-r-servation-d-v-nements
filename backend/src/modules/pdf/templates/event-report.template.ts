import { Injectable } from '@nestjs/common';
import jsPDF from 'jspdf';
import { PdfTemplate, PdfTemplateData } from '../interfaces/pdf-template.interface';

@Injectable()
export class EventReportTemplate implements PdfTemplate {

  async generateContent(data: PdfTemplateData): Promise<any> {
    const doc = new jsPDF();
    const { event, bookings, stats } = data;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENT REPORT', 105, 30, { align: 'center' });

    // Event Info
    doc.setFontSize(14);
    doc.text(`Event: ${event.title}`, 20, 50);
    doc.text(`Date: ${event.date.toLocaleDateString()}`, 20, 65);
    doc.text(`Location: ${event.location}`, 20, 80);

    // Statistics
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Statistics:', 20, 100);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Bookings: ${stats.total}`, 20, 115);
    doc.text(`Confirmed: ${stats.confirmed}`, 20, 125);
    doc.text(`Pending: ${stats.pending}`, 20, 135);
    doc.text(`Refused: ${stats.refused}`, 20, 145);

    // Participants List
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Confirmed Participants:', 20, 165);

    let yPosition = 180;
    bookings.filter(b => b.status === 'confirmed').forEach((booking, index) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${index + 1}. ${booking.user.firstName} ${booking.user.lastName} - ${booking.user.email}`, 20, yPosition);
      yPosition += 10;
    });

    return doc;
  }

  getFileName(data: PdfTemplateData): string {
    return `event-report-${data.event.id}.pdf`;
  }
}
