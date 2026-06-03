interface AdventistLogoProps {
  className?: string;
  compact?: boolean;
}

export const AdventistLogo: React.FC<AdventistLogoProps> = ({ className, compact = false }) => {
  return (
    <img
      src="/images/adventist-logo.png"
      alt="Seventh-day Adventist Church"
      className={`${compact ? 'h-8 sm:h-10' : 'h-10 sm:h-12 lg:h-14'} w-auto object-contain ${className ?? ''}`}
    />
  );
};
