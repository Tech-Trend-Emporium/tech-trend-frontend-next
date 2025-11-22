import { Footer, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup } from "flowbite-react";
import { FooterBrand } from "@/src/components";


export const FooterComponent = ({ currentYear }: { currentYear: number }) => {
  return (
    <Footer container className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
      <div className="w-full text-center">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full px-4">
          <FooterBrand
            href="#"
            srcLight="/logo-black-text.png"
            srcDark="/logo-white-text.png"
            alt="Tech Trend Logo"
            name="Tech Trend Emporium"
            height={32}
            className="shrink-0"
            imgClassName="h-8 w-auto"
          />

          <FooterLinkGroup className="mt-4 sm:mt-0">
            <FooterLink href="#" className="footer-link-custom">About</FooterLink>
            <FooterLink href="#" className="footer-link-custom">Privacy Policy</FooterLink>
            <FooterLink href="#" className="footer-link-custom">Licensing</FooterLink>
            <FooterLink href="#" className="footer-link-custom">Contact</FooterLink>
          </FooterLinkGroup>
        </div>

        <FooterDivider className="my-4 border-gray-200 dark:border-gray-700" />

        <FooterCopyright href="#" by="Tech Trend Emporium™" year={currentYear} />
      </div>
    </Footer>
  );
};
