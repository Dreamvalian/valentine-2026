import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home question-based flow and single envelope", () => {
  it("renders empathetic questions and inputs", () => {
    render(<Home />);

    expect(
      screen.getByText(/how are you feeling today\?/i),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(
        /in your own words, how are you feeling right now\?/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /gently open an envelope/i }),
    ).toBeInTheDocument();
  });

  it("takes a free-text feeling and shows a single tailored envelope", () => {
    render(<Home />);

    const feelingInput = screen.getByLabelText(
      /in your own words, how are you feeling right now\?/i,
    );
    fireEvent.change(feelingInput, {
      target: { value: "She feels really lonely and a bit anxious tonight." },
    });

    const generateButton = screen.getByRole("button", {
      name: /gently open an envelope/i,
    });
    fireEvent.click(generateButton);

    expect(
      screen.getByRole("button", { name: /back to options/i }),
    ).toBeInTheDocument();

    expect(screen.getByText(/Open when you feel lonely/i)).toBeInTheDocument();
  });
});
