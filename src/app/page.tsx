import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button size="lg" disabled>default</Button>
      <Button variant="link">link</Button>
      <Button variant="tertiary">tertiary</Button>
      <h1 className="text-2xl">hi</h1>
    </div>
  );
}
