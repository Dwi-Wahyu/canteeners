"use client";

import { getCategories } from "@/app/admin/kategori/queries";

export default function ShopCategoryScroller({
  categoryId,
  categories,
  setCategoryId,
}: {
  categoryId: number | null;
  categories: Awaited<ReturnType<typeof getCategories>>;
  setCategoryId: (id: number) => void;
}) {
  const itemWidthClass =
    "min-w-[calc(100%/3)] sm:min-w-[160px] md:min-w-[200px]";

  return (
    <div
      className="w-full overflow-x-auto pt-3 pb-2"
      style={{
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      <style jsx global>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="flex space-x-2 px-2">
        {categories.map((category) => (
          <div
            onClick={() => {
              setCategoryId(category.id);
            }}
            className={`
              ${itemWidthClass}
              flex-shrink-0
              flex cursor-pointer flex-col gap-2 items-center text-center
              transition-opacity duration-200
            `}
            key={category.id}
          >
            <div
              className={`
                p-1 shadow-md rounded-full border-4
                transition-all duration-300 ease-in-out
                ${
                  category.id === categoryId
                    ? "border-primary/50 shadow-lg scale-105"
                    : "border-transparent hover:shadow-xl hover:scale-105"
                }
              `}
            >
              <img
                src={"/uploads/category/" + category.image_url}
                alt={category.name + " image"}
                width="96"
                height="96"
                className="rounded-full object-cover w-24 h-24"
              />
            </div>
            <h1
              className={`
                text-sm font-semibold whitespace-normal leading-tight max-w-[90%]
                ${
                  category.id === categoryId
                    ? "text-primary"
                    : "text-gray-700 dark:text-gray-300"
                }
              `}
            >
              {category.name}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}
