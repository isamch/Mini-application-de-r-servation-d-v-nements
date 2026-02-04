import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Email Service
 * Handles email sending, template processing, and validation
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('email.host'),
      port: this.configService.get('email.port'),
      secure: this.configService.get('email.secure'),
      auth: {
        user: this.configService.get('email.user'),
        pass: this.configService.get('email.pass'),
      },
    });
  }

  /**
   * Validate single email address format
   * Returns true if email format is valid
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate array of email addresses
   * Throws exception if any email is invalid
   */
  private validateEmails(emails: string[]): void {
    const invalidEmails = emails.filter(email => !this.validateEmail(email));
    if (invalidEmails.length > 0) {
      throw new BadRequestException(`Invalid email addresses: ${invalidEmails.join(', ')}`);
    }
  }

  /**
   * Send email with validation
   * Validates inputs and sends email via SMTP
   */
  async sendEmail(to: string, subject: string, html: string, from?: string) {
    // Validate email address
    if (!this.validateEmail(to)) {
      throw new BadRequestException(`Invalid email address: ${to}`);
    }

    // Validate subject and content
    if (!subject || subject.trim().length === 0) {
      throw new BadRequestException('Email subject cannot be empty');
    }

    if (!html || html.trim().length === 0) {
      throw new BadRequestException('Email content cannot be empty');
    }

    try {
      await this.transporter.sendMail({
        from: from || this.configService.get('email.from'),
        to,
        subject,
        html,
      });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  /**
   * Load HTML email template from file
   * Returns template content or throws error if not found
   */
  loadTemplate(templateName: string): string {
    try {
      // Use process.cwd() to get the project root and look in src folder
      const templatePath = path.join(process.cwd(), 'src', 'modules', 'email', 'templates', `${templateName}.html`);
      return fs.readFileSync(templatePath, 'utf-8');
    } catch (error) {
      this.logger.error(`Template ${templateName} not found:`, error);
      throw new Error(`Email template ${templateName} not found`);
    }
  }

  /**
   * Replace variables in template
   * Substitutes {{variable}} placeholders with actual values
   */
  replaceVariables(template: string, variables: Record<string, any>): string {
    let result = template;
    Object.keys(variables).forEach(key => {
      const value = variables[key] || '';
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value.toString());
    });
    return result;
  }

  /**
   * Send email using template
   * Loads template, replaces variables, and sends email
   */
  async sendWithTemplate(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, any> = {},
    from?: string
  ) {
    // Validate inputs
    if (!templateName || templateName.trim().length === 0) {
      throw new BadRequestException('Template name cannot be empty');
    }

    const template = this.loadTemplate(templateName);
    const html = this.replaceVariables(template, variables);
    await this.sendEmail(to, subject, html, from);
  }

  /**
   * Send bulk emails to multiple recipients
   * Validates all emails and sends with error handling
   */
  async sendBulkEmail(recipients: string[], subject: string, html: string, from?: string) {
    // Validate all email addresses before sending
    this.validateEmails(recipients);

    if (recipients.length === 0) {
      throw new BadRequestException('Recipients list cannot be empty');
    }

    const results = [];
    for (const email of recipients) {
      try {
        await this.sendEmail(email, subject, html, from);
        results.push({ email, status: 'success' });
      } catch (error) {
        this.logger.error(`Failed to send bulk email to ${email}:`, error);
        results.push({ email, status: 'failed', error: error.message });
      }
    }

    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.length - successful;

    this.logger.log(`Bulk email sent: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  }
}