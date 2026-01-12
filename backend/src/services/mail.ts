import nodemailer from 'nodemailer';
import { Prisma } from '@lemac/data-model';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.tecnico.ulisboa.pt',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
  secure: true,
  tls: {
    // Disable if the server has a self-signed certificate
    rejectUnauthorized: false,
  },
});

export async function sendEmail(to: string, subject: string, text: string): Promise<boolean> {
  const mailOptions = {
    from: "lemac-noreply@sysadm.dem.tecnico.ulisboa.pt",
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// PRINTING EMAILS

type PrintTaskWithMaterial = Prisma.PrintTaskGetPayload<{
  include: { material: true };
}>;

export async function sendSubmissionCustomerEmail(to: string, task: PrintTaskWithMaterial): Promise<boolean> {
  return sendEmail(
    to,
    `[LEMAC] #${task.id} 3D Printing Submission`,
    `
          This is an automated message to confirm your 3D printing submission.
          
          A follow up message will be sent to you soon, please wait further instructions.
          
                Task Name: ${task.name}
                First Name: ${task.studentName}
                IST ID: ${task.studentId}
                Unit of file: ${task.unit}
                Material: ${task.material.name}
                Price (€): ${task.price}
                Extra-Notes: ${task.observations}
          
          If you have any questions, please contact via monitores.lemac@dem.tecnico.ulisboa.pt.
          
          Thank you,
          LEMAC
          
          Do not reply to this email. An answer will not be provided.
    `
  );
}

export async function sendStatusChangedCustomerEmail(to: string, task: PrintTaskWithMaterial): Promise<boolean> {
  const status = {
    'WAITING': 'Waiting',
    'PENDING': 'Pending',
    'IN_QUEUE': 'In Queue',
    'PRINTING': 'Printing',
    'COMPLETED': 'Completed',
    'DELIVERED': 'Delivered',
    'CANCELLED': 'Cancelled'
  }
  return sendEmail(
    to,
    `[LEMAC] #${task.id} Status Changed to '${status[task.status]}'`,
    `
          This is an automated message to inform you about your 3D printing submission.
          
          Your printing task '${task.name}' status has changed to '${status[task.status]}'.
          
          ${task.status === 'COMPLETED' ? 'You can now pick up your printed model at LEMAC.\n' : ''}
          If you have any questions, please contact via monitores.lemac@dem.tecnico.ulisboa.pt.
          
          Thank you,
          LEMAC
          
          Do not reply to this email. An answer will not be provided.
    `
  );
}

export async function sendSubmissionStaffEmail(task: PrintTaskWithMaterial): Promise<boolean> {
  return sendEmail(
    'monitores.lemac@dem.tecnico.ulisboa.pt',
    `[LEMAC] #${task.id} 3D Printing Submission`,
    `
          This is an automated message to inform about a new 3D printing submission.
          
          Submission details:
          
                Task Name: ${task.name}
                First Name: ${task.studentName}
                IST ID: ${task.studentId}
                Unit of file: ${task.unit}
                Material: ${task.material.name}
                Price (€): ${task.price}
                Extra-Notes: ${task.observations}
          
          Claim this submission via the LEMAC Staff Dashboard, or by clicking <a href="http://lemac.tecnico.ulisboa.pt/staff/printing-tasks">here</a>.
          
          Thank you,
          LEMAC
          
          Do not reply to this email. An answer will not be provided.
    `
  );
}