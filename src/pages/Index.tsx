import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CategoryCard } from '@/components/CategoryCard';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';
import { useI18n, loadTranslations } from '@/lib/i18n';
import { Experience } from '@/types/experience';

const Index = () => {
  const { t } = useI18n();
  const [categories, setCategories] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await loadTranslations();
      
      try {
        const response = await fetch('/data/experiences.json');
        const data = await response.json();
        setCategories(data.modes || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Explore as Categorias
            </h2>
            <p className="text-lg text-muted-foreground">
              Escolha uma categoria e descubra ofertas exclusivas
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;