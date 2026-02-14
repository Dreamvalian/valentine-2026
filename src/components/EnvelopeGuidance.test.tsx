import { fireEvent, render, screen } from "@testing-library/react";
import Envelope from "./Envelope";

describe("Envelope guidance uses theme accents and transitions", () => {
  it("applies blue accent for sad theme", async () => {
    render(
      <Envelope theme='sad' title="Open when you're sad" letters={[["Hi"]]} />,
    );
    fireEvent.click(screen.getByLabelText("Open when you're sad"));
    const guidance = await screen.findByText(/tap reply/i);
    expect(guidance.className).toMatch(/text-blue-700/);
    expect(guidance.className).toMatch(/transition-colors/);
  });

  it("applies rose accent for love reminder theme", async () => {
    render(
      <Envelope
        theme='loveReminder'
        title='Open when you need a reminder of my love'
        letters={[["Hi"]]}
      />,
    );
    fireEvent.click(
      screen.getByLabelText("Open when you need a reminder of my love"),
    );
    const guidance = await screen.findByText(/tap reply/i);
    expect(guidance.className).toMatch(/text-rose-700/);
  });
});
