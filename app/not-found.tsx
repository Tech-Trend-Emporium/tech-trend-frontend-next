import { ErrorTemplate } from "@/src/components";
import { SearchX } from "lucide-react";


export default function NotFoundPage() {
    return (
        <ErrorTemplate
            code="404"
            icon={SearchX}
            title="Page Not Found"
            description="The page you are looking for doesn't exist or has been moved. Please check the URL or explore our main sections."
        />
    );
};