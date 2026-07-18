import { LinkButton } from "@/components/ui/Button";

/** Bottom call-to-action band. */
export function CTA() {
  return (
    <section className="bg-gradient-to-r from-navy to-navy-light py-16 text-white">
      <div className="container-x text-center">
        <h2 className="text-3xl font-extrabold">Enroll Today &amp; Secure Your Future!</h2>
        <p className="mx-auto mt-2 max-w-2xl text-slate-300">
          Join Shalom Training School and gain the practical skills employers are looking for.
        </p>
        <div className="mt-7">
          <LinkButton href="/apply" variant="green">Start Your Application</LinkButton>
        </div>
      </div>
    </section>
  );
}
