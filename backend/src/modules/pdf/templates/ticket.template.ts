import { Injectable } from '@nestjs/common';
import jsPDF from 'jspdf';
import * as QRCode from 'qrcode';
import { PdfTemplate, PdfTemplateData } from '../interfaces/pdf-template.interface';

@Injectable()
export class TicketTemplate implements PdfTemplate {

  async generateContent(data: PdfTemplateData): Promise<any> {
    const doc = new jsPDF();
    const { booking } = data;

    // Generate QR code
    const qrData = {
      bookingId: booking.id,
      eventId: booking.eventId,
      userId: booking.userId,
      status: booking.status,
      hash: data.hash
    };

    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 100,
      margin: 2
    });

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENT TICKET', 105, 30, { align: 'center' });
    
    // Event details
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Event Details:', 20, 50);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Title: ${booking.event.title}`, 20, 65);
    doc.text(`Date: ${booking.event.date.toLocaleDateString()}`, 20, 75);
    doc.text(`Time: ${booking.event.startTime} - ${booking.event.endTime}`, 20, 85);
    doc.text(`Location: ${booking.event.location}`, 20, 95);

    // Participant details
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Participant Details:', 20, 115);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${booking.user.firstName} ${booking.user.lastName}`, 20, 130);
    doc.text(`Email: ${booking.user.email}`, 20, 140);
    doc.text(`Booking ID: ${booking.id}`, 20, 150);

    // QR Code
    doc.addImage(qrCodeImage, 'PNG', 140, 50, 40, 40);
    doc.setFontSize(10);
    doc.text('Scan for verification', 145, 100);

    // Footer
    doc.setFontSize(10);
    doc.text('Please present this ticket at the event entrance', 105, 200, { align: 'center' });

    return doc;
  }

  getFileName(data: PdfTemplateData): string {
    return `ticket-${data.booking.id}.pdf`;
  }
}
