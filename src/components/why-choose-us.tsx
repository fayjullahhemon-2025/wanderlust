import Image from "next/image";

const features = [
  {
    icon: "/assets/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/assets/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/assets/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-cyan-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="text-center">
          <h2 className="text-4xl font-medium sm:text-5xl">
            Why Choose Wanderlust
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-3">
          {features.map(({ icon, title, description }) => (
            <div key={title} className="bg-white p-8 shadow-sm">
              <Image
                src={icon}
                alt=""
                aria-hidden
                width={48}
                height={48}
                className="h-10 w-10"
              />
              <h3 className="mt-6 text-xl text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
