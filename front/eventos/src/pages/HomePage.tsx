export function HomePage() {
  return (
    <div className="container mx-auto p-8 text-center flex flex-col items-center justify-center" style={{height: 'calc(100vh - 96px)'}}>
      <h1 className="text-6xl sm:text-8xl lg:text-9xl font-extrabold mb-8 text-white leading-tight">
        Plataforma Definitiva de <span className="text-cyan-400">Eventos</span>
      </h1>
      <p className="text-xl sm:text-2xl lg:text-3xl text-gray-400 max-w-4xl">
        Descubra, participe e organize os melhores eventos. Faça login para ver os eventos disponíveis ou para criar o seu.
      </p>
    </div>
  );
}