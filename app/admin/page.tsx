import { Button } from "@/src/components";


export default function AdminEmployeePortalPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center px-4 py-10">
            {/* Page title */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
                Employee Portal
            </h1>

            {/* Buttons grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
                <Button href="/admin/products/create" variant="outline" fullWidth>
                    Create Product
                </Button>

                <Button href="/admin/products" variant="outline" fullWidth>
                    List Products
                </Button>

                <Button href="/admin/categories/create" variant="outline" fullWidth>
                    Create Category
                </Button>

                <Button href="/admin/categories" variant="outline" fullWidth>
                    List Categories
                </Button>

                <Button href="/sign-up" variant="outline" fullWidth>
                    Create Employee
                </Button>

                <Button href="/" variant="outline" fullWidth>
                    View All Users
                </Button>

                <Button href="/" variant="outline" fullWidth>
                    Create Coupons
                </Button>

                <Button href="/" variant="outline" fullWidth>
                    View Coupons
                </Button>

                <Button href="/" variant="outline" fullWidth>
                    Create Recovery Question
                </Button>

                <Button href="/" variant="outline" fullWidth>
                    View Recovery Questions
                </Button>

                <Button href="/" variant="outline" fullWidth>
                    Review Jobs
                </Button>

                <Button href="/" variant="outline" fullWidth>
                    Inventory
                </Button>
            </div>
        </div>
    );
};
