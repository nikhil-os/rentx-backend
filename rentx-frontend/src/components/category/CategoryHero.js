import Image from "next/image";

export default function CategoryHero() {
  return (
    <section className="hero text-white relative" style={{background: 'linear-gradient(135deg, rgba(27, 60, 52, 0.9) 0%, rgba(29, 53, 87, 0.9) 100%), url(https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80) no-repeat center center/cover', padding: '80px 0'}}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Browse Categories</h1>
            <p className="text-lg mb-4">Find the perfect rental category for your needs. From electronics to fashion, we have it all!</p>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="rounded-lg overflow-hidden shadow-lg bg-white/10">
              <Image src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Categories" width={600} height={400} className="w-full h-64 object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
