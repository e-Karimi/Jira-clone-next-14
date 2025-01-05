import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button size="lg" disabled className="font-sans font-semibold">primary</Button>
      <Button variant="link" className="font-sans font-semibold">link</Button>
      <Button variant="tertiary" className="font-sans">tertiary</Button>
      <h1 className="text-2xl">Home</h1>
    </div>
  );
}
