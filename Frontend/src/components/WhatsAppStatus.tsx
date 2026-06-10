import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

interface WhatsAppStatusData {
  status: string;
  qrCode: string | null;
}

export function WhatsAppStatus() {
  const [data, setData] = useState<WhatsAppStatusData | null>(null);
  const [open, setOpen] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await api.get('/whatsapp/status');
      setData(res.data);
    } catch {
      setData({ status: 'error', qrCode: null });
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 5000);
    return () => clearInterval(id);
  }, [fetchStatus]);

  const statusLabel: Record<string, { text: string; color: string }> = {
    connected: { text: 'WhatsApp Conectado', color: '#2ECC71' },
    awaiting_scan: { text: 'Escaneie o QR Code', color: '#F39C12' },
    initializing: { text: 'Inicializando...', color: '#3498DB' },
    disconnected: { text: 'WhatsApp Desconectado', color: '#E74C3C' },
    error: { text: 'Erro de conexão', color: '#E74C3C' },
  };

  const s = statusLabel[data?.status || 'disconnected'];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        title={s.text}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '1.1rem', padding: '0 8px',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill={s.color}>
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute', top: '100%', right: 0, zIndex: 1000,
            background: '#1a1a2e', border: '1px solid #333', borderRadius: '8px',
            padding: '1rem', minWidth: '220px', marginTop: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, display: 'inline-block' }} />
            <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{s.text}</strong>
          </div>

          {data?.status === 'awaiting_scan' && data.qrCode && (
            <div>
              <p style={{ color: '#aaa', fontSize: '0.75rem', marginBottom: '8px' }}>
                Escaneie com o WhatsApp do seu celular
              </p>
              <img src={data.qrCode} alt="QR Code" style={{ width: '100%', maxWidth: 180, display: 'block', margin: '0 auto', borderRadius: '4px' }} />
            </div>
          )}

          {data?.status === 'disconnected' && (
            <button
              onClick={async () => {
                await api.post('/whatsapp/reconnect');
                fetchStatus();
              }}
              style={{
                background: '#25D366', color: '#fff', border: 'none',
                padding: '6px 12px', borderRadius: '4px', cursor: 'pointer',
                fontSize: '0.8rem', width: '100%',
              }}
            >
              Reconectar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
