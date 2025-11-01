import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Experience } from '@/types/experience';

interface CategoryCardProps {
  category: Experience;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const firstPartner = category.partners[0];
  const images = firstPartner?.images || [];

  return (
    <Link to={`/category?slug=${category.slug}`}>
      <Card className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative h-48 sm:h-56 overflow-hidden bg-muted">
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={category.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {firstPartner?.icon && <i className={firstPartner.icon} />}
            </div>
          )}

          {firstPartner?.discount_label && (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-orange-500 text-white text-sm font-bold shadow-lg">
              <span className="mr-1">🔥</span>
              Popular
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="text-3xl">
              {firstPartner?.icon && <i className={firstPartner.icon} />}
            </div>
            <Badge variant="secondary" className="text-xs">
              {category.badge}
            </Badge>
          </div>

          <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
            {category.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {category.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">
              {category.partners.length} {category.partners.length === 1 ? 'oferta' : 'ofertas'}
            </span>
            <ChevronRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
};
