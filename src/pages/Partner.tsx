import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Partner as PartnerType, Experience } from '@/types/experience';
import { Copy, Check, ExternalLink, ChevronRight, MapPin, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/lib/i18n';

const Partner = () => {
  const [searchParams] = useSearchParams();
  const partnerSlug = searchParams.get('slug');
  const categorySlug = searchParams.get('category');
  const [partner, setPartner] = useState<PartnerType | null>(null);
  const [category, setCategory] = useState<Experience | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { toast } = useToast();
  const { lang } = useI18n();

  useEffect(() => {
    const loadPartner = async () => {
      try {
        const response = await fetch('/data/experiences.json');
        const data = await response.json();
        
        // Find the category and partner
        for (const mode of data.modes) {
          const foundPartner = mode.partners.find(
            (p: PartnerType) => p.partner_slug === partnerSlug
          );
          if (foundPartner) {
            setPartner(foundPartner);
            setCategory(mode);
            break;
          }
        }
      } catch (error) {
        console.error('Failed to load partner:', error);
      }
    };

    if (partnerSlug) loadPartner();
  }, [partnerSlug]);

  const copyCode = async () => {
    if (!partner) return;
    try {
      await navigator.clipboard.writeText(partner.code);
      setCopiedCode(true);
      toast({
        title: lang === 'pt' ? 'Código copiado!' : 'Code copied!',
        description: lang === 'pt' ? 'O código foi copiado para a área de transferência' : 'The code was copied to clipboard',
      });
      setTimeout(() => setCopiedCode(false), 2000);
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

  if (!partner || !category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">{lang === 'pt' ? 'Parceiro não encontrado' : 'Partner not found'}</h1>
          <Link to="/">
            <Button>{lang === 'pt' ? 'Voltar à página inicial' : 'Back to homepage'}</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              {lang === 'pt' ? 'Início' : 'Home'}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link 
              to={`/category?slug=${category.slug}`}
              className="hover:text-primary transition-colors"
            >
              {getTranslated(category.title)}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{partner.name}</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                {partner.images.length > 0 ? (
                  <img
                    src={partner.images[selectedImage]}
                    alt={`${partner.name} - Imagem ${selectedImage + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">
                    {partner.icon && <i className={partner.icon} />}
                  </div>
                )}
                
                {partner.discount_label && (
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-red-500 text-white text-base font-bold shadow-lg">
                    🎉 {partner.discount_label}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {partner.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {partner.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary scale-95'
                          : 'border-transparent hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3">
                  {getTranslated(category.badge)}
                </Badge>
                <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                  {partner.name}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{getTranslated(partner.location)}</span>
                </div>
              </div>

              {/* Pricing */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-primary">
                      {partner.price_discount}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      {partner.price_original}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 text-white text-base px-3 py-1">
                      {getTranslated(partner.savings)}
                    </Badge>
                  </div>

                  {/* Promo Code */}
                  <div className="bg-background/80 backdrop-blur rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">
                        {lang === 'pt' ? 'Código promocional:' : 'Promo code:'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-4 py-3 bg-muted rounded-lg font-mono text-lg font-bold text-primary">
                        {partner.code}
                      </code>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={copyCode}
                        className="h-12 w-12"
                      >
                        {copiedCode ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 text-base" 
                    size="lg"
                    asChild
                  >
                    <a 
                      href={partner.official_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      {lang === 'pt' ? 'Ver ofertas no site oficial' : 'View offers on official website'}
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </Card>

              {/* Description */}
              {partner.detailed_description && (
                <Card className="p-6">
                  <h2 className="font-display text-2xl font-semibold mb-4">
                    {lang === 'pt' ? `Sobre ${partner.name}` : `About ${partner.name}`}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {partner.detailed_description}
                  </p>
                </Card>
              )}

              {/* Additional Info */}
              <Card className="p-6 bg-muted/30">
                <h3 className="font-semibold mb-3">
                  {lang === 'pt' ? 'Como usar o desconto:' : 'How to use the discount:'}
                </h3>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>{lang === 'pt' ? 'Copie o código promocional acima' : 'Copy the promo code above'}</li>
                  <li>{lang === 'pt' ? 'Clique em "Ver ofertas no site oficial"' : 'Click "View offers on official website"'}</li>
                  <li>{lang === 'pt' ? 'Escolha sua experiência' : 'Choose your experience'}</li>
                  <li>{lang === 'pt' ? 'Cole o código no checkout para receber o desconto' : 'Paste the code at checkout to receive the discount'}</li>
                </ol>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partner;
