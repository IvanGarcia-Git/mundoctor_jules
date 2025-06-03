
import React from 'react';

const categories = [
  "Médicos", "Enfermeros", "Dentistas", "Fisioterapeutas", "Psicólogos",
  "Ópticos", "Farmacéuticos", "Nutricionistas", "Podólogos", "Logopedas"
];

const CategoriesSection = () => {
  return (
    <section className="py-16 md:py-20 bg-[#0B1120]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          Categorías de Profesionales
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category) => (
            <button
              key={category}
              className="p-4 md:p-6 text-center rounded-lg bg-gray-900/70 border border-gray-700/50 hover:border-blue-500/70 hover:bg-gray-800/70 transition-all duration-300 group"
            >
              <span className="text-gray-300 group-hover:text-white text-sm md:text-base font-medium transition-colors">{category}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
