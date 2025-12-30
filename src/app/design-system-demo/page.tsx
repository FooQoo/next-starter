'use client';

import {
  Button,
  Input,
  Label,
  Link,
  Checkbox,
  Radio,
} from '@/components/atoms/digital-go-jp';

export default function DesignSystemDemo() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Design System Demo</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <Button size="lg" variant="solid-fill">
            Large Solid Button
          </Button>
          <Button size="md" variant="outline">
            Medium Outline Button
          </Button>
          <Button size="sm" variant="text">
            Small Text Button
          </Button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Inputs</h2>
        <div className="max-w-md space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Enter your name" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Checkbox & Radio</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox id="agree">I agree to the terms</Checkbox>
          </div>
          <div className="flex flex-col gap-2">
            <Radio value="option1" name="demo">
              Option 1
            </Radio>
            <Radio value="option2" name="demo">
              Option 2
            </Radio>
            <Radio value="option3" name="demo">
              Option 3
            </Radio>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Links</h2>
        <div className="space-y-2">
          <div>
            <Link href="https://example.com">External Link</Link>
          </div>
          <div>
            <Link href="/about">Internal Link</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
