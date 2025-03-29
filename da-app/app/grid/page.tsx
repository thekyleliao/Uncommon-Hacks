"use client";

export default function Home() {
  const data = [
    { id: 1, answer: "Answer 1" },
    { id: 2, answer: "Answer 2" },
    { id: 3, answer: "Answer 3" },
    { id: 4, answer: "Answer 4" },
    { id: 5, answer: "Answer 5" },
    { id: 6, answer: "Answer 6" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-8 font-sans">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8">
        {data.map((item) => (
          <div
            key={item.id}
            className="border-2 border-gray-400 rounded-lg p-6 flex items-center justify-center hover:shadow-md transition-all duration-200"
          >
            <span className="text-white text-lg font-light tracking-tight">
              {item.answer}
            </span>
          </div>
        ))}
      </div>
      
      <button
        onClick={handlePrint}
        className="border-2 border-white text-white font-light py-3 px-6 rounded-lg hover:bg-white hover:text-black transition-all duration-300 tracking-tight uppercase text-sm"
      >
        Print
      </button>
    </main>
  );
}