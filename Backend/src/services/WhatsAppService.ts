import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode';
import { existsSync } from 'fs';

function getChromePath(): string | undefined {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
    `${process.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
  ];
  return candidates.find(existsSync);
}

class WhatsAppService {
  private client: Client | null = null;
  private qrCodeBase64: string | null = null;
  private _ready = false;
  private _initializing = false;

  async initialize() {
    if (this.client || this._initializing) return;
    this._initializing = true;

    const chromePath = getChromePath();
    const puppeteerOpts: any = { headless: true, args: ['--no-sandbox'] };
    if (chromePath) puppeteerOpts.executablePath = chromePath;

    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: puppeteerOpts,
    });

    this.client.on('qr', async (qr) => {
      try {
        this.qrCodeBase64 = await qrcode.toDataURL(qr);
      } catch {
        this.qrCodeBase64 = qr;
      }
    });

    this.client.on('ready', () => {
      this._ready = true;
      this.qrCodeBase64 = null;
      console.log('WhatsApp conectado com sucesso!');
    });

    this.client.on('disconnected', (reason) => {
      this._ready = false;
      console.log('WhatsApp desconectado:', reason);
    });

    await this.client.initialize();
    this._initializing = false;
  }

  get status() {
    if (this._initializing) return 'initializing';
    if (this._ready) return 'connected';
    if (this.qrCodeBase64) return 'awaiting_scan';
    return 'disconnected';
  }

  get qrCode() {
    return this.qrCodeBase64;
  }

  async sendMessage(phone: string, text: string) {
    if (!this.client || !this._ready) {
      console.warn('WhatsApp não conectado. Mensagem não enviada.');
      return false;
    }
    const formatted = `55${phone.replace(/\D/g, '')}@c.us`;
    await this.client.sendMessage(formatted, text);
    return true;
  }
}

export const whatsappService = new WhatsAppService();
