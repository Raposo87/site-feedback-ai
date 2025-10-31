import { useI18n } from '@/lib/i18n';

export const Hero = () => {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-purple-900 text-primary-foreground">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <span className="text-xl">✨</span>
            <span className="text-sm font-medium">{t('hero.badge')}</span>
          </div>

          <h1 
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            dangerouslySetInnerHTML={{ __html: t('hero.title') }}
          />

          <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="text-2xl">🎯</span>
              <div className="text-left">
                <div className="text-2xl font-bold">25%</div>
                <div className="text-xs opacity-90">{t('hero.avgDiscount')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <div className="text-2xl font-bold">2.5k+</div>
                <div className="text-xs opacity-90">{t('hero.happyCustomers')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};