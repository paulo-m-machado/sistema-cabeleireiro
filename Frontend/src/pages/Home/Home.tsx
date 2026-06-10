import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export function Home() {
  return (
    <>
      <main className={styles['home-main']}>
        <section className={styles.hero}>
          <div className={styles['hero-overlay']}></div>
          <div className={styles['hero-content']}>
            <h1 className={styles['hero-title']}>Sebastian Cabelo e Estética</h1>
            <p className={styles['hero-subtitle']}>Beleza com arte. Cuidado com excelência.</p>
            <div className={styles['hero-line']}></div>
            <div className={styles['hero-buttons']}>
              <Link to="/agendamento" className={styles['btn-outline-white']}>Agendar Agora</Link>
              <Link to="/servicos" className={styles['btn-outline-gold']}>Ver Serviços</Link>
            </div>
          </div>
        </section>

        <section className={styles['features-section']}>
          <div className={styles['features-grid']}>
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className={styles['feature-title']}>Profissionais Especializados</h3>
              <p className={styles['feature-desc']}>Nossa equipe conta com mais de 10 anos de experiência para oferecer o melhor resultado.</p>
            </div>
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>
              </div>
              <h3 className={styles['feature-title']}>Produtos Premium</h3>
              <p className={styles['feature-desc']}>Trabalhamos apenas com marcas selecionadas e de alta tecnologia para cuidar dos seus fios.</p>
            </div>
            <div className={styles['feature-card']}>
              <div className={styles['feature-icon']}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <h3 className={styles['feature-title']}>Agendamento Fácil</h3>
              <p className={styles['feature-desc']}>Marque seu horário de forma online, rápida e prática em apenas alguns cliques.</p>
            </div>
          </div>
        </section>

        <section className={styles['services-section']}>
          <h2 className={styles['section-title']}>Nossos Serviços em Destaque</h2>
          <div className={styles['section-line']}></div>
          <div className={styles['services-grid']}>
            <div className={styles['service-card']}>
              <h3 className={styles['service-title']}>Corte Feminino</h3>
              <p className={styles['service-desc']}>Cortes modernos, clássicos e personalizados de acordo com o seu estilo.</p>
            </div>
            <div className={styles['service-card']}>
              <h3 className={styles['service-title']}>Coloração e Luzes</h3>
              <p className={styles['service-desc']}>Técnicas avançadas de iluminação para destacar a sua beleza.</p>
            </div>
            <div className={styles['service-card']}>
              <h3 className={styles['service-title']}>Estética Facial</h3>
              <p className={styles['service-desc']}>Limpeza de pele profunda e tratamentos rejuvenescedores.</p>
            </div>
            <div className={styles['service-card']}>
              <h3 className={styles['service-title']}>Manicure & Pedicure</h3>
              <p className={styles['service-desc']}>Cuidados completos para unhas perfeitas e saudáveis.</p>
            </div>
          </div>
        </section>

        <section className={styles['testimonials-section']}>
          <h2 className={styles['section-title']}>O que nossos clientes dizem</h2>
          <div className={styles['section-line']}></div>
          <div className={styles['testimonials-grid']}>
            <div className={styles['testimonial-card']}>
              <div className={styles['testimonial-header']}>
                <div className={styles['testimonial-avatar']}>AL</div>
                <div className={styles['testimonial-info']}>
                  <h4>Ana Luiza</h4>
                  <div className={styles['testimonial-stars']}>★★★★★</div>
                </div>
              </div>
              <p className={styles['testimonial-text']}>"O atendimento é impecável! O corte ficou exatamente como eu queria e os produtos usados deixaram meu cabelo maravilhoso."</p>
            </div>
            <div className={styles['testimonial-card']}>
              <div className={styles['testimonial-header']}>
                <div className={styles['testimonial-avatar']}>CF</div>
                <div className={styles['testimonial-info']}>
                  <h4>Carlos Ferreira</h4>
                  <div className={styles['testimonial-stars']}>★★★★★</div>
                </div>
              </div>
              <p className={styles['testimonial-text']}>"Ambiente extremamente agradável e profissionais muito capacitados. Melhor salão que já frequentei."</p>
            </div>
            <div className={styles['testimonial-card']}>
              <div className={styles['testimonial-header']}>
                <div className={styles['testimonial-avatar']}>MP</div>
                <div className={styles['testimonial-info']}>
                  <h4>Mariana Prado</h4>
                  <div className={styles['testimonial-stars']}>★★★★★</div>
                </div>
              </div>
              <p className={styles['testimonial-text']}>"Fiz luzes e o resultado foi surpreendente. A equipe tem um cuidado incrível para não danificar os fios."</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles['footer-grid']}>
          <div className={styles['footer-col']}>
            <h3>Sebastian Cabelo e Estética</h3>
            <p>📍 Rua Jesuíno dos Santos, 145 - Jaú, São Paulo</p>
            <p>📞 (11) 98765-4321</p>
            <p>🕒 Seg a Sáb: 09h às 20h</p>
          </div>
          <div className={styles['footer-col']}>
            <h3>Links Rápidos</h3>
            <ul className={styles['footer-links']}>
              <li><Link to="/servicos">Nossos Serviços</Link></li>
              <li><Link to="/agendamento">Agendar Horário</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles['footer-bottom']}>
          <p>&copy; 2026 Sebastian Cabelo e Estética. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
