import { useI18n } from '@/lib/i18n';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

export const Navbar = () => {
  const { lang, setLang, t } = useI18n();

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="VoucherHub Logo" className="h-12" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-xl">🔥</span>
              <span className="text-sm font-medium text-primary">
                {t('nav.badge')}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-muted rounded-full p-1">
              <Button
                variant={lang === 'pt' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLang('pt')}
                className="rounded-full h-8 px-3 text-xs"
              >
                🇵🇹 PT
              </Button>
              <Button
                variant={lang === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLang('en')}
                className="rounded-full h-8 px-3 text-xs"
              >
                🇺🇸 EN
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};