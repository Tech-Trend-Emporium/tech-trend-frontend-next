import { ErrorTemplate } from "@/src/components";
import { SearchX } from "lucide-react";
import { memo } from "react";


const NotFoundPageInner = () => {
    return (
        <ErrorTemplate
            code="404"
            icon={SearchX}
            title="Page Not Found"
            description="The page you are looking for doesn't exist or has been moved. Please check the URL or explore our main sections."
        />
    );
};

export default memo(NotFoundPageInner);