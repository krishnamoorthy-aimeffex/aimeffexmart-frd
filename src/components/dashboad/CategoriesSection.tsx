import { ChevronRight } from "lucide-react";
import { type ReactNode } from "react";

interface Category {
  name: string;
  color?: string;
  icon?: ReactNode;
}

interface CategoriesSectionProps {
  categories: Category[];
  onCategoryClick?: (categoryName: string) => void;
  selectedCategory?: string;
}

function CategoriesSection({
  categories,
  onCategoryClick,
  selectedCategory,
}: CategoriesSectionProps) {
  return (
    <>
      <section id="categories" className="py-12 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <button className="text-purple-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => onCategoryClick?.(category.name)}
                className={`group cursor-pointer bg-gray-50 rounded-2xl p-6 text-center shadow-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                  selectedCategory === category.name
                    ? "ring-2 ring-purple-600 shadow-xl"
                    : ""
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform`}
                >
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default CategoriesSection;
