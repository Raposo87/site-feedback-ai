import { useI18n } from '@/lib/i18n';
import { Search, Copy, Gift } from 'lucide-react';

export const HowItWorks = () => {
  const { t } = useI18n();

  const steps = [
    {
      icon: Search,
      title: t('howItWorks.step1Title'),
      description: t('howItWorks.step1Text'),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Copy,
      title: t('howItWorks.step2Title'),
      description: t('howItWorks.step2Text'),
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: Gift,
      title: t('howItWorks.step3Title'),
      description: t('howItWorks.step3Text'),
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            dangerouslySetInnerHTML={{ __html: t('howItWorks.title') }}
          />
          <p className="text-lg text-muted-foreground">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="absolute -top-4 left-6">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                </div>

                <div className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-8 h-8 ${step.color}`} />
                </div>

                <h3 className="font-display text-xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};