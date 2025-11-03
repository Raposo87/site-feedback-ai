import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Experience } from '@/types/experience';
import { useI18n } from '@/lib/i18n';

interface CategoryCardProps {
  category: Experience;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const { lang, t } = useI18n();
  const firstPartner = category.partners[0];
  const images = firstPartner?.images || [];

  // Helper function to get translated text
  const getTranslated = (field: any): string => {
    if (typeof field === 'object' && field !== null) {
      return field[lang] || field.en || '';
    }
    return field || '';
  };

  return (
    <Link to={`/category?slug=${category.slug}`}>
      <Card className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative h-32 sm:h-40 overflow-hidden bg-muted">
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={getTranslated(category.title)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl">
              {firstPartner?.icon && <i className={firstPartner.icon} />}
            </div>
          )}

          {firstPartner?.discount_label && (
            <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-bold shadow-lg">
              <span className="mr-1">🔥</span>
              {lang === 'pt' ? 'Popular' : 'Popular'}
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {getTranslated(category.badge)}
            </Badge>
          </div>

          <h3 className="font-display text-base sm:text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {getTranslated(category.title)}
          </h3>

          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {getTranslated(category.description)}
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">
              {category.partners.length} {category.partners.length === 1 ? t('experiencePage.offers') : t('experiencePage.offersPlural')}
            </span>
            <ChevronRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
};
