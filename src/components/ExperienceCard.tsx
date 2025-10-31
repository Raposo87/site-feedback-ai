import { Experience } from '@/types/experience';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface ExperienceCardProps {
  experience: Experience;
}

export const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  const { t } = useI18n();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const firstPartner = experience.partners[0];
  const images = firstPartner?.images || [];

  return (
    <Link to={`/experience?slug=${experience.slug}`}>
      <Card className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative h-48 sm:h-56 overflow-hidden bg-muted">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={experience.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800';
                }}
              />
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentImageIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentImageIndex
                          ? 'bg-white w-6'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`Image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {firstPartner?.icon && <i className={firstPartner.icon} />}
            </div>
          )}

          {firstPartner?.discount_label && (
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-bold shadow-lg">
              <span className="mr-1">🎉</span>
              {firstPartner.discount_label}
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {experience.badge}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {experience.partners.length} {experience.partners.length === 1 ? 'oferta' : 'ofertas'}
            </span>
          </div>

          <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
            {experience.title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {experience.description}
          </p>

          <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
            {t('buttons.revealCode')}
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </Card>
    </Link>
  );
};