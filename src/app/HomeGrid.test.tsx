import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home selection and single envelope flow", () => {
  const titles = [
    "Open when you're sad",
    "Open when you're happy",
    "Open when you miss me",
    "Open when you're excited",
    "Open when you want to hear something nice",
    "Open when you feel lonely",
    "Open when you're angry",
    "Open when you can't sleep",
    "Open when you need a reminder of my love",
    "Open when you're bored",
    "Open when you're proud of yourself",
    "Open when you feel grateful",
  ];

  it("renders a reduced primary set by default and can expand to all options", () => {
    render(<Home />);

    const primary = [
      "Open when you're sad",
      "Open when you're happy",
      "Open when you miss me",
      "Open when you need a reminder of my love",
    ];

    primary.forEach((t) => {
      expect(screen.getByRole("button", { name: t })).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", {
        name: "Open when you're excited",
      }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /show more options/i }));

    titles.forEach((t) => {
      expect(screen.getByRole("button", { name: t })).toBeInTheDocument();
    });
  });

  it("selects an option and shows exactly one envelope after clicking Open Envelope", async () => {
    render(<Home />);
    const sadBtn = screen.getByRole("button", { name: "Open when you're sad" });
    fireEvent.click(sadBtn);

    const openButton = screen.getByRole("button", { name: /open envelope/i });
    fireEvent.click(openButton);

    // The options grid should be gone
    expect(screen.queryByLabelText("options grid")).not.toBeInTheDocument();

    // The selected title should remain visible as the envelope hint/label
    expect(screen.getByText("Open when you're sad")).toBeInTheDocument();

    // Another option title should not be present
    expect(
      screen.queryByText("Open when you're happy"),
    ).not.toBeInTheDocument();
  });

  it("options grid has responsive classes", () => {
    render(<Home />);
    const grid = screen.getByLabelText("options grid");
    expect(grid.className).toMatch(/grid-cols-1/);
    expect(grid.className).toMatch(/sm:grid-cols-2/);
    expect(grid.className).toMatch(/lg:grid-cols-3/);
  });
});
