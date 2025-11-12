type FooterBrandProps = {
  href?: string;
  /** Light-mode logo (usually black text) */
  srcLight: string;
  /** Dark-mode logo (usually white text) */
  srcDark: string;
  alt?: string;
  /** Optional brand name to show next to the logo */
  name?: string;
  /** Height for the logo images (number = px) */
  height?: number | string;
  /** Extra classes for the outer wrapper */
  className?: string;
  /** Extra classes applied to the <img> elements */
  imgClassName?: string;
  /** Puts the text before the logo (rare, but handy) */
  textFirst?: boolean;
};

export const FooterBrand = ({
  href = "#",
  srcLight,
  srcDark,
  alt = "Brand logo",
  name,
  height = 32,
  className = "",
  imgClassName = "",
  textFirst = false,
}: FooterBrandProps) => {
  const h = typeof height === "number" ? `${height}px` : height;

  const LogoPair = (
    <>
      {/* Light logo visible by default, hidden in dark */}
      <img
        src={srcLight}
        alt={alt}
        style={{ height: h }}
        className={`block dark:hidden ${imgClassName}`}
      />
      {/* Dark logo hidden by default, visible in dark */}
      <img
        src={srcDark}
        alt={alt}
        style={{ height: h }}
        className={`hidden dark:block ${imgClassName}`}
      />
    </>
  );

  return (
    <a
      href={href}
      className={`inline-flex items-center gap-2 select-none ${className}`}
      aria-label={name ?? alt}
    >
      {textFirst && name ? (
        <>
          <span className="text-base font-semibold leading-none dark:text-white hover:transform hover:scale-105 transition-transform">
            {name}
          </span>
          {LogoPair}
        </>
      ) : (
        <>
          {LogoPair}
          {name && (
            <span className="text-base font-semibold leading-none dark:text-white hover:transform hover:scale-105 transition-transform">
              {name}
            </span>
          )}
        </>
      )}
    </a>
  );
};