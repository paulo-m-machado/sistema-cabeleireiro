import { Router, Request, Response } from 'express';
import { whatsappService } from '../services/WhatsAppService';

const whatsappRoutes = Router();

whatsappRoutes.get('/status', (_req: Request, res: Response) => {
  res.json({
    status: whatsappService.status,
    qrCode: whatsappService.status === 'awaiting_scan' ? whatsappService.qrCode : null,
  });
});

whatsappRoutes.post('/reconnect', async (_req: Request, res: Response) => {
  try {
    await whatsappService.initialize();
    res.json({ message: 'Reconectando...' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { whatsappRoutes };
