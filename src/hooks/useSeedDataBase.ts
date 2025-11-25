import { useEffect, useState } from "react";
import { ProductService } from "../services";
import { saveCache } from "../utils";

export const useSeedDataBase = () => {
  const [seeded, setSeeded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (seeded) return;

    const seed = async () => {
      try {
        setLoading(true);
        const initialData = await ProductService.list({
          skip: 0,
          take: 200
        });

        saveCache(undefined, {
          products: initialData.items ?? [],
          skip: initialData.items?.length ?? 0
        });

        setSeeded(true);
      } catch (error) {
        console.error("Error seeding database:", error);
      } finally {
        setLoading(false);
      }
    };

    seed();
  }, [seeded]);

  return { seeded, loading };
};
