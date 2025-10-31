import { useI18n } from '@/lib/i18n';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🎫</span>
              <span className="font-display text-2xl font-bold">
                Voucher<span className="text-secondary">Hub</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.experiences')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">{t('footer.waterSports')}</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">{t('footer.adventure')}</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">{t('footer.culture')}</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">{t('footer.gastronomy')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">{t('footer.howItWorks')}</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">{t('footer.faq')}</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">{t('footer.contact')}</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">{t('footer.terms')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get exclusive deals delivered to your inbox
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background"
              />
              <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 VoucherHub. {t('footer.copyright')}</p>
          <p className="mt-2">{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
};