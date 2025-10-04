import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="flex justify-between py-6">
      <p className="text-2xl font-semibold">
        Symulator <span className="text-primary">Emerytalny</span>
      </p>
      <nav>
        <Button variant={"outline"}>Panel administratora</Button>
      </nav>
    </header>
  );
};
