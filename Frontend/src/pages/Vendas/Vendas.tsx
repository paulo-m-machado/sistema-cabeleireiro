import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import styles from './Vendas.module.css';

interface Produto {
  id: number;
  descricao: string;
  marca: string;
  qtd_estoque: number;
  vlr_venda: number;
  total_vendas?: number;
}

interface CartItem {
  produto: Produto;
  quantidade: number;
}

interface TopSelling extends Produto {
  total_vendas: number;
}

export function Vendas() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [topSelling, setTopSelling] = useState<TopSelling[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nome: '', quantidade: '', fornecedor: '', preco: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [finalizando, setFinalizando] = useState(false);

  async function loadProdutos() {
    try {
      const res = await api.get('/produtos');
      setProdutos(res.data);
    } catch (err) {
      console.error('Erro ao carregar produtos', err);
    }
  }

  async function loadTopSelling() {
    try {
      const res = await api.get('/vendas/top-selling?limit=5');
      setTopSelling(res.data);
    } catch (err) {
      console.error('Erro ao carregar mais vendidos', err);
    }
  }

  useEffect(() => {
    loadProdutos();
    loadTopSelling();
  }, []);

  function addToCart(produto: Produto) {
    if ((produto.qtd_estoque ?? 0) <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.produto.id === produto.id);
      if (existing) {
        if (existing.quantidade >= (produto.qtd_estoque ?? 0)) return prev;
        return prev.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { produto, quantidade: 1 }];
    });
  }

  function removeFromCart(produtoId: number) {
    setCart(prev => {
      const existing = prev.find(item => item.produto.id === produtoId);
      if (existing && existing.quantidade > 1) {
        return prev.map(item =>
          item.produto.id === produtoId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        );
      }
      return prev.filter(item => item.produto.id !== produtoId);
    });
  }

  function getCartTotal() {
    return cart.reduce((acc, item) => acc + (item.produto.vlr_venda ?? 0) * item.quantidade, 0);
  }

  async function handleFinalizarVenda() {
    if (cart.length === 0) return;
    if (!user?.id) {
      setErro('Usuário não autenticado.');
      return;
    }
    setFinalizando(true);
    setErro('');
    setSucesso('');
    try {
      await api.post('/vendas/create-sale', {
        funcionario_id: user.id,
        itens: cart.map(item => ({
          produto_id: item.produto.id,
          quantidade: item.quantidade,
          valor_unitario: item.produto.vlr_venda ?? 0,
        })),
      });
      setSucesso(`Venda finalizada com sucesso! Total: R$ ${getCartTotal().toFixed(2)}`);
      setCart([]);
      loadProdutos();
      loadTopSelling();
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao finalizar venda.');
    } finally {
      setFinalizando(false);
    }
  }

  const filteredProdutos = produtos.filter(p =>
    !search || p.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  const totalEstoque = produtos.reduce((acc, p) => acc + (p.qtd_estoque ?? 0), 0);
  const totalCriticos = produtos.filter(p => (p.qtd_estoque ?? 0) > 0 && (p.qtd_estoque ?? 0) < 5).length;
  const totalEmFalta = produtos.filter(p => (p.qtd_estoque ?? 0) === 0).length;

  function handleCloseModal() {
    setModalAberto(false);
    setEditandoId(null);
    setFormData({ nome: '', quantidade: '', fornecedor: '', preco: '' });
    setErro('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    try {
      const body = {
        descricao: formData.nome,
        qtd_estoque: Number(formData.quantidade),
        marca: formData.fornecedor,
        vlr_venda: formData.preco ? Number(formData.preco) : undefined,
      };

      if (editandoId) {
        await api.put(`/produtos/${editandoId}`, body);
      } else {
        await api.post('/produtos', {
          ...body,
          data_inclusao: new Date(),
          STATUS: true,
        });
      }

      handleCloseModal();
      loadProdutos();
    } catch (err) {
      setErro('Erro ao salvar produto.');
    }
  }

  return (
    <main className={`${styles['vendas-main']} page-bg-image`}>
      <section className={styles['internal-hero']}>
        <h1 className={styles['internal-title']}>Vendas</h1>
        <p className={styles['internal-subtitle']}>Registre vendas e controle o estoque em tempo real</p>
        <div className={styles['hero-line']}></div>
      </section>

      <section className={styles['indicators-section']}>

        <div className={styles.container}>
          <div className={styles['indicators-grid']}>
            <div className={`${styles['indicator-card']} ${styles['skeleton-ready']}`}>
              <div className={styles['indicator-icon']} style={{ color: 'var(--accent-client)' }}>📦</div>
              <div className={styles['indicator-info']}>
                <span className={styles['indicator-label']}>Unidades em Estoque</span>
                <span className={styles['indicator-value']}>{totalEstoque}</span>
              </div>
            </div>

            <div className={`${styles['indicator-card']} ${styles['skeleton-ready']}`}>
              <div className={styles['indicator-icon']} style={{ color: 'var(--success)' }}>🛒</div>
              <div className={styles['indicator-info']}>
                <span className={styles['indicator-label']}>Carrinho</span>
                <span className={styles['indicator-value']}>{cart.reduce((a, i) => a + i.quantidade, 0)} itens</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {topSelling.length > 0 && (
        <section className={styles['top-selling-section']}>
          <div className={styles.container}>
            <h2 className={styles['section-title']}>⭐ Mais Vendidos</h2>
            <div className={styles['top-selling-grid']}>
              {topSelling.map((p, idx) => (
                <div key={p.id} className={`${styles['top-card']} ${styles['skeleton-ready']}`}>
                  <div className={styles['top-rank']}>#{idx + 1}</div>
                  <div className={styles['top-info']}>
                    <strong>{p.descricao}</strong>
                    <span className={styles['top-sales']}>{p.total_vendas} venda(s)</span>
                  </div>
                  <div className={styles['top-price']}>R$ {(p.vlr_venda ?? 0).toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className={styles['vendas-layout']}>
        <section className={styles['products-section']}>
          <div className={styles.container}>
            <div className={styles['products-toolbar']}>
              <div className={styles['search-filter-group']}>
                <div className={styles['input-icon-wrapper']}>
                  <span>🔍</span>
                  <input
                    type="text"
                    className={`${styles['modern-input']} ${styles['search-input']}`}
                    placeholder="Pesquisar produto..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <button
                className={styles['btn-primary']}
                onClick={() => { setEditandoId(null); setFormData({ nome: '', quantidade: '', fornecedor: '', preco: '' }); setModalAberto(true); }}
              >
                + Novo Produto
              </button>
            </div>

            <div className={styles['products-grid']}>
              {filteredProdutos.map(p => {
                const emEstoque = (p.qtd_estoque ?? 0) > 0;
                return (
                  <div key={p.id} className={`${styles['product-card']} ${styles['skeleton-ready']} ${!emEstoque ? styles['out-of-stock'] : ''}`}>
                    <div className={styles['product-icon']}>📦</div>
                    <div className={styles['product-body']}>
                      <strong className={styles['product-name']}>{p.descricao || 'Sem nome'}</strong>
                      <span className={styles['product-brand']}>{p.marca || 'Sem marca'}</span>
                      <div className={styles['product-details']}>
                        <span className={styles['product-price']}>R$ {(p.vlr_venda ?? 0).toFixed(2)}</span>
                        <span className={`${styles['product-stock']} ${(p.qtd_estoque ?? 0) <= 0 ? styles['stock-zero'] : (p.qtd_estoque ?? 0) < 5 ? styles['stock-low'] : ''}`}>
                          Estoque: {p.qtd_estoque ?? 0} un
                        </span>
                      </div>
                    </div>
                    <button
                      className={`${styles['btn-sell']} ${!emEstoque ? styles['btn-disabled'] : ''}`}
                      disabled={!emEstoque}
                      onClick={() => addToCart(p)}
                    >
                      {emEstoque ? 'Vender' : 'Indisponível'}
                    </button>
                  </div>
                );
              })}
              {filteredProdutos.length === 0 && (
                <div className={styles['empty-state']}>Nenhum produto encontrado.</div>
              )}
            </div>
          </div>
        </section>

        <aside className={styles['cart-sidebar']}>
          <div className={styles['cart-header']}>
            <h3>Carrinho</h3>
            <span className={styles['cart-count']}>{cart.length} item(ns)</span>
          </div>

          <div className={styles['cart-items']}>
            {cart.length === 0 ? (
              <div className={styles['cart-empty']}>
                <span style={{ fontSize: '2rem' }}>🛒</span>
                <p>Carrinho vazio</p>
                <small>Clique em "Vender" nos produtos para adicionar</small>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.produto.id} className={styles['cart-item']}>
                  <div className={styles['cart-item-info']}>
                    <strong>{item.produto.descricao}</strong>
                    <span className={styles['cart-item-price']}>
                      {item.quantidade} x R$ {(item.produto.vlr_venda ?? 0).toFixed(2)}
                    </span>
                    <span className={styles['cart-item-subtotal']}>
                      = R$ {((item.produto.vlr_venda ?? 0) * item.quantidade).toFixed(2)}
                    </span>
                  </div>
                  <div className={styles['cart-item-actions']}>
                    <button className={styles['cart-qty-btn']} onClick={() => removeFromCart(item.produto.id)}>−</button>
                    <span className={styles['cart-qty']}>{item.quantidade}</span>
                    <button
                      className={styles['cart-qty-btn']}
                      onClick={() => addToCart(item.produto)}
                      disabled={item.quantidade >= (item.produto.qtd_estoque ?? 0)}
                    >+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className={styles['cart-footer']}>
              <div className={styles['cart-total']}>
                <span>Total</span>
                <strong>R$ {getCartTotal().toFixed(2)}</strong>
              </div>
              {erro && <p className={styles['error-msg']}>{erro}</p>}
              {sucesso && <p className={styles['success-msg']}>{sucesso}</p>}
              <button
                className={`${styles['btn-primary']} ${styles['btn-finish']}`}
                onClick={handleFinalizarVenda}
                disabled={finalizando}
              >
                {finalizando ? 'Finalizando...' : 'Finalizar Venda'}
              </button>
            </div>
          )}
        </aside>
      </div>

      {modalAberto && (
        <div className={`${styles['modal-overlay']} ${styles.active}`}>
          <div className={`${styles['modal-content']} ${styles['premium-modal']}`}>
            <div className={styles['modal-header']}>
              <h2 className={styles['modal-title']}>{editandoId ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button className={styles['close-modal']} onClick={handleCloseModal}>&times;</button>
            </div>
            <div className={styles['modal-body']}>
              <form className={styles['premium-form']} onSubmit={handleSubmit}>
                <div className={styles['form-grid']}>
                  <div className={`${styles['form-group']} ${styles['full-width']}`}>
                    <label>Nome do Produto</label>
                    <input
                      type="text"
                      className={styles['modern-input']}
                      placeholder="Ex: Shampoo Absolut Repair"
                      required
                      value={formData.nome}
                      onChange={e => setFormData({ ...formData, nome: e.target.value })}
                    />
                  </div>

                  <div className={styles['form-group']}>
                    <label>Quantidade</label>
                    <input
                      type="number"
                      className={styles['modern-input']}
                      required
                      value={formData.quantidade}
                      onChange={e => setFormData({ ...formData, quantidade: e.target.value })}
                    />
                  </div>

                  <div className={styles['form-group']}>
                    <label>Preço de Venda (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      className={styles['modern-input']}
                      placeholder="0,00"
                      value={formData.preco}
                      onChange={e => setFormData({ ...formData, preco: e.target.value })}
                    />
                  </div>

                  <div className={`${styles['form-group']} ${styles['full-width']}`}>
                    <label>Marca / Fornecedor</label>
                    <input
                      type="text"
                      className={styles['modern-input']}
                      placeholder="Nome do distribuidor"
                      value={formData.fornecedor}
                      onChange={e => setFormData({ ...formData, fornecedor: e.target.value })}
                    />
                  </div>
                </div>
                {erro && <p className={styles['error-msg']}>{erro}</p>}

                <div className={styles['modal-footer']}>
                  <button type="button" className={styles['btn-outline-gold']} onClick={handleCloseModal}>Cancelar</button>
                  <button type="submit" className={styles['btn-primary']}>{editandoId ? 'Atualizar' : 'Salvar Produto'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
