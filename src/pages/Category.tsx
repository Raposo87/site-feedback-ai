import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Experience, Partner } from '@/types/experience';
import { useI18n } from '@/lib/i18n';

const Category = () => {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const [category, setCategory] = useState<Experience | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();
  const { lang, t } = useI18n();

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const response = await fetch('/data/experiences.json');
        const data = await response.json();
        const foundCategory = data.modes.find((mode: Experience) => mode.slug === slug);
        setCategory(foundCategory || null);
      } catch (error) {
        console.error('Failed to load category:', error);
      }
    };

    if (slug) {
      loadCategory();
    }
  }, [slug]);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast({
        title: t('toast.codeCopied'),
        description: t('toast.codeCopied'),
      });
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Helper function to get translated text
  const getTranslated = (field: any): string => {
    if (typeof field === 'object' && field !== null) {
      return field[lang] || field.en || '';
    }
    return field || '';
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('experiencePage.notFound')}</h1>
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
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {lang === 'pt' ? 'Voltar às categorias' : 'Back to categories'}
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl">
              {category.partners[0]?.icon && <i className={category.partners[0].icon} />}
            </div>
            <Badge variant="secondary" className="text-base">
              {getTranslated(category.badge)}
            </Badge>
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            {getTranslated(category.title)}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {getTranslated(category.description)}
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.partners.map((partner: Partner) => (
              <Card key={partner.partner_slug} className="overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-lg">
                <div className="relative h-48 overflow-hidden bg-muted">
                  {partner.images.length > 0 ? (
                    <img
                      src={partner.images[0]}
                      alt={partner.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {partner.icon && <i className={partner.icon} />}
                    </div>
                  )}

                  {partner.discount_label && (
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-red-500 text-white text-sm font-bold shadow-lg">
                      🎉 {partner.discount_label}
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-1">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      📍 {getTranslated(partner.location)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground line-through">
                      {partner.price_original}
                    </span>
                    <span className="text-2xl font-bold text-orange-500">
                      {partner.price_discount}
                    </span>
                  </div>

                  <div className="text-sm font-medium text-green-600">
                    {getTranslated(partner.savings)}
                  </div>

                  <Link to={`/partner?slug=${partner.partner_slug}&category=${category.slug}`}>
                    <Button className="w-full">
                      {lang === 'pt' ? 'Comprar Voucher' : 'Buy Voucher'}
                    </Button>
                  </Link>
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

export default Category;
