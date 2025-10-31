import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/lib/i18n';
import { Experience as ExperienceType, Partner } from '@/types/experience';
import { Copy, Check, ExternalLink, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const Experience = () => {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const { t } = useI18n();
  const [experience, setExperience] = useState<ExperienceType | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const loadExperience = async () => {
      try {
        const response = await fetch('/data/experiences.json');
        const data = await response.json();
        const found = data.modes.find((m: ExperienceType) => m.slug === slug);
        setExperience(found || null);
      } catch (error) {
        console.error('Failed to load experience:', error);
      }
    };

    if (slug) loadExperience();
  }, [slug]);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(t('toast.codeCopied'));
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error(t('toast.error'));
    }
  };

  if (!experience) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">{t('experiencePage.notFound')}</h1>
          <Link to="/">
            <Button>{t('experiencePage.home')}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-purple-900 text-primary-foreground py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm mb-6 text-primary-foreground/80">
            <Link to="/" className="hover:text-primary-foreground">
              {t('experiencePage.home')}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary-foreground">{experience.title}</span>
          </nav>

          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              {experience.badge}
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              {experience.title}
            </h1>
            <p className="text-xl text-primary-foreground/90">
              {experience.description}
            </p>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-lg text-muted-foreground">
              {experience.partners.length} {t('experiencePage.offers')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {experience.partners.map((partner: Partner) => (
              <Card key={partner.partner_slug} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid md:grid-cols-2 gap-4 p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-display text-2xl font-bold mb-2">
                        {partner.name}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <span>📍</span> {partner.location}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                          {partner.price_discount}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          {partner.price_original}
                        </span>
                      </div>
                      <Badge className="bg-secondary text-secondary-foreground">
                        {partner.discount_label} · {partner.savings}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-muted rounded-lg font-mono text-sm">
                          {partner.code}
                        </code>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => copyCode(partner.code)}
                        >
                          {copiedCode === partner.code ? (
                            <Check className="w-4 h-4 text-success" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => window.open(partner.official_url, '_blank')}
                      >
                        {t('buttons.goToSite')}
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="relative h-48 md:h-auto rounded-lg overflow-hidden bg-muted">
                    {partner.images[0] && (
                      <img
                        src={partner.images[0]}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400';
                        }}
                      />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Experience;