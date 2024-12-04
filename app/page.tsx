import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {

  return (
    <div className="flex items-center justify-center">
      <Card className="w-[80%]">
        <CardHeader>
          <CardTitle>Home</CardTitle>
          <CardDescription>Home Page Description</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}