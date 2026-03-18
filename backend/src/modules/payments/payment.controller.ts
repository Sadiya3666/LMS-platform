import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/db";

export const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { subjectId } = req.body;

    const subject = await prisma.subject.findUnique({
      where: { id: BigInt(subjectId) }
    });
    if (!subject) return res.status(404).json({ message: 'Course not found' });

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        user_id_subject_id: {
          user_id: userId,
          subject_id: BigInt(subjectId)
        }
      }
    });
    if (existing) return res.status(400).json({ message: 'Already enrolled' });

    if (subject.is_free || subject.price === 0) {
      // Free course: enroll directly
      await prisma.enrollment.create({
        data: {
          user_id: userId,
          subject_id: BigInt(subjectId)
        }
      });
      return res.json({
        success: true,
        enrolled: true,
        message: 'Enrolled successfully (free course)'
      });
    }

    // Paid course: create pending payment
    const txnId = `TXN_${Date.now()}_${userId}_${subjectId}`;
    const payment = await prisma.payment.create({
      data: {
        user_id: userId,
        subject_id: BigInt(subjectId),
        amount: subject.price,
        currency: 'INR',
        status: 'pending',
        transaction_id: txnId,
      }
    });

    return res.json({
      success: true,
      enrolled: false,
      payment: {
        id: payment.id.toString(),
        amount: subject.price,
        currency: 'INR',
        transaction_id: txnId,
        course_title: subject.title,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { transaction_id, card_number, expiry, cvv, name } = req.body;

    // Dummy validation
    if (!card_number || !expiry || !cvv || !name) {
      return res.status(400).json({ message: 'All payment fields required' });
    }

    // Simulate processing delay
    await new Promise(r => setTimeout(r, 1500));

    // Dummy: always succeed (except test card 0000)
    if (card_number.replace(/\s/g,'') === '0000000000000000') {
      await prisma.payment.update({
        where: { transaction_id },
        data: { status: 'failed' }
      });
      return res.status(400).json({ message: 'Payment failed. Please try a different card.' });
    }

    // Confirm payment and enroll
    const payment = await prisma.payment.update({
      where: { transaction_id },
      data: {
        status: 'success',
        paid_at: new Date(),
      }
    });

    // Create enrollment
    await prisma.enrollment.upsert({
      where: {
        user_id_subject_id: {
          user_id: userId,
          subject_id: payment.subject_id
        }
      },
      update: {},
      create: {
        user_id: userId,
        subject_id: payment.subject_id
      }
    });

    return res.json({
      success: true,
      enrolled: true,
      message: 'Payment successful! You are now enrolled.',
      transaction_id
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const payments = await prisma.payment.findMany({
      where: { user_id: userId },
      include: {
        subject: { select: { title: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    const mapped = payments.map(p => ({
      ...p,
      id: p.id.toString(),
      user_id: p.user_id.toString(),
      subject_id: p.subject_id.toString(),
      course_title: p.subject.title
    }));

    return res.json(mapped);
  } catch (error) {
    next(error);
  }
};
