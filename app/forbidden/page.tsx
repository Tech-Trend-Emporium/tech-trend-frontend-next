import { ErrorTemplate } from "@/src/components";
import { Lock } from "lucide-react";


export default function ForbiddenPage() {
    return (
        <ErrorTemplate
            code="403"
            icon={Lock}
            title="Access Forbidden"
            description="You don't have permission to access this page. This section is restricted and requires special authorization."
        />
    );
};