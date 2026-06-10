import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import styles from './Estoque.module.css';

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  fornecedor: string;
  preco: number;
  validade: string | null;
}

export function Estoque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nome: '', quantidade: '', fornecedor: '', preco: '', validade: '' });
  const [erro, setErro] = useState('');
  const [search, setSearch] = useState('');
  const [filtroQtd, setFiltroQtd] = useState('all');

  async function loadEstoque() {
    try {
      const res = await api.get('/produtos');
      setProdutos(
        res.data.map((p: any) => ({
          id: p.id,
          nome: p.descricao ?? '',
          quantidade: p.qtd_estoque ?? 0,
          fornecedor: p.marca ?? '',
          preco: p.vlr_venda ?? 0,
          validade: p.data_validade ?? null,
        }))
      );
    } catch (err) {
      console.error('Erro ao carregar estoque', err);
    }
  }

  useEffect(() => {
    loadEstoque();
  }, []);

  function handleEdit(produto: Produto) {
    setEditandoId(produto.id);
    setFormData({
      nome: produto.nome,
      quantidade: String(produto.quantidade),
      fornecedor: produto.fornecedor,
      preco: produto.preco ? produto.preco.toFixed(2) : '',
      validade: produto.validade ? produto.validade.substring(0, 10) : '',
    });
    setModalAberto(true);
    setErro('');
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await api.delete(`/produtos/${id}`);
      loadEstoque();
    } catch (err) {
      console.error('Erro ao excluir produto', err);
    }
  }

  function handleCloseModal() {
    setModalAberto(false);
    setEditandoId(null);
    setFormData({ nome: '', quantidade: '', fornecedor: '', preco: '', validade: '' });
    setErro('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    try {
      const body: any = {
        descricao: formData.nome,
        qtd_estoque: Number(formData.quantidade),
        marca: formData.fornecedor,
        vlr_venda: formData.preco ? Number(formData.preco) : undefined,
        data_validade: formData.validade ? new Date(formData.validade) : undefined,
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
      loadEstoque();
    } catch (err) {
      setErro('Erro ao salvar produto.');
    }
  }

  const filteredProdutos = produtos.filter(p => {
    const matchSearch = !search || p.nome.toLowerCase().includes(search.toLowerCase());
    const matchQtd = filtroQtd === 'all' || (filtroQtd === 'low' && p.quantidade > 0 && p.quantidade < 10);
    return matchSearch && matchQtd;
  });

  const totalDisponiveis = produtos.reduce((acc, p) => acc + p.quantidade, 0);
  const totalCriticos = produtos.filter(p => p.quantidade > 0 && p.quantidade < 10).length;
  const totalEmFalta = produtos.filter(p => p.quantidade === 0).length;
  return (
    <main className={`${styles['estoque-main']} page-bg-image`}>
      <section className={styles['internal-hero']}>
        <h1 className={styles['internal-title']}>Estoque Inteligente</h1>
        <p className={styles['internal-subtitle']}>Controle premium e monitoramento em tempo real</p>
        <div className={styles['hero-line']}></div>
      </section>

      <section className={styles['indicators-section']}>
        <div className={styles.container}>
          <div className={styles['indicators-grid']}>
            <div className={`${styles['indicator-card']} ${styles['skeleton-ready']}`}>
              <div className={styles['indicator-icon']} style={{ color: 'var(--accent-client)' }}>📦</div>
              <div className={styles['indicator-info']}>
                <span className={styles['indicator-label']}>Produtos Disponíveis</span>
                <span className={styles['indicator-value']}>{totalDisponiveis}</span>
              </div>
            </div>
            <div className={`${styles['indicator-card']} ${styles['skeleton-ready']}`}>
              <div className={styles['indicator-icon']} style={{ color: 'var(--accent-gold)' }}>⚠️</div>
              <div className={styles['indicator-info']}>
                <span className={styles['indicator-label']}>Produtos Críticos</span>
                <span className={styles['indicator-value']}>{totalCriticos}</span>
              </div>
            </div>
            <div className={`${styles['indicator-card']} ${styles['skeleton-ready']}`}>
              <div className={styles['indicator-icon']} style={{ color: 'var(--danger)' }}>❌</div>
              <div className={styles['indicator-info']}>
                <span className={styles['indicator-label']}>Em Falta</span>
                <span className={styles['indicator-value']}>{totalEmFalta}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className={styles['inventory-toolbar-section']}>
        <div className={styles.container}>
          <div className={styles['inventory-toolbar']}>
            <div className={styles['search-filter-group']}>
              <div className={styles['input-icon-wrapper']}>
                <span>🔍</span>
                <input type="text" className={`${styles['modern-input']} ${styles['search-input']}`} placeholder="Pesquisar produto..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className={`${styles['modern-select']} ${styles['filter-select']}`}>
                <option value="all">Todas as Categorias</option>
                <option value="shampoos">Shampoos</option>
              </select>
              <select className={`${styles['modern-select']} ${styles['filter-select']}`} value={filtroQtd} onChange={e => setFiltroQtd(e.target.value)}>
                <option value="all">Qualquer Quantidade</option>
                <option value="low">Estoque Baixo</option>
              </select>
            </div>
<button className={`${styles['btn-primary']} ${styles['add-product-btn']}`} onClick={() => { setEditandoId(null); setFormData({ nome: '', quantidade: '', fornecedor: '', preco: '', validade: '' }); setModalAberto(true); }}>
               + Novo Produto
            </button>
          </div>
        </div>
      </section>

      <section className={styles['inventory-list-section']}>
        <div className={styles.container}>
          <div className={styles['hybrid-list-header']}>
            <div className={`${styles['hybrid-col']} ${styles['col-img']}`}>Imagem</div>
            <div className={`${styles['hybrid-col']} ${styles['col-name']}`}>Produto</div>
            <div className={`${styles['hybrid-col']} ${styles['col-category']}`}>Categoria</div>
            <div className={`${styles['hybrid-col']} ${styles['col-qty']}`}>Estoque</div>
            <div className={`${styles['hybrid-col']} ${styles['col-validity']}`}>Validade</div>
            <div className={`${styles['hybrid-col']} ${styles['col-supplier']}`}>Fornecedor</div>
            <div className={`${styles['hybrid-col']} ${styles['col-price']}`}>Preço</div>
            <div className={`${styles['hybrid-col']} ${styles['col-status']}`}>Status</div>
            <div className={`${styles['hybrid-col']} ${styles['col-actions']}`}>Ações</div>
          </div>

          <div className={styles['hybrid-list-body']}>
            {filteredProdutos.map(p => {
              let statusClass = styles['badge-normal'];
              let statusText = 'Estoque Normal';
              let fillClass = styles['fill-normal'];
              let fillWidth = '80%';

              if (p.quantidade === 0) {
                statusClass = styles['badge-urgent'];
                statusText = 'Em Falta';
                fillClass = styles['fill-out'];
                fillWidth = '0%';
              } else if (p.quantidade < 10) {
                statusClass = styles['badge-critical'];
                statusText = 'Estoque Crítico';
                fillClass = styles['fill-critical'];
                fillWidth = '10%';
              }

              return (
                <div key={p.id} className={`${styles['hybrid-item']} ${styles['skeleton-ready']}`}>
                  <div className={`${styles['hybrid-col']} ${styles['col-img']}`}>
                    <div className={styles['product-img-placeholder']}>📦</div>
                  </div>
                  <div className={`${styles['hybrid-col']} ${styles['col-name']}`} data-label="Produto">
                    <strong>{p.nome}</strong>
                    <small>Geral</small>
                  </div>
                  <div className={`${styles['hybrid-col']} ${styles['col-category']}`} data-label="Categoria">Diversos</div>
                  <div className={`${styles['hybrid-col']} ${styles['col-qty']}`} data-label="Quantidade">
                    <span className={styles['qty-number']}>{p.quantidade} un</span>
                    <div className={styles['stock-level-bar']}>
                      <div className={`${styles.fill} ${fillClass}`} style={{ width: fillWidth }}></div>
                    </div>
                  </div>
                  <div className={`${styles['hybrid-col']} ${styles['col-validity']}`} data-label="Validade">{p.validade ? new Date(p.validade).toLocaleDateString('pt-BR') : '-'}</div>
                  <div className={`${styles['hybrid-col']} ${styles['col-supplier']}`} data-label="Fornecedor">{p.fornecedor}</div>
                  <div className={`${styles['hybrid-col']} ${styles['col-price']}`} data-label="Preço">R$ {p.preco.toFixed(2)}</div>
                  <div className={`${styles['hybrid-col']} ${styles['col-status']}`} data-label="Status">
                    <span className={`${styles.badge} ${statusClass}`}>{statusText}</span>
                  </div>
                  <div className={`${styles['hybrid-col']} ${styles['col-actions']}`} data-label="Ações">
                    <button className={`${styles['action-btn']} ${styles['edit-btn']}`} title="Editar" onClick={() => handleEdit(p)}>✏️</button>
                    <button className={`${styles['action-btn']} ${styles['delete-btn']}`} title="Remover" onClick={() => handleDelete(p.id)}>🗑️</button>
                  </div>
                </div>
              );
            })}
            {filteredProdutos.length === 0 && (
              <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                Nenhum produto cadastrado.
              </div>
            )}
          </div>
        </div>
      </section>

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
                    <label>Quantidade Atual</label>
                    <input 
                      type="number" 
                      className={styles['modern-input']} 
                      required 
                      value={formData.quantidade}
                      onChange={e => setFormData({ ...formData, quantidade: e.target.value })}
                    />
                  </div>
                  
                  <div className={styles['form-group']}>
                    <label>Fornecedor</label>
                    <input 
                      type="text" 
                      className={styles['modern-input']} 
                      placeholder="Nome do distribuidor"
                      value={formData.fornecedor}
                      onChange={e => setFormData({ ...formData, fornecedor: e.target.value })}
                    />
                  </div>

                  <div className={styles['form-group']}>
                    <label>Preço de Venda (R$)</label>
                    <input 
                      type="number" 
                      className={styles['modern-input']} 
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={formData.preco}
                      onChange={e => setFormData({ ...formData, preco: e.target.value })}
                    />
                  </div>

                  <div className={styles['form-group']}>
                    <label>Data de Validade</label>
                    <input 
                      type="date" 
                      className={styles['modern-input']}
                      value={formData.validade}
                      onChange={e => setFormData({ ...formData, validade: e.target.value })}
                    />
                  </div>
                </div>
                {erro && <p style={{ color: 'red', marginTop: '10px' }}>{erro}</p>}
                
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
